import { Router } from 'express';
import {UsersController} from './controller';

export const UsersRoutes = Router();

UsersRoutes.get('/', UsersController.getAllUsers);
UsersRoutes.post('/', UsersController.createUser);
