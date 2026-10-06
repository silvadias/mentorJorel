/**
 * @file catalog.ts
 * @description O Ponto Único de Verdade do ecossistema de falhas. Exportação exclusiva do catálogo unificado.
 */

import { HomeError }                 from "./domain/home";
import { AccessIdentificationError } from "./domain/accessIdentification";
import { SecurityError }             from "./domain/security";

export const ErrorCatalog = {
  ...HomeError,
  ...AccessIdentificationError,
  ...SecurityError
} as const;

export type ErrorCode = keyof typeof ErrorCatalog;
