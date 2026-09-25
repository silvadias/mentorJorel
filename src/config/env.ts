import 'dotenv/config';

interface IEnv {
  port: number;
  nodeEnv: string;
  GEMINI_API_KEY: string;
}

export const env: IEnv = {
  port: Number(process.env['PORT']) || 3000,
  nodeEnv: process.env['NODE_ENV'] || 'development',
  GEMINI_API_KEY: process.env['GEMINI_API_KEY'] || '',
};
