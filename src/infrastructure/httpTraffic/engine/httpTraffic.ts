import type { SystemLogger }                from '../../telemetry/engine/systemLogger';
import type { TokenSessionPayload }         from '../../security/token/engine/tokenSession';
import type { ConsumerSpecificationEngine } from '../../security/apiKeyTenant/engine/specification';

/**
 * Contrato agnóstico para governança de políticas de tráfego de uso geral.
 * Centraliza as definições de CORS e blindagem comportamental de cabeçalhos
 * utilizando apenas vocabulário do domínio da solução, livre de termos imperativos.
 */
export interface HttpNetworkSecurityPolicy {
  readonly allowedOrigins          : string[];
  readonly allowedMethods          : string[];
  readonly allowedHeaders          : string[];
  readonly exposedHeaders          : string[];
  readonly isFrameworkSignatureHidden: boolean;
  readonly perimeterDefenses       : Record<string, string>;
}

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
  consumer    : ConsumerSpecificationEngine;
}

export interface HttpTrafficResponse<Payload = any> {
  statusCode : number;
  body       : Payload;
  newToken?  : string;
}

export type HttpTrafficHandler = (request: HttpTrafficRequest) => Promise<HttpTrafficResponse>;

export interface HttpTrafficExchangeEngine {
  register(
    method      : 'get' | 'post' | 'put' | 'delete', 
    resourcePath: string, 
    handler     : HttpTrafficHandler, 
    schema?     : unknown
  ): void;
  start(): void;
}
