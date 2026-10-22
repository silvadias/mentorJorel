import type { ConsumerCacheStoreEngine }       from '../engine/cacheStore';
import type { ConsumerFinderEngine }           from './finder';
import type { ConsumerSpecificationEngine }    from '../engine/specification';
import      { DomainException }                from '../../../../api/errors/domainException';

/**
 * @class ConsumerAccessValidator
 * @description Orquestrador de Portaria e Cache Dinâmico Read-Through.
 * Implementa a interface 'ConsumerFinderEngine' conectando de forma transparente o banco de dados
 * e a memória RAM efêmera para garantir validação de credenciais em microsegundos (Cache Hit).
 */
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

  /**
   * @description Pipeline de interceptação perimetral de credenciais de entrada.
   * Realiza a busca polimórfica e dispara barreiras comportamentais do catálogo central de erros.
   */
  public async byKey(identificationKey: string): Promise<ConsumerSpecificationEngine | null> {
    // BARREIRA 1: Tenta ler a credencial diretamente da memória RAM local
    const cachedConsumer = await this.cacheStore.read(identificationKey);

    if (cachedConsumer) {
      if (cachedConsumer.isAccessSuspended) {
        throw new DomainException('API_KEY_SUSPENDED');

      }
      return cachedConsumer;

    }
    // BARREIRA 2: Ocorre Cache Miss. Executa o Fallback e realiza a query física no banco
    const databaseConsumer = await this.databaseRepository.byKey(identificationKey);

    if (!databaseConsumer) {
      throw new DomainException('API_KEY_INVALID');

    }

    // Salva uma cópia exata do registro na memória RAM para os próximos ciclos de tráfego
    await this.cacheStore.save(identificationKey, databaseConsumer, this.cacheTimeToLiveSeconds);

    if (databaseConsumer.isAccessSuspended) {
      throw new DomainException('API_KEY_SUSPENDED');

    }
    return databaseConsumer;
    
  }
}
