import type { Request, Response } from 'express';
import      {Env}                 from '../../config/env';

export const HomeController = {

  getResponse:(req: Request, res: Response) => {
     return res.status(200).json({
      message: "Node.ts Standard Template with Express running perfectly inside Docker!",
      status: "online",
      environment: Env.nodeEnv
    });
  }
};