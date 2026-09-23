// src/api/home/controller.js
const env = require('../../config/env');

const getResponse = (req, res) => {
  return res.status(200).json({
    message: "Node.js Standard Template with Express running perfectly inside Docker!",
    status: "online",
    environment: env.nodeEnv
  });
};

module.exports = {
  getResponse
};
