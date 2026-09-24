//src/api/users/routes.ts
import { Router } from 'express';
import UsersController from './controller';

const router = Router();

router.get('/', UsersController.getAllUsers);
router.post('/', UsersController.createUser);

export default router;
