import { DomainException } from '../../../api/errors/domainException';

type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export class ServiceResilienceGate {
  private readonly failureThreshold : number;
  private readonly cooldownPeriodMs : number;

  private currentState              : CircuitState;
  private consecutiveFailures       : number;
  private nextAttemptAllowedAt      : number;

  constructor(failureThreshold  = 5, cooldownSeconds = 60) {
    this.failureThreshold       = failureThreshold;
    this.cooldownPeriodMs       = cooldownSeconds * 1000;
    
    this.currentState           = 'CLOSED';
    this.consecutiveFailures    = 0;
    this.nextAttemptAllowedAt   = 0;

  }

  public verifyGateHealth(): void {
    const currentTime = Date.now();

    if (this.currentState === 'OPEN' && currentTime > this.nextAttemptAllowedAt) {
      this.currentState = 'HALF_OPEN';
    }

    if (this.currentState === 'OPEN') {
      throw new DomainException('EXTERNAL_SERVICE_UNAVAILABLE');
    }
  }

  public recordSuccess(): void {
    this.consecutiveFailures = 0;
    this.currentState        = 'CLOSED';
  }

  public recordFailure(): void {
    this.consecutiveFailures++;

    if (this.currentState === 'HALF_OPEN' || this.consecutiveFailures >= this.failureThreshold) {
      this.currentState         = 'OPEN';
      this.nextAttemptAllowedAt = Date.now() + this.cooldownPeriodMs;
    }
  }

  public getActiveState(): CircuitState {
    return this.currentState;
  }
}
