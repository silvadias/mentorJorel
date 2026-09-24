import env from './config/env';
import app from './app';

app.listen(env.port, () => {
  console.log(`Express server running on port ${env.port} in ${env.nodeEnv} mode`);
});