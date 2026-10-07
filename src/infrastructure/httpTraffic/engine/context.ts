import type { SystemLogger }        from '../../telemetry/engine/context';
import type { TokenSessionPayload } from '../../security/engine/tokenContext';

export interface HttpTrafficRequest<
  Payload           = any, 
  QueryParameters   = any, 
  RouteParameters   = any, 
  HeaderProperties  = any
> {
    body    : Payload;
    query   : QueryParameters;
    params  : RouteParameters;
    headers : HeaderProperties;
    logger  : SystemLogger;
    // REVELAÇÃO DE PROPÓSITO: Contexto de sessão purificado disponível de forma nativa e transparente
    session : TokenSessionPayload;

  }

export interface HttpTrafficResponse<Payload = any> {
  statusCode: number;
  body      : Payload;

}

export type HttpTrafficHandler = (request: HttpTrafficRequest) => Promise<HttpTrafficResponse>;

export interface HttpTrafficExchangeEngine {
  register(method: 'get' | 'post' | 'put' | 'delete', resourcePath: string, handler: HttpTrafficHandler, schema?: unknown): void;
  start(): void;
  
}
