/**
 * @interface ApiKeyRow
 * @description Esquema de Registro Físico da Tabela de Chaves de Acesso.
 * Representa a assinatura crua dos campos persistidos na camada de banco de dados tradicional.
 */
export interface ApiKeyRow {
  readonly id                  : number;
  readonly keyString           : string;
  readonly applicationAppId    : string;
  readonly developerId         : string;
  readonly planTier            : 'FREE' | 'PREMIUM' | 'ENTERPRISE';
  readonly isSuspendedNumber   : number; // ◄ Revela que o banco guarda um número (0 ou 1) e não booleano
}

/** Array efêmero em memória RAM que simula os registros físicos persistidos no banco de dados. */
export const mockApiKeyTable: ApiKeyRow[] = [
  {
    id                  : 1,
    keyString           : 'gemini_free_token_test_123',
    applicationAppId    : 'app_partner_free_zone',
    developerId         : 'dev_luis_dias_corporation',
    planTier            : 'FREE',
    isSuspendedNumber   : 0 // 0 significa Ativo no banco
  },
  {
    id                  : 2,
    keyString           : 'openai_premium_token_secure_456',
    applicationAppId    : 'app_enterprise_ai_core',
    developerId         : 'dev_silva_dias_perfil',
    planTier            : 'ENTERPRISE',
    isSuspendedNumber   : 1 // 1 significa Suspenso no banco
  }
];
