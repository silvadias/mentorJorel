import type { ApiKeySessionPayload } from '../../../infrastructure/security/engine/apiKeySession';

export interface IdentityRepository {

  findApplicationByKey(apiKey: string): Promise<ApiKeySessionPayload | null>;
}
