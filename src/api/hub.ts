import { Router } from 'express';
import { HomeRoutes } from './home/routes';
import { UserRoutes } from './users/routes';

export const Hub = Router();

Hub.use('/', HomeRoutes);
Hub.use('/users', UserRoutes);
