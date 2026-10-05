import type { HttpFailureFormatter,
              HttpFailurePayload } from './errors';
import      { DomainException }    from './errors';

export class ApplicationFailureFormatter implements HttpFailureFormatter {  
  public format(rawError: unknown, includeDebugDetails: boolean): { statusCode: number; payload: HttpFailurePayload } {
    
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