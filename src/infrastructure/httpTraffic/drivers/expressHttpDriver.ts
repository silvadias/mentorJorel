import      express                         from 'express';
import      crypto                          from 'crypto';
import type * as ExpressEngine              from 'express';
import type { HttpTrafficExchangeEngine, 
              HttpTrafficHandler,
              HttpTrafficRequest }          from '../engine/context';
import type { HttpFailureFormatter }        from '../engine/errors';
import type { SystemLogger }                from '../../telemetry/engine/context';
import type { TokenCryptographerEngine }    from '../../security/engine/tokenContext';
import      { ValidationException }         from '../../httpTraffic/engine/validator';

export class ExpressHttpDriver implements HttpTrafficExchangeEngine {
  private readonly application        : ExpressEngine.Express;
  private readonly listeningPort      : number;
  private readonly failureFormatter   : HttpFailureFormatter;
  private readonly systemLogger       : SystemLogger;
  private readonly tokenEngine        : TokenCryptographerEngine;
  private readonly displayDebugDetails: boolean;

  constructor(configuration: { 
    port                   : number; 
    failureFormatter       : HttpFailureFormatter; 
    systemLogger           : SystemLogger;
    tokenEngine            : TokenCryptographerEngine;
    displayDebugDetails    : boolean; 
  }) {

    this.application            = express();
    this.listeningPort          = configuration.port;
    this.failureFormatter       = configuration.failureFormatter;
    this.systemLogger           = configuration.systemLogger;
    this.tokenEngine            = configuration.tokenEngine;
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
        incomingRequest: ExpressEngine.Request, 
        outgoingResponse: ExpressEngine.Response

    ): Promise<void> => {      
      const uniqueTraceId     = crypto.randomUUID();
      const transportMetadata = {
        clientIp    : incomingRequest.ip || incomingRequest.headers['x-forwarded-for'],
        userAgent   : incomingRequest.headers['user-agent'],
        httpMethod  : method.toUpperCase(),
        resourcePath

      };

      const contextualLogger = this.systemLogger.withContext(uniqueTraceId, transportMetadata);

      try {
        contextualLogger.info(`Incoming HTTP request received on resource: [${resourcePath}]`);

        if (schema && typeof schema === 'object' && 'safeParse' in schema && typeof schema.safeParse === 'function') {
          const validationResult = (schema as any).safeParse(incomingRequest.body);
          if (!validationResult.success) {
            const formattedErrors = validationResult.error.errors.map((issue: any) => `${issue.path.join('.')}: ${issue.message}`);
            throw new ValidationException(formattedErrors);
          }
        }

        // HIDRATAÇÃO AUTOMÁTICA DA SESSÃO: Captura o cabeçalho e analisa o passaporte de forma silenciosa
        const authorizationHeader = incomingRequest.headers['authorization'];
        let activeSessionPayload  = {
          actorId             : 'ANONYMOUS',
          deviceFingerprintId : 'unknown',
          tokenUniqueId       : 'unknown',
          issuedAt            : new Date(),
          expiresAt           : new Date()
        };

        if (authorizationHeader && typeof authorizationHeader === 'string' && authorizationHeader.startsWith('Bearer ')) {
          try {
            const cleanToken     = authorizationHeader.substring(7).trim();
            const decodedSession = await this.tokenEngine.decrypt(cleanToken);
            activeSessionPayload = decodedSession;
          } catch (silentError: unknown) {
            // Se o token estiver vencido ou adulterado, degrada silenciosamente para ANONYMOUS
            contextualLogger.warn('Cryptographic token signature failed validation. Degrading request state to ANONYMOUS.');
          }
        }

        const adaptedRequest: HttpTrafficRequest = {
          body    : incomingRequest.body,
          query   : incomingRequest.query,
          params  : incomingRequest.params,
          headers : incomingRequest.headers,
          logger  : contextualLogger,
          session : activeSessionPayload

        };

        const executionResponse = await handler(adaptedRequest);
        
        outgoingResponse.setHeader('X-Trace-Id', uniqueTraceId);
        outgoingResponse.status(executionResponse.statusCode).json(executionResponse.body);
        
      } catch (capturedError: unknown) {
        contextualLogger.error(`Exception intercepted during HTTP processing on path: [${resourcePath}]`, capturedError);

        const { statusCode, payload } = this.failureFormatter.format(capturedError, this.displayDebugDetails);
        
        outgoingResponse.setHeader('X-Trace-Id', uniqueTraceId);
        outgoingResponse.status(statusCode).json(payload);
      }
    });
  }

  public start(): void {
    this.application.listen(this.listeningPort, () => {
      this.systemLogger.info(`Express HTTP Driver actively running and listening on port [${this.listeningPort}]`);
    });
  }
}
