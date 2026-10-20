export interface ConsumerCacheStoreEngine<StoredDataType> {
  save(
    identificationKey       : string, 
    payload                 : StoredDataType, 
    timeToLiveInMilliseconds: number
  ): Promise<void>;

  read(identificationKey: string): Promise<StoredDataType | null>;
}
