import type { SystemLogger } from '../telemetry/engine/systemLogger';

/** Contrato abstrato que encapsula os seletores físicos de fechamento do servidor de rede. */
export interface NetworkTrafficDrainer {
  close(callback: (error: unknown) => void): void;
}

/**
 * @class ServerLifecycleGovernor
 * @description Governador Central de Encerramento Limpo (Graceful Shutdown).
 * Gerencia buffers de requisições ativas alocadas na memória RAM e drena conexões físicas
 * de tráfego de forma atômica para garantir a integridade dos dados durante desarmes de infraestrutura.
 */
export class ServerLifecycleGovernor {
  private readonly systemLogger         : SystemLogger;
  private readonly terminationTimeoutMs : number;  
  private activeRequestsCounter         : number;
  private isTerminating                 : boolean;

  constructor(systemLogger: SystemLogger, terminationTimeoutSeconds = 20) {
    this.systemLogger          = systemLogger;
    this.terminationTimeoutMs  = terminationTimeoutSeconds * 1000;
    this.activeRequestsCounter = 0;
    this.isTerminating         = false;
  }

  /** Incrementa o marcador na portaria. Rejeita o clique se a nuvem já tiver iniciado o desligamento. */
  public incrementActiveRequests(): void {
    if (this.isTerminating) {
      throw new Error('SERVER_TERMINATING_REJECTED');
    }
    this.activeRequestsCounter++;
  }

  /** Decrementa obrigatoriamente no bloco 'finally' da requisição. Executa o kill seguro se for a última conexão. */
  public decrementActiveRequests(): void {
    this.activeRequestsCounter--;
    
    if (this.isTerminating && this.activeRequestsCounter === 0) {
      this.systemLogger.info('All pending network operations successfully drained. Closing process safely.');
      process.exit(0);
    }
  }

  /**
   * @description Pipeline central de interceptação de sinais primitivos do SO Linux (SIGTERM/SIGINT).
   * Fecha os canais do driver de rede e abre uma janela temporal de tolerância antes de forçar o encerramento.
   */
  public governTerminationSignal(signalName: 'SIGTERM' | 'SIGINT', networkDrainer: NetworkTrafficDrainer): void {
    if (this.isTerminating) {
      return;
    }

    this.isTerminating = true;
    this.systemLogger.warn(`OS Termination signal [${signalName}] intercepted. ServerLifecycleGovernor initiating graceful drain sequence.`);

    networkDrainer.close((error: unknown) => {
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

  /** Informa se o ecossistema encontra-se em estágio de rejeição e drenagem ativa. */
  public isInTerminationState(): boolean {
    return this.isTerminating;
  }
}
