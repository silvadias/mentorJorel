import type { ConsumerFinderEngine }        from './finder';
import type { ConsumerSpecificationEngine } from '../engine/specification';
import      { apiKeyConnection }            from '../drivers/apiKeyInstance'; // ◄ Aponta para a nova pasta externa de conexão

export class DataBaseConsumerFinder implements ConsumerFinderEngine {
  
  public async byKey(identificationKey: string): Promise<ConsumerSpecificationEngine | null> {
    const databaseRow = apiKeyConnection.query.findKeyByString(identificationKey);

    if (!databaseRow) {
      return null;
    }

    return {
      identificationKey:        databaseRow.keyString,
      ownerDeveloperIdentifier: databaseRow.developerId,
      rateLimitTier:            databaseRow.planTier,
      isAccessSuspended:        databaseRow.isSuspendedNumber === 1
      
    };
  }
}
