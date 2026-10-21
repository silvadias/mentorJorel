import      express                         from 'express';
import      crypto                          from 'crypto';
import type * as ExpressEngine              from 'express';
import type { HttpTrafficExchangeEngine, 
              HttpTrafficHandler,
              HttpTrafficRequest,
              HttpNetworkSecurityPolicy }   from '../engine/httpTraffic';
import type { HttpFailureFormatter }        from '../../../api/errors/domainException';
import type { SystemLogger }                from '../../telemetry/engine/systemLogger';
import type { TokenCryptographerEngine }    from '../../security/token/engine/tokenSession';
import type { ConsumerFinderEngine }        from '../../security/apiKeyTenant/adapter/finder';
import      { RequestThrottler }            from '../../security/throttler/requestThrottler';
import      { ServerLifecycleGovernor }     from '../../lifeCycle/serverLifecycleGovernor';
import      { ValidationException }         from '../engine/httpValidation';
import      { DomainException }             from '../../../api/errors/domainException';

export class ExpressHttpDriver implements HttpTrafficExchangeEngine {
  private readonly application          : ExpressEngine.Express;
  private readonly listeningPort        : number;
  private readonly failureFormatter     : HttpFailureFormatter;
  private readonly systemLogger         : SystemLogger;
  private readonly tokenEngine          : TokenCryptographerEngine;
  private readonly consumerEngine       : ConsumerFinderEngine;
  private readonly throttlerEngine      : RequestThrottler;
  private readonly lifecycleGovernor    : ServerLifecycleGovernor;
  private readonly networkSecurityPolicy: HttpNetworkSecurityPolicy;
  private readonly displayDebugDetails  : boolean;

  constructor(configuration: { 
    port                   : number; 
    failureFormatter       : HttpFailureFormatter; 
    systemLogger           : SystemLogger;
    tokenEngine            : TokenCryptographerEngine;
    consumerEngine         : ConsumerFinderEngine;
    throttlerEngine        : RequestThrottler;
    lifecycleGovernor      : ServerLifecycleGovernor;
    networkPolicy          : HttpNetworkSecurityPolicy;
    displayDebugDetails    : boolean; 
  }) {
    this.application             = express();
    this.listeningPort           = configuration.port;
    this.failureFormatter        = configuration.failureFormatter;
    this.systemLogger            = configuration.systemLogger;
    this.tokenEngine             = configuration.tokenEngine;
    this.consumerEngine          = configuration.consumerEngine;
    this.throttlerEngine         = configuration.throttlerEngine;
    this.lifecycleGovernor       = configuration.lifecycleGovernor;
    this.networkSecurityPolicy   = configuration.networkPolicy;
    this.displayDebugDetails     = configuration.displayDebugDetails;
    
    this.application.use(express.json());
    this.applyGlobalNetworkPolicies();
  }

  private applyGlobalNetworkPolicies(): void {
    this.application.use((request, response, next) => {
      response.setHeader('Access-Control-Allow-Origin', this.networkSecurityPolicy.allowedOrigins.join(', '));
      response.setHeader('Access-Control-Allow-Methods', this.networkSecurityPolicy.allowedMethods.join(', '));
      response.setHeader('Access-Control-Allow-Headers', this.networkSecurityPolicy.allowedHeaders.join(', '));
      response.setHeader('Access-Control-Expose-Headers', this.networkSecurityPolicy.exposedHeaders.join(', '));

      if (this.networkSecurityPolicy.isFrameworkSignatureHidden) {
        response.removeHeader('X-Powered-By');
      }

      for (const [defenseName, defenseValue] of Object.entries(this.networkSecurityPolicy.perimeterDefenses)) {
        response.setHeader(defenseName, defenseValue);
      }

      if (request.method === 'OPTIONS') {
        response.status(204).end();
        return;
      }

      next();
    });
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
      
      try {
        this.lifecycleGovernor.incrementActiveRequests();
      } catch (terminationError: unknown) {
          outgoingResponse.status(503).json({
            status  : 'fail', 
            code    : 'SERVER_TERMINATING',
            message : 'Servidor em processo de encerramento.' 
          });
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
        await this.throttlerEngine.throttle({
          trackingKey : clientMetadata.ipAddress,
          maxAllowed  : 200
        });

        const authenticatedConsumer = await this.consumerEngine.byKey(String(incomingRequest.headers['x-api-key'] || '').trim());
        
        if (!authenticatedConsumer) {
          throw new DomainException('API_KEY_INVALID');
        }

        const tenantQuotaMap: Record<string, number> = { 
          FREE: 10, 
          PREMIUM: 100, 
          ENTERPRISE: 1000 };
          
        const tenantMaxAllowed = tenantQuotaMap[authenticatedConsumer.rateLimitTier] ?? 10;

        await this.throttlerEngine.throttle({
          trackingKey : authenticatedConsumer.identificationKey,
          maxAllowed  : tenantMaxAllowed
        });

        const activeSessionPayload = await this.hydrateUserSession(incomingRequest, clientMetadata.ipAddress, clientMetadata.userAgentHash);

        await this.throttlerEngine.throttle({
          trackingKey : `user:${authenticatedConsumer.identificationKey}:${activeSessionPayload.actorId}`,
          maxAllowed  : 30
        });

        contextualLogger.info(`Incoming HTTP request received on resource: [${resourcePath}]`);
        this.validateInputSchema(schema, incomingRequest.body);

        const adaptedRequest: HttpTrafficRequest = {
          body        : incomingRequest.body,
          query       : incomingRequest.query,
          params      : incomingRequest.params,
          headers     : incomingRequest.headers,
          logger      : contextualLogger,
          session     : activeSessionPayload,
          consumer    : authenticatedConsumer
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
        this.lifecycleGovernor.decrementActiveRequests();
      }
    });
  }

  private extractClientMetadata(request: ExpressEngine.Request) {
    const rawClientIp     = request.ip || request.headers['x-forwarded-for'] || '127.0.0.1';
    const ipStringBase    = Array.isArray(rawClientIp) ? String(rawClientIp[0] || '127.0.0.1') : String(rawClientIp);
    const ipAddress       = (ipStringBase.split(',')[0] || '127.0.0.1').trim();
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
    const activeHttpServerInstance = this.application.listen(this.listeningPort, () => {
      this.systemLogger.info(`Express HTTP Driver actively running and listening on port [${this.listeningPort}]`);
  });

  process.on('SIGTERM', () => this.lifecycleGovernor.governTerminationSignal('SIGTERM', activeHttpServerInstance));
  process.on('SIGINT',  () => this.lifecycleGovernor.governTerminationSignal('SIGINT',  activeHttpServerInstance));

  }
}