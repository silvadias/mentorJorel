import { Router }       from 'express';
import {HomeRoutes}     from './api/home/routes';
import {UsersRoutes}    from './api/users/routes';

export const ApiRouter = Router();

ApiRouter.use('/',              HomeRoutes);
ApiRouter.use('/users',         UsersRoutes);

