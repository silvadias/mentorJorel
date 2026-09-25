import { Router } from 'express';
import { TestController } from './.controllerTest-01apiComunication';

export const TestRoutes = Router();

TestRoutes.get('/', TestController.runConnectionTest);
