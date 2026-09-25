import { Router } from 'express';
import { HomeController } from './controller';

export const HomeRoutes = Router();

HomeRoutes.get('/', HomeController.getResponse);