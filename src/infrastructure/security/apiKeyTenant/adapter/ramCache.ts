import type { ConsumerCacheStoreEngine }        from '../engine/cacheStore';
import type { ConsumerSpecificationEngine }     from '../engine/specification';

/** Envelope temporal efêmero que encapsula a credencial e seu respectivo timestamp limitador de vida útil. */
interface ConsumerIdentity {
  readonly payload   : ConsumerSpecificationEngine;
  readonly expiresAt : number;
}

/**
 * @class ConsumerCacheStore
 * @description Adaptador Hexagonal de Cache In-Memory (Read-Through Cache).
 * Implementa o contrato 'ConsumerCacheStoreEngine' recorrendo a estruturas de 'Map' da memória RAM,
 * garantindo respostas ultra-rápidas (Cache Hit) e mitigando bombardeios contra os bancos físicos.
 */
export class ConsumerCacheStore implements ConsumerCacheStoreEngine<ConsumerSpecificationEngine> {
  private readonly ramStorage = new Map();

  /** Grava o registro efêmero calculando dinamicamente a sinaleira de tempo do TTL. */
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

  /**
   * @description Pipeline de leitura atômica em memória.
   * Avalia a integridade temporal do registro e deleta a chave imediatamente em caso de expiração (Cache Miss).
   */
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
