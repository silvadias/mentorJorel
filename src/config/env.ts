import 'dotenv/config';

/**
 * @file env.ts
 * @description Componente de configuração fortemente tipada do ecossistema.
 * Atua como a única fonte de verdade incorporando senhas do arquivo .evn no sistema.
 * Através do .env fornece parâmetros operacionais e segredos criptográficos,
 * isolando o uso de strings globais do 'process.env' e fornecendo fallbacks para ambiente de desenvolvimento.
 */
export const Env = {
  port:             Number(process.env['PORT'])             || 3000,
  nodeEnv:          process.env['NODE_ENV']                 || 'development',
  
  /** Segredo criptográfico assimétrico/simétrico para assinatura estrutural de tokens de sessão. */
  jwtSecret:        process.env['JWT_SECRET']               || 'fallback_development_secret_key_secure_999',
  
  /** Tempo de vida utilitário do passaporte digital (JWT) expresso em segundos. */
  jwtExpirationSec: Number(process.env['JWT_EXPIRATION_SEC']) || 3600
};