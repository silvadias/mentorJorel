import { HomeError }                 from "./domain/home";
import { AccessIdentificationError } from "./domain/accessIdentification";
import { SecurityError }             from "./domain/token";
import { ApiKeyErrors }              from "./domain/apiKey";

export const ErrorCatalog = {
  ...HomeError,
  ...AccessIdentificationError,
  ...SecurityError,
  ...ApiKeyErrors
} as const;

export type ErrorCode = keyof typeof ErrorCatalog;
