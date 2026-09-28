import 'dotenv/config';

export const Env = {
  port:     Number(process.env  ['PORT'])          || 3000,
  nodeEnv:  process.env         ['NODE_ENV']       || 'development',
  
};