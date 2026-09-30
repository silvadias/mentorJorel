import { Router } from 'express';
import type { Request, Response } from 'express';

export const AnonymousAccessRoutes = Router();

AnonymousAccessRoutes.get('/', (req: Request, res: Response): any => {
  return res.status(200).json({
    message: "Rota de Anonimous funcionando falta criar controller",
    status: "online",
    environment: "teste"
  });
});
