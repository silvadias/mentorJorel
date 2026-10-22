import { HomeError }                 from "./domain/home";
import { AccessIdentificationError } from "./domain/accessIdentification";
import { SecurityError }             from "./domain/token";
import { ApiKeyErrors }              from "./domain/apiKey";
import { ThrottlerErrors }           from "./domain/throttler";
import { ServiceResilienceErrors }   from "./domain/serviceResilience";
import { IdentityErrors } from "./domain/identity";

/**
 * @file catalog.ts
 * @description Catálogo Unificado de Falhas do Sistema.
 * Consolida por composição todos os dicionários de erros dos subdomínios de negócio e infraestrutura.
 * Fornece a tipagem estrita 'ErrorCode' utilizada trans-fronteira pelo barramento de exceções.
 */
export const ErrorCatalog = {
  ...HomeError,
  ...AccessIdentificationError,
  ...SecurityError,
  ...ApiKeyErrors,
  ...ThrottlerErrors,
  ...ServiceResilienceErrors,
  ...IdentityErrors
  
} as const;

/** União de tipos baseada em literais que restringe as chaves de erro elegíveis no ecossistema. */
export type ErrorCode = keyof typeof ErrorCatalog;
