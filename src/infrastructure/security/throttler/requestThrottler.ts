import { DomainException } from '../../../api/errors/domainException';

export interface ThrottlerBarrierInput {
  readonly trackingKey : string;
  readonly maxAllowed  : number;
}

interface PeriodicTrafficCounter {
  count               : number;
  chronologicalResetAt: number;
}

export class RequestThrottler {
  private readonly cycleDurationMilliseconds  : number;
  private readonly ramTrafficRegistry         : Map<string, PeriodicTrafficCounter>;

  constructor(cycleDurationSeconds = 60) {
    this.cycleDurationMilliseconds = cycleDurationSeconds * 1000;
    this.ramTrafficRegistry        = new Map<string, PeriodicTrafficCounter>();
  }

  public async throttle(barrier: ThrottlerBarrierInput): Promise<void> {
    const { trackingKey, maxAllowed } = barrier;
    const currentTimestamp            = Date.now();
    const activePeriodRecord          = this.ramTrafficRegistry.get(trackingKey);

    if (!activePeriodRecord || 
        currentTimestamp > activePeriodRecord.chronologicalResetAt
      ) {
        this.ramTrafficRegistry.set(trackingKey, {
          count               : 1,
          chronologicalResetAt: currentTimestamp + this.cycleDurationMilliseconds
      });

      return;
    }

    if (activePeriodRecord.count >= maxAllowed) {
      throw new DomainException('REQUEST_THROTTLED');
    }

    activePeriodRecord.count++;
  }

  public evictExpiredRecords(): void {
    const currentTimestamp = Date.now();
    
    for (const [trackingKey, record] of this.ramTrafficRegistry.entries()) {
      if (currentTimestamp > record.chronologicalResetAt) {
        this.ramTrafficRegistry.delete(trackingKey);
      }
    }
  }
}