import      { ErrorCatalog }    from '../../../api/errors/catalog';
import type { ErrorCode }       from '../../../api/errors/catalog';

export class DomainException extends Error {
  public readonly uniqueCode: string;
  public readonly httpStatus: number;

  constructor(catalogCode: ErrorCode) {
    const                   errorConfiguration = ErrorCatalog[catalogCode];    
    super                   (errorConfiguration.message);    
    this.uniqueCode         = errorConfiguration.code;
    this.httpStatus         = errorConfiguration.statusCode;    
    Object.setPrototypeOf   (this, DomainException.prototype);

  }  

}

export interface HttpFailurePayload {
  status        : 'error' | 'fail';
  code          : string;
  message       : string;
  debugMessage? : string;
  errors?       : string[];

}

export interface HttpFailureFormatter {
  format(rawError: unknown, includeDebugDetails: boolean): {
    statusCode   : number;
    payload      : HttpFailurePayload;

  };
  
}
