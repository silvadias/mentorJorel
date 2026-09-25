import { app } from './app';
import { env } from './config/env';

app.listen(env.port, () => {
  console.log(`🚀 Servidor rodando em modo [${env.nodeEnv}] na porta ${env.port}`);
});