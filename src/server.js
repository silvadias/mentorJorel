//server.js
const env = require('./config/env');
const app = require('./app');

app.listen(env.port, () => {
  console.log(`Express server running on port ${env.port} in ${env.nodeEnv} mode`);
});