//src/api/hub.ts
import { Router } from 'express';
import home from './home/routes';
import users from './users/routes';

const router = Router();

router.use('/', home);
router.use('/users', users);

export default router;
