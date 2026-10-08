/**
 * @file apiKeySession.ts
 * @description Contrato abstrato de avaliação dinâmica e tipagem de chaves de acesso para aplicações parceiras (Multi-Tenant).
 */

export interface ApiKeySessionPayload {
  readonly applicationId      : string;
  readonly developerId        : string;
  readonly rateLimitTier      : 'FREE' | 'PREMIUM' | 'ENTERPRISE';
  readonly isSuspended        : boolean;
}

// CONTRATO DO REPOSITÓRIO: A porta de entrada para buscar os dados físicos de armazenamento
export interface ApplicationRepository {
  findByApiKey(apiKey: string): Promise<ApiKeySessionPayload | null>;
}

export interface ApiKeyEvaluatorEngine {
  evaluate(apiKey: string): Promise<ApiKeySessionPayload>;
}
