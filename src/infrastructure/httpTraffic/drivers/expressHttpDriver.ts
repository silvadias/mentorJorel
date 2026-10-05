import        express                     from 'express';
import type   * as ExpressEngine          from 'express';
import type { HttpTrafficExchangeEngine,
              HttpTrafficHandler,
              HttpTrafficRequest }        from '../engine/context';
import type { HttpFailureFormatter }      from '../engine/errors';

export class ExpressHttpDriver implements HttpTrafficExchangeEngine {
  private readonly application:         ExpressEngine.Express;
  private readonly listeningPort:       number;
  private readonly failureFormatter:    HttpFailureFormatter;
  private readonly displayDebugDetails: boolean;

  constructor(configuration: { 
    port:                 number; 
    failureFormatter:     HttpFailureFormatter; 
    displayDebugDetails:  boolean;

  }) {
    this.application          = express();    
    this.listeningPort        = configuration.port;
    this.failureFormatter     = configuration.failureFormatter;
    this.displayDebugDetails  = configuration.displayDebugDetails;
    this.application.use(express.json());

  }

  public register(
    method:         'get' | 'post' | 'put' | 'delete', 
    resourcePath:   string, 
    handler:        HttpTrafficHandler

  ): void {
    this.application[method](resourcePath, async (
      incomingRequest:  ExpressEngine.Request, 
      outgoingResponse: ExpressEngine.Response

    ): Promise<void> => {
      try {
        const adaptedRequest: HttpTrafficRequest = {
          body:     incomingRequest.body,
          query:    incomingRequest.query,
          params:   incomingRequest.params,
          headers:  incomingRequest.headers

        };

        const executionResponse = await handler(adaptedRequest);
        outgoingResponse.status(executionResponse.statusCode).json(executionResponse.body);
        
      } catch (capturedError: unknown) {
        // Substituição do CatchAsync e ErrorHandler: Formata a falha de forma 100% agnóstica
        const { statusCode, payload } = this.failureFormatter.format(capturedError, this.displayDebugDetails);
        outgoingResponse.status(statusCode).json(payload);

      }
    });

  }

  public start(): void {
    this.application.listen(this.listeningPort, () => {
      console.log(`Express HTTP Driver actively running on port ${this.listeningPort}`);

    });
  }
  
}
