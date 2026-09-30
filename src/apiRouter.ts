import { Router }               from 'express';
import { HomeRoutes }           from './api/home/routes';
import { UsersRoutes }          from './api/users/routes';
import { AccessIdentificationRoutes }  from './api/acessIdentification/routes';

export const ApiRouter = Router();

ApiRouter.use('/',                          HomeRoutes);
ApiRouter.use('/acess-identification',      AccessIdentificationRoutes)
ApiRouter.use('/users',                     UsersRoutes);

