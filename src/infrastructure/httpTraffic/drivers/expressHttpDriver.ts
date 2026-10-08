import      express                         from 'express';
import      crypto                          from 'crypto';
import type * as ExpressEngine              from 'express';
import type { HttpTrafficExchangeEngine, 
              HttpTrafficHandler,
              HttpTrafficRequest }          from '../engine/httpTraffic';
import type { HttpFailureFormatter }        from '../../../api/errors/domainException';
import type { SystemLogger }                from '../../telemetry/engine/systemLogger';
import type { TokenCryptographerEngine }    from '../../security/engine/tokenSession';
import type { ApiKeyEvaluatorEngine }       from '../../security/engine/apiKeySession';
import      { RequestThrottler }            from '../../security/engine/requestThrottler';
import      { ServerLifecycleGovernor }     from '../../security/engine/serverLifecycleGovernor';
import      { ValidationException }         from '../engine/httpValidation';
import      { DomainException }             from '../../../api/errors/domainException';

export class ExpressHttpDriver implements HttpTrafficExchangeEngine {
  private readonly application        : ExpressEngine.Express;
  private readonly listeningPort      : number;
  private readonly failureFormatter   : HttpFailureFormatter;
  private readonly systemLogger       : SystemLogger;
  private readonly tokenEngine        : TokenCryptographerEngine;
  private readonly apiKeyEngine       : ApiKeyEvaluatorEngine;
  private readonly throttlerEngine    : RequestThrottler;
  private readonly lifecycleGovernor  : ServerLifecycleGovernor;
  private readonly displayDebugDetails: boolean;

  constructor(configuration: { 
    port                   : number; 
    failureFormatter       : HttpFailureFormatter; 
    systemLogger           : SystemLogger;
    tokenEngine            : TokenCryptographerEngine;
    apiKeyEngine           : ApiKeyEvaluatorEngine;
    throttlerEngine        : RequestThrottler;
    lifecycleGovernor      : ServerLifecycleGovernor;
    displayDebugDetails    : boolean; 
  }) {

    this.application            = express();
    this.listeningPort          = configuration.port;
    this.failureFormatter       = configuration.failureFormatter;
    this.systemLogger           = configuration.systemLogger;
    this.tokenEngine            = configuration.tokenEngine;
    this.apiKeyEngine           = configuration.apiKeyEngine;
    this.throttlerEngine        = configuration.throttlerEngine;
    this.lifecycleGovernor      = configuration.lifecycleGovernor;
    this.displayDebugDetails    = configuration.displayDebugDetails;
    this.application.use(express.json());

  }

  public register(
    method      : 'get' | 'post' | 'put' | 'delete', 
    resourcePath: string, 
    handler     : HttpTrafficHandler,
    schema?     : unknown
  ): void {
      this.application[method](resourcePath, async (
        incomingRequest : ExpressEngine.Request, 
        outgoingResponse: ExpressEngine.Response
    ): Promise<void> => {      
      
      // MESTRE LIFE-CYCLE: Incrementa atômica e preventivamente o contador de conexões na RAM do servidor
      try {
        this.lifecycleGovernor.incrementActiveRequests();
      } catch (terminationError: unknown) {
        // Se o container estiver em processo de morte, rejeita a nova conexão imediatamente com 503
        outgoingResponse.status(503).json({ status: 'fail', code: 'SERVER_TERMINATING', message: 'Servidor em processo de encerramento.' });
        return;
      }

      const uniqueTraceId     = crypto.randomUUID();
      const clientMetadata    = this.extractClientMetadata(incomingRequest);
      
      const contextualLogger  = this.systemLogger.withContext(uniqueTraceId, {
        clientIp     : clientMetadata.ipAddress,
        userAgent    : clientMetadata.userAgent,
        httpMethod   : method.toUpperCase(),
        resourcePath
      });

      try {
        // SRP FILTRO 1: Validação e Limitação Perimetral Multi-Tenant na Portaria
        const authenticatedApp = await this.apiKeyEngine.evaluate(String(incomingRequest.headers['x-api-key'] || '').trim());
        await this.throttlerEngine.throttle(authenticatedApp.applicationId, authenticatedApp.rateLimitTier, clientMetadata.ipAddress);

        contextualLogger.info(`Incoming HTTP request received on resource: [${resourcePath}]`);
        this.validateInputSchema(schema, incomingRequest.body);

        // SRP FILTRO 2: Hidratação da Sessão do Usuário
        const activeSessionPayload = await this.hydrateUserSession(incomingRequest, clientMetadata.ipAddress, clientMetadata.userAgentHash);

        const adaptedRequest: HttpTrafficRequest = {
          body        : incomingRequest.body,
          query       : incomingRequest.query,
          params      : incomingRequest.params,
          headers     : incomingRequest.headers,
          logger      : contextualLogger,
          session     : activeSessionPayload,
          application : authenticatedApp
        };

        const executionResponse = await handler(adaptedRequest);
        
        if (executionResponse.newToken) {
          outgoingResponse.setHeader('X-Session-Token', executionResponse.newToken);
        }

        outgoingResponse.setHeader('X-Trace-Id', uniqueTraceId);
        outgoingResponse.status(executionResponse.statusCode).json(executionResponse.body);
        
      } catch (capturedError: unknown) {
        contextualLogger.error(`Exception intercepted during HTTP processing on path: [${resourcePath}]`, capturedError);
        const { statusCode, payload } = this.failureFormatter.format(capturedError, this.displayDebugDetails);
        
        outgoingResponse.setHeader('X-Trace-Id', uniqueTraceId);
        outgoingResponse.status(statusCode).json(payload);
      } finally {
        // MESTRE LIFE-CYCLE: Rastreabilidade indestrutível na RAM. Decrementa o contador obrigatoriamente na saída
        this.lifecycleGovernor.decrementActiveRequests();
      }
    });
  }

