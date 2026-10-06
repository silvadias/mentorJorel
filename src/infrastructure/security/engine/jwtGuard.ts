import type { HttpTrafficHandler,
              HttpTrafficRequest,
              HttpTrafficResponse } from '../../httpTraffic/engine/context';
import type { TokenCryptographerEngine }   from './tokenContext';
import type { AccessEvaluator }             from './accessEvaluator';
import      { DomainException }             from '../../httpTraffic/engine/errors';

export class JwtGuard {
  private readonly tokenEngine : TokenCryptographerEngine;
  private readonly evaluator   : AccessEvaluator;

  constructor(
    tokenEngine : TokenCryptographerEngine,
    evaluator   : AccessEvaluator
  ) {
    this.tokenEngine = tokenEngine;
    this.evaluator   = evaluator;
  }

  public protect(handler: HttpTrafficHandler): HttpTrafficHandler {
    return async (request: HttpTrafficRequest): Promise<HttpTrafficResponse> => {
      const authorizationHeader = request.headers['authorization'];

      if (!authorizationHeader || 
          typeof authorizationHeader !== 'string' ||
          !authorizationHeader.startsWith('Bearer ')
        ) {
        throw new DomainException('SECURITY_TOKEN_CORRUPTED');

      }

      const cleanToken          = authorizationHeader.substring(7).trim();
      const sessionPayload      = await this.tokenEngine.decrypt(cleanToken);
      
      
      const accessDecision = await this.evaluator.canAccess({
        actorId      : sessionPayload.actorId,
        resourcePath : request.params['resourcePath'] || request.headers['referer'] || 'unknown'
      });

      if (!accessDecision.isAvailable) {
        return {
          statusCode : 403,
          body       : {
            status     : 'fail',
            code       : 'ACCESS_DENIED_BY_HIERARCHY',
            message    : accessDecision.reason || 'Este recurso operacional encontra-se indisponível no momento.',
            isAvailable: false,

            ...(accessDecision.disabledBy && { disabledBy: accessDecision.disabledBy })
          }
        };
      }

      (request as any).session  = sessionPayload;

      return handler(request);
    };
  }
}
