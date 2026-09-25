import { Router } from 'express';
import { HomeRoutes } from './home/routes';
import { UserRoutes } from './users/routes';
import { InitialChatRoutes } from './initialChat/routes';
import { TestRoutes } from './test/routes';

export const Hub = Router();

Hub.use('/', HomeRoutes);
Hub.use('/users', UserRoutes);
Hub.use('/initial-chat', InitialChatRoutes);
Hub.use('/test', TestRoutes); 
