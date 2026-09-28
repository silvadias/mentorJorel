import { ErrorCatalog } from "./catalog";

export class ApiError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(errorCode: keyof typeof ErrorCatalog) {
    const errorConfig = ErrorCatalog[errorCode];    
    super(errorConfig.message);    
    this.code = errorConfig.code;
    this.statusCode = errorConfig.statusCode;
    
    }
    
}