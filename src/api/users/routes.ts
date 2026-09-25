import { Router } from 'express';
import { UserController } from './controller';

export const UserRoutes  = Router();

UserRoutes.get('/', UserController.getUsers);
UserRoutes.post('/', UserController.storeUser);
