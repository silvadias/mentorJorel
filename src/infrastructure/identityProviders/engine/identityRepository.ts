import type { ConsumerSpecificationEngine } from '../../security/apiKeyTenant/engine/specification';

export interface IdentityRepository {
  findApplicationByKey(apiKey: string): Promise<ConsumerSpecificationEngine | null>;
}
