import express          from 'express';
import {ApiRouter}      from './apiRouter';
import {ErrorHandler}   from './entryPoint/middlewares/errorHandler';

export const App = express();

App.use(express.json());
App.use(ApiRouter);
App.use(ErrorHandler);
