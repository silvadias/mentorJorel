import type { Server } from 'http';
import type { SystemLogger } from '../../telemetry/engine/systemLogger';

export class ServerLifecycleGovernor {
  private readonly systemLogger       : SystemLogger;
  private readonly terminationTimeoutMs: number;
  
  private activeRequestsCounter        : number;
  private isTerminating                : boolean;

  constructor(systemLogger: SystemLogger, terminationTimeoutSeconds = 20) {
    this.systemLogger          = systemLogger;
    this.terminationTimeoutMs  = terminationTimeoutSeconds * 1000;
    this.activeRequestsCounter = 0;
    this.isTerminating         = false;

  }

  public incrementActiveRequests(): void {
    if (this.isTerminating) {
      throw new Error('SERVER_TERMINATING_REJECTED');
    }
    this.activeRequestsCounter++;
  }

  public decrementActiveRequests(): void {
    this.activeRequestsCounter--;
    
    if (this.isTerminating && this.activeRequestsCounter === 0) {
      this.systemLogger.info('All pending network operations successfully drained. Closing process safely.');
      process.exit(0);
    }
  }

  public governTerminationSignal(signalName: 'SIGTERM' | 'SIGINT', httpServer: Server): void {
    if (this.isTerminating) {
      return;
    }

    this.isTerminating = true;
    this.systemLogger.warn(`OS Termination signal [${signalName}] intercepted. ServerLifecycleGovernor initiating graceful drain sequence.`);

    httpServer.close((error: unknown) => {
      if (error) {
        this.systemLogger.error('Exception intercepted while closing underlying HTTP network server handles.', error);
      }
    });

    if (this.activeRequestsCounter === 0) {
      this.systemLogger.info('Zero active operations running in RAM. Immediate graceful termination accomplished.');
      process.exit(0);
    }

    this.systemLogger.info(`Draining [${this.activeRequestsCounter}] active long-running operations. Waiting for execution finish.`);

    setTimeout(() => {
      this.systemLogger.error(`Graceful termination window timeout of [${this.terminationTimeoutMs}ms] breached. Forcing hard kill.`);
      process.exit(1);
    }, this.terminationTimeoutMs).unref();
  }

  public isInTerminationState(): boolean {
    return this.isTerminating;
  }
}
