export interface ApiKeyRow {
  readonly id           : number;
  readonly keyString    : string;
  readonly appId        : string;
  readonly developerId  : string;
  readonly planTier     : 'FREE' | 'PREMIUM' | 'ENTERPRISE';
  readonly isSuspended  : number;
}

export const mockApiKeyTable: ApiKeyRow[] = [
  {
    id          : 1,
    keyString   : 'gemini_free_token_test_123',
    appId       : 'app_partner_free_zone',
    developerId : 'dev_luis_dias_corporation',
    planTier    : 'FREE',
    isSuspended : 0
  },
  {
    id          : 2,
    keyString   : 'openai_premium_token_secure_456',
    appId       : 'app_enterprise_ai_core',
    developerId : 'dev_silva_dias_perfil',
    planTier    : 'ENTERPRISE',
    isSuspended : 0
  }
];
