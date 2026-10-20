import type { ConsumerCacheStoreEngine }       from '../engine/cacheStore';
import type { ConsumerFinderEngine }           from './finder';
import type { ConsumerSpecificationEngine }    from '../engine/specification';
import      { DomainException }                from '../../../../api/errors/domainException';

export class ConsumerAccessValidator implements ConsumerFinderEngine {
  private readonly cacheStore               : ConsumerCacheStoreEngine<ConsumerSpecificationEngine>;
  private readonly databaseRepository       : ConsumerFinderEngine;
  private readonly cacheTimeToLiveSeconds   : number;

  constructor(
    databaseRepository      : ConsumerFinderEngine,
    cacheStore              : ConsumerCacheStoreEngine<ConsumerSpecificationEngine>,
    cacheExpirationSeconds  = 300
  ) {
    this.databaseRepository     = databaseRepository;
    this.cacheStore             = cacheStore;
    this.cacheTimeToLiveSeconds = cacheExpirationSeconds * 1000;
  }

  public async byKey(identificationKey: string): Promise<ConsumerSpecificationEngine | null> {
    const cachedConsumer = await this.cacheStore.read(identificationKey);

    if (cachedConsumer) {
      if (cachedConsumer.isAccessSuspended) {
        throw new DomainException('API_KEY_SUSPENDED');

      }
      return cachedConsumer;

    }
    const databaseConsumer = await this.databaseRepository.byKey(identificationKey);

    if (!databaseConsumer) {
      throw new DomainException('API_KEY_INVALID');

    }

    await this.cacheStore.save(identificationKey, databaseConsumer, this.cacheTimeToLiveSeconds);

    if (databaseConsumer.isAccessSuspended) {
      throw new DomainException('API_KEY_SUSPENDED');

    }
    return databaseConsumer;
    
  }
}
