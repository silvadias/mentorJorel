import 'dotenv/config';

const env = {
  port: Number(process.env['PORT']) || 3000,
  nodeEnv: process.env['NODE_ENV'] || 'development',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
};

export default env;
