// src/api/home/controller.ts
import type { Request, Response } from 'express';
import env from '../../config/env';

const getResponse = (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Node.ts Standard Template with Express running perfectly inside Docker!",
    status: "online",
    environment: env.nodeEnv
  });
};

export default {
  getResponse
};
