import type { SystemLogger }                from '../../telemetry/engine/systemLogger';
import type { TokenSessionPayload }         from '../../security/token/engine/tokenSession';
import type { ConsumerSpecificationEngine } from '../../security/apiKeyTenant/engine/specification';

/**
 * @interface HttpNetworkSecurityPolicy
 * @description Governança perimetral e contratos de segurança aplicados à borda de rede.
 * Mapeia as configurações de CORS, cabeçalhos de defesa contra ataques e ocultação de assinaturas tecnológicas.
 */
export interface HttpNetworkSecurityPolicy {
  readonly allowedOrigins             : string[];
  readonly allowedMethods             : string[];
  readonly allowedHeaders             : string[];
  readonly exposedHeaders             : string[];
  /** Se verdadeiro, orienta a remoção do cabeçalho 'X-Powered-By' para mitigar engenharia reversa. */
  readonly isFrameworkSignatureHidden : boolean;
  /** Dicionário imutável de cabeçalhos de proteção (ex: X-Frame-Options, X-Content-Type-Options). */
  readonly perimeterDefenses          : Record<string, string>;
}

/**
 * @interface HttpTrafficRequest
 * @description Envelope purificado e agnóstico de uma requisição de entrada.
 * Hidrata os dados brutos de transporte e anexa o logger contextualizado, a sessão do ator e o plano contratual.
 */
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
  /** Logger contextualizado contendo Trace ID e metadados de auditoria gerados na portaria de rede. */
  logger      : SystemLogger;
  /** Identidade e estado da sessão do ator (pode operar degradada em 'ANONYMOUS'). */
  session     : TokenSessionPayload;
  /** Metadados e limites de faturamento da aplicação parceira autenticada via X-API-Key. */
  consumer    : ConsumerSpecificationEngine;
}

/** Envelope purificado de retorno que os controladores e ações devolvem ao adaptador de rede física. */
export interface HttpTrafficResponse<Payload = any> {
  statusCode : number;
  body       : Payload;
  newToken?  : string;
}

/** Assinatura padronizada para funções tratadoras de tráfego que operam de forma assíncrona. */
export type HttpTrafficHandler = (request: HttpTrafficRequest) => Promise<HttpTrafficResponse>;

/**
 * @interface HttpTrafficExchangeEngine
 * @description Porta Hexagonal (Port) do barramento central de roteamento.
 * Expõe as operações declarativas para registro de endpoints e boot de escuta da infraestrutura.
 */
export interface HttpTrafficExchangeEngine {
  register(
    method      : 'get' | 'post' | 'put' | 'delete', 
    resourcePath: string, 
    handler     : HttpTrafficHandler, 
    schema?     : unknown
  ): void;
  start(): void;
}
