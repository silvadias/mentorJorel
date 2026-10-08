/**
 * @file apiKeyTable.ts
 * @description Tabela física simulada em memória para armazenamento bruto de credenciais de parceiros.
 */

export interface IApiKeyRow {
  readonly id           : number;
  readonly key_string   : string;
  readonly app_id       : string;
  readonly developer_id : string;
  readonly plan_tier    : 'FREE' | 'PREMIUM' | 'ENTERPRISE';
  readonly is_suspended : number; // 0 = Ativo, 1 = Suspenso (Dialeto puro de banco)
}

export const mockApiKeyTable: IApiKeyRow[] = [
  {
    id           : 1,
    key_string   : 'gemini_free_token_test_123',
    app_id       : 'app_partner_free_zone',
    developer_id : 'dev_luis_dias_corporation',
    plan_tier    : 'FREE',
    is_suspended : 0
  },
  {
    id           : 2,
    key_string   : 'openai_premium_token_secure_456',
    app_id       : 'app_enterprise_ai_core',
    developer_id : 'dev_silva_dias_perfil',
    plan_tier    : 'ENTERPRISE',
    is_suspended : 0
  }
];
