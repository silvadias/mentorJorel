import { type Request, type Response, type NextFunction } from 'express';
import env from '../config/env';

interface CustomError extends Error {
  statusCode?: number;
}

function errorHandler(err: CustomError, req: Request, res: Response, next: NextFunction) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected internal server error occurred';

  console.error(`[GLOBAL ERROR LOG] [${req.method}] ${req.url} -> Error: ${message}`);
  
  if (err.stack && env.nodeEnv !== 'production') {
    console.error(err.stack);
  }

  return res.status(statusCode).json({ 
    success: false,
    error: {
      status: statusCode,
      message: message
    }
  });
}

export default errorHandler;
