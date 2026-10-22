import { DomainException } from '../../api/errors/domainException';

/** Estados lógicos imutáveis alocados na memória RAM para controle de fluxo do disjuntor. */
type GateState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

/**
 * @class ServiceResilienceGate
 * @description Mecanismo de Disjuntor Técnico (Circuit Breaker) para APIs Externas.
 * Monitora falhas consecutivas e chaveia estados operacionais em tempo de execução,
 * abortando requisições em tempo zero caso o alvo integrado atinja colapso estrutural.
 */
export class ServiceResilienceGate {
  private readonly failureThreshold : number;
  private readonly cooldownPeriodMs : number;

  private currentState              : GateState; // Ajustado para GateState
  private consecutiveFailures       : number;
  private nextAttemptAllowedAt      : number;

  constructor(failureThreshold  = 5, cooldownSeconds = 60) {
    this.failureThreshold       = failureThreshold;
    this.cooldownPeriodMs       = cooldownSeconds * 1000;
    
    this.currentState           = 'CLOSED';
    this.consecutiveFailures    = 0;
    this.nextAttemptAllowedAt   = 0;
  }

  /**
   * @description Barreira comportamental contra falhas em cascata.
   * Avalia a sinaleira de tempo do cooldown e impede a execução se o circuito estiver em pane ('OPEN').
   */
  public ensureAccessible(): void {
    const currentTime = Date.now();

    if (this.currentState === 'OPEN' && currentTime > this.nextAttemptAllowedAt) {
      this.currentState = 'HALF_OPEN';
    }

    if (this.currentState === 'OPEN') {
      throw new DomainException('EXTERNAL_SERVICE_UNAVAILABLE');
    }
  }

  /** Restabelece a normalidade operacional do portão e limpa os contadores de erro. */
  public recordSuccess(): void {
    this.consecutiveFailures = 0;
    this.currentState        = 'CLOSED';
  }

  /** Incrementa o marcador atômico e abre o circuito caso viole o teto de tolerância tolerado. */
  public recordFailure(): void {
    this.consecutiveFailures++;

    if (this.currentState       === 'HALF_OPEN' || 
                                this.consecutiveFailures >= this.failureThreshold) {
      this.currentState         = 'OPEN';
      this.nextAttemptAllowedAt = Date.now() + this.cooldownPeriodMs;
    }
  }

  /** Expõe o estado textual ativo na memória para auditorias e telemetria estruturada. */
  public getState(): GateState {
    return this.currentState;
  }
}
