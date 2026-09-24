import { Router } from 'express';
import homeController from './controller';

const router = Router();

router.get('/', homeController.getResponse);

export default router;
