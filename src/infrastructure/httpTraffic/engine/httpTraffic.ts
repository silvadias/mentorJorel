import type { SystemLogger }        from '../../telemetry/engine/systemLogger';
import type { TokenSessionPayload } from '../../security/engine/tokenSession';
import type { ApiKeySessionPayload } from '../../security/engine/apiKeySession';

export interface HttpTrafficRequest<
  Payload           = any, 
  QueryParameters   = any, 
  RouteParameters   = any, 
  HeaderProperties  = any
> {
    body        : Payload;
    query       : QueryParameters;
    params      : RouteParameters;
    headers     : HeaderProperties;
    logger      : SystemLogger;
    session     : TokenSessionPayload;
    application : ApiKeySessionPayload;

  }

export interface HttpTrafficResponse<Payload = any> {
  statusCode : number;
  body       : Payload;
  newToken?  : string;

}

export type HttpTrafficHandler = (request: HttpTrafficRequest) => Promise<HttpTrafficResponse>;

export interface HttpTrafficExchangeEngine {
  register(method: 'get' | 'post' | 'put' | 'delete', resourcePath: string, handler: HttpTrafficHandler, schema?: unknown): void;
  start(): void;
  
}
