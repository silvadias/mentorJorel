import type { HttpFailureFormatter,
              HttpFailurePayload }  from '../../../api/errors/domainException';
import      { DomainException }     from '../../../api/errors/domainException';
import      { ValidationException } from './httpValidation';

export class ApplicationFailureFormatter implements HttpFailureFormatter {  
  public format(
    rawError: unknown,
    includeDebugDetails: boolean
  ):{ 
      statusCode: number; 
      payload   : HttpFailurePayload 
    }{
    
    if (rawError instanceof DomainException) {
      return {
        statusCode: rawError.httpStatus,
        payload: {
          status: 'error',
          code: rawError.uniqueCode,
          message: rawError.message

        }
      };    
    }

    if (rawError instanceof ValidationException) {
      return {
        statusCode: 422,
        payload: {
          status: 'fail',
          code: 'REQUEST_VALIDATION_FAILED',
          message: 'The data provided fails to comply with the endpoint verification contract.',
          errors: rawError.errors

        }
      };    
    }

    const fallbackMessage = rawError instanceof Error ? rawError.message : 'Internal server error';
    
    return {
      statusCode: 500,
      payload: {
        status: 'fail',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
        ...(includeDebugDetails && { debugMessage: fallbackMessage })

      }
    };
  }
}
