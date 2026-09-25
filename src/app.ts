import express from 'express';
import { errorHandler } from './middlewares/errorHandler.js';
import { Hub } from './api/hub';

export const app = express();

app.use(express.json());
app.use(Hub);
app.use(errorHandler);
