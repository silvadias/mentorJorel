import type { Request, Response, NextFunction } from 'express';
interface CustomError extends Error {
    statusCode?: number;
}
declare function errorHandler(err: CustomError, req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>>;
export default errorHandler;
//# sourceMappingURL=errorHandler.d.ts.map