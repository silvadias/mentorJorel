import 'dotenv/config';

export const Env = {
  port:             Number(process.env['PORT'])             || 3000,
  nodeEnv:          process.env['NODE_ENV']                 || 'development',
  // Incorpora a governança de tokens de forma strongly-typed
  jwtSecret:        process.env['JWT_SECRET']               || 'fallback_development_secret_key_secure_999',
  jwtExpirationSec: Number(process.env['JWT_EXPIRATION_SEC']) || 3600
};
