import type { Request, Response, NextFunction } from 'express';
import      { ApiError }                        from '../../api/errors/apiError';
import      { Env }                             from '../../config/env';

export const ErrorHandler = (
  err: any, 
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {  
      if (err instanceof ApiError) {
          res.status(err.statusCode).json({
            status: 'error',
            code: err.code,
            message: err.message
          });
        return;
      }

    const isDevelopment = Env.nodeEnv === 'development';

    res.status(500).json({
      status: 'fail',
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error',
      ...(isDevelopment && { error_debug: err.message || err })
    });
};
