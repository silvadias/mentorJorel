import      express                         from 'express';
import      crypto                          from 'crypto';
import type * as ExpressEngine              from 'express';
import type { HttpTrafficExchangeEngine, 
              HttpTrafficHandler,
              HttpTrafficRequest }          from '../engine/context';
import type { HttpFailureFormatter }        from '../engine/errors';
import type { SystemLogger }                from '../../telemetry/engine/context';

export class ExpressHttpDriver implements HttpTrafficExchangeEngine {
  private readonly application        : ExpressEngine.Express;
  private readonly listeningPort      : number;
  private readonly failureFormatter   : HttpFailureFormatter;
  private readonly systemLogger       : SystemLogger;
  private readonly displayDebugDetails: boolean;

  constructor(configuration: { 
    port                   : number; 
    failureFormatter       : HttpFailureFormatter; 
    systemLogger           : SystemLogger;
    displayDebugDetails    : boolean; 
  }) {

    this.application            = express();
    this.listeningPort          = configuration.port;
    this.failureFormatter       = configuration.failureFormatter;
    this.systemLogger           = configuration.systemLogger;
    this.displayDebugDetails    = configuration.displayDebugDetails;
    this.application.use(express.json());

  }

  public register(
    method      : 'get' | 'post' | 'put' | 'delete', 
    resourcePath: string, 
    handler     : HttpTrafficHandler

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

        const adaptedRequest: HttpTrafficRequest = {
          body    : incomingRequest.body,
          query   : incomingRequest.query,
          params  : incomingRequest.params,
          headers : incomingRequest.headers,
          logger  : contextualLogger

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
