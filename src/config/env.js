// 🚀 Template por: Luis Carlos da Silva Dias (https://github.com)
require('dotenv').config();

const env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
};

module.exports = env;
