import { Router } from 'express';
import { TestController } from './controller';

export const TestRoutes = Router();

TestRoutes.get('/', TestController.runConnectionTest);
