import type { ConsumerCacheStoreEngine }        from '../engine/cacheStore';
import type { ConsumerSpecificationEngine }     from '../engine/specification';

interface ConsumerIdentity {
  readonly payload   : ConsumerSpecificationEngine;
  readonly expiresAt : number;
}

export class ConsumerCacheStore implements ConsumerCacheStoreEngine<ConsumerSpecificationEngine> {
  private readonly ramStorage = new Map<string, ConsumerIdentity>();

  public async save(
    identificationKey       : string, 
    payload                 : ConsumerSpecificationEngine,
    timeToLiveInMilliseconds: number

  ): Promise<void> {
    const expirationTime = Date.now() + timeToLiveInMilliseconds;

    this.ramStorage.set(identificationKey, {
      payload, 
      expiresAt: expirationTime
    });
  }

  public async read(identificationKey: string
  ): Promise<ConsumerSpecificationEngine | null> {
    const currentConsumerIdentity = this.ramStorage.get(identificationKey);

    if (!currentConsumerIdentity) {
      return null;
    }

    const isCacheExpired = Date.now() > currentConsumerIdentity.expiresAt;

    if (isCacheExpired) {
      this.ramStorage.delete(identificationKey);
      return null;
    }

    return currentConsumerIdentity.payload;    
  }
} 