  private extractClientMetadata(request: ExpressEngine.Request) {
    const rawClientIp     = request.ip || request.headers['x-forwarded-for'] || '127.0.0.1';
    const ipStringBase    = Array.isArray(rawClientIp) ? String(rawClientIp[0] || '127.0.0.1') : String(rawClientIp);
    const ipAddress       = ipStringBase.split(',')[0]?.trim() || '127.0.0.1';
    const userAgent       = request.headers['user-agent'] || 'unknown';
    const userAgentHash   = crypto.createHash('sha256').update(userAgent).digest('hex').substring(0, 16);

    return { ipAddress, userAgent, userAgentHash };
  }

  private validateInputSchema(schema: unknown, body: unknown): void {
    if (schema && typeof schema === 'object' && 'safeParse' in schema && typeof schema.safeParse === 'function') {
      const validationResult = (schema as any).safeParse(body);
      if (!validationResult.success) {
        const formattedErrors = validationResult.error.errors.map((issue: any) => `${issue.path.join('.')}: ${issue.message}`);
        throw new ValidationException(formattedErrors);
      }
    }
  }

  private async hydrateUserSession(request: ExpressEngine.Request, ipAddress: string, userAgentHash: string): Promise<any> {
    const authorizationHeader = request.headers['authorization'];
    const anonymousPayload = {
      actorId                : 'ANONYMOUS',
      deviceFingerprintId    : 'unknown',
      tokenUniqueId          : 'unknown',
      initialIpAddress       : ipAddress,
      clientUserAgentHash    : userAgentHash,
      requestSequenceCounter : 0,
      issuedAt               : new Date(),
      expiresAt              : new Date(),
      lastActivityAt         : new Date()
    };

    if (authorizationHeader && typeof authorizationHeader === 'string' && authorizationHeader.startsWith('Bearer ')) {
      try {
        const cleanToken = authorizationHeader.substring(7).trim();
        return await this.tokenEngine.decrypt(cleanToken);
      } catch {
        this.systemLogger.warn('Cryptographic token signature failed validation. Degrading request state to ANONYMOUS.');
      }
    }
    return anonymousPayload;
  }

    public start(): void {
    // 🛠️ MESTRE LIFE-CYCLE: Inicializa o driver de rede fisicamente e captura a instância pura do servidor HTTP
    const activeHttpServerInstance = this.application.listen(this.listeningPort, () => {
      this.systemLogger.info(`Express HTTP Driver actively running and listening on port [${this.listeningPort}]`);
    });

    // 🔌 ORQUESTRAÇÃO DE SINAIS DO OS: Escuta e vincula os gatilhos do Linux de forma enclausurada e invisível para o server.ts
    process.on('SIGTERM', () => this.lifecycleGovernor.governTerminationSignal('SIGTERM', activeHttpServerInstance));
    process.on('SIGINT',  () => this.lifecycleGovernor.governTerminationSignal('SIGINT',  activeHttpServerInstance));
  }

}
