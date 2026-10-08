import type { ApiKeyEvaluatorEngine,
              ApiKeySessionPayload,
              ApplicationRepository } from './apiKeySession';
import      { DomainException }       from '../../../api/errors/domainException';

interface CachedKeyEntry {
  readonly payload   : ApiKeySessionPayload;
  readonly expiresAt : number; // Unix timestamp de expiração na RAM
}

export class ApiKeyEvaluator implements ApiKeyEvaluatorEngine {
  private readonly repository   : ApplicationRepository;
  private readonly cacheTTLMs   : number;

  private readonly ramCacheStore: Map<string, CachedKeyEntry>;

  constructor(repository: ApplicationRepository, cacheExpirationSeconds = 300) {
    this.repository     = repository;
    this.cacheTTLMs     = cacheExpirationSeconds * 1000;
    this.ramCacheStore  = new Map<string, CachedKeyEntry>();

  }

  public async evaluate(apiKey: string): Promise<ApiKeySessionPayload> {
    const currentTime = Date.now();
    const cachedEntry = this.ramCacheStore.get(apiKey);

    if (cachedEntry && cachedEntry.expiresAt > currentTime) {
      const session = cachedEntry.payload;

      if (session.isSuspended) {
        throw new DomainException('API_KEY_SUSPENDED');
      }

      return session;
    }

    const databaseRow = await this.repository.findByApiKey(apiKey);

    if (!databaseRow) {
      throw new DomainException('API_KEY_INVALID');
    }

    this.ramCacheStore.set(apiKey, {
      payload   : databaseRow,
      expiresAt : currentTime + this.cacheTTLMs
    });

    if (databaseRow.isSuspended) {
      throw new DomainException('API_KEY_SUSPENDED');
    }

    return databaseRow;
  }
}
