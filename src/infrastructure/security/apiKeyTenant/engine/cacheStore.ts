/**
 * @interface ConsumerCacheStoreEngine
 * @description Contrato do Mecanismo de Cache de Alta Velocidade.
 * Abstrai as operações de gravação e leitura temporal de envelopes de dados na memória.
 * @template StoredDataType Tipo genérico do payload encapsulado na estrutura de cache.
 */
export interface ConsumerCacheStoreEngine<StoredDataType> {
  /** Registra uma entrada na memória atrelando um tempo de expiração utilitário (TTL). */
  save(
    identificationKey       : string, 
    payload                 : StoredDataType, 
    timeToLiveInMilliseconds: number
  ): Promise<void>;

  /** Realiza a leitura e invalida o registro caso a sinaleira do relógio supere o TTL. */
  read(identificationKey: string): Promise<StoredDataType | null>;
}
