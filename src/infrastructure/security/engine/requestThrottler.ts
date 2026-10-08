import { DomainException } from '../../../api/errors/domainException';

interface WindowThrottleCounter {
  count             : number;
  windowResetTimeMs : number;
}

export class RequestThrottler {
  private static readonly RATE_LIMITS: Record<string, number> = {
    'FREE'       : 10,
    'PREMIUM'    : 100,
    'ENTERPRISE' : 1000
  };

  private readonly windowDurationMs : number;
  
  private readonly appCountersStore : Map<string, WindowThrottleCounter>;
  private readonly ipCountersStore  : Map<string, WindowThrottleCounter>;

  constructor(windowDurationSeconds = 60) {
    this.windowDurationMs = windowDurationSeconds * 1000;
    this.appCountersStore = new Map<string, WindowThrottleCounter>();
    this.ipCountersStore  = new Map<string, WindowThrottleCounter>();

  }


  public async throttle(applicationId: string, rateLimitTier: string, clientIp: string): Promise<void> {
    const currentTime = Date.now();

    const maxAllowedByTier = RequestThrottler.RATE_LIMITS[rateLimitTier] || RequestThrottler.RATE_LIMITS['FREE'] || 10;
    this.evaluateStoreBarrier(this.appCountersStore, applicationId, maxAllowedByTier, currentTime);

    const maxAllowedByIp = 200;
    this.evaluateStoreBarrier(this.ipCountersStore, clientIp, maxAllowedByIp, currentTime);

  }


  private evaluateStoreBarrier(
    store       : Map<string, WindowThrottleCounter>, 
    trackingKey : string, 
    maxAllowed  : number, 
    currentTime : number
  ): void {
    const currentCounter = store.get(trackingKey);

    if (!currentCounter || currentTime > currentCounter.windowResetTimeMs) {
      store.set(trackingKey, {
        count             : 1,
        windowResetTimeMs : currentTime + this.windowDurationMs
      });
      return;
    }

    if (currentCounter.count >= maxAllowed) {
      throw new DomainException('REQUEST_THROTTLED');
    }

    currentCounter.count++;
  }
}
