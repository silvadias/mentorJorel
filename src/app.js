//app.js
const express = require('express');
const app = express();
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./api/hub');

app.use(express.json());
app.use(routes);
app.use(errorHandler);

module.exports = app;
