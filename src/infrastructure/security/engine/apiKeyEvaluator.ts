/**
 * @file apiKeyEvaluator.ts
 * @description Motor perimetral de alta performance responsável por executar o fluxo de Cache Dinâmico In-Memory (Read-Through).
 */

import type { ApiKeyEvaluatorEngine,
              ApiKeySessionPayload,
              ApplicationRepository } from './apiKeySession';
import      { DomainException }       from '../../../../api/errors/domainException';

interface CachedKeyEntry {
  readonly payload   : ApiKeySessionPayload;
  readonly expiresAt : number; // Unix timestamp de expiração na RAM
}

export class ApiKeyEvaluator implements ApiKeyEvaluatorEngine {
  private readonly repository   : ApplicationRepository;
  private readonly cacheTTLMs   : number;
  
  // ARMAZENAMENTO EFÊMERO EM MEMÓRIA RAM: Cache dinâmico operando em microsegundos
  private readonly ramCacheStore: Map<string, CachedKeyEntry>;

  constructor(repository: ApplicationRepository, cacheExpirationSeconds = 300) {
    this.repository     = repository;
    this.cacheTTLMs     = cacheExpirationSeconds * 1000;
    this.ramCacheStore  = new Map<string, CachedKeyEntry>();

  }

  public async evaluate(apiKey: string): Promise<ApiKeySessionPayload> {
    const currentTime = Date.now();
    const cachedEntry = this.ramCacheStore.get(apiKey);

    // BARREIRA 1: Checagem Dinâmica na Memória RAM (Cache Hit)
    if (cachedEntry && cachedEntry.expiresAt > currentTime) {
      const session = cachedEntry.payload;

      // CORE PATRÓN OURO: Dispara a chave específica do catálogo se a aplicação parceira estiver suspensa
      if (session.isSuspended) {
        throw new DomainException('API_KEY_SUSPENDED');
      }

      return session;
    }

    // BARREIRA 2: Fallback Seguro ao Banco de Dados (Cache Miss)
    const databaseRow = await this.repository.findByApiKey(apiKey);

    // CORE PATRÓN OURO: Se a chave não constar em nenhuma instância física de banco, joga erro de inválida
    if (!databaseRow) {
      throw new DomainException('API_KEY_INVALID');
    }

    // MONTAGEM DO ENVELOPE DE MEMÓRIA: Injeta dinamicamente no Cache RAM com timestamp de expiração (TTL)
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
