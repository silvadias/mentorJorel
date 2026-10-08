import type { ApplicationRepository,
              ApiKeySessionPayload } from '../../infrastructure/security/engine/apiKeySession';
import      { apiKeyConnection }     from './apiKeyInstance';

export class ApiKeyRepository implements ApplicationRepository {
  public async findByApiKey(apiKey: string): Promise<ApiKeySessionPayload | null> {
    const databaseRow = apiKeyConnection.query.findKeyByString(apiKey);

    if (!databaseRow) {
      return null;
    }

    return {
      applicationId : databaseRow.appId,
      developerId   : databaseRow.developerId,
      rateLimitTier : databaseRow.planTier,
      isSuspended   : databaseRow.isSuspended === 1
    };
  }
}
