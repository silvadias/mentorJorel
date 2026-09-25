import { Router } from 'express';
import { HomeController } from './controller.js'; // Ajustado para Named Import e extensão .js

export const HomeRoutes = Router();

HomeRoutes.get('/', HomeController.getResponse);