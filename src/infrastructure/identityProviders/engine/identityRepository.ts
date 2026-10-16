import type { ApiKeySessionPayload } from '../../security/engine/apiKeySession';

export interface IdentityRepository {
  findApplicationByKey(apiKey: string): Promise<ApiKeySessionPayload | null>;
  
}
