export interface ApiKeySessionPayload {
  readonly applicationId      : string;
  readonly developerId        : string;
  readonly rateLimitTier      : 'FREE' | 'PREMIUM' | 'ENTERPRISE';
  readonly isSuspended        : boolean;
}

export interface ApplicationRepository {

  findByApiKey(apiKey: string): Promise<ApiKeySessionPayload | null>;
}

export interface ApiKeyEvaluatorEngine {

  evaluate(apiKey: string): Promise<ApiKeySessionPayload>;
}
