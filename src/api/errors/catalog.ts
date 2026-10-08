import { HomeError }                 from "./domain/home";
import { AccessIdentificationError } from "./domain/accessIdentification";
import { SecurityError }             from "./domain/token";
import { ApiKeyErrors }              from "./domain/apiKey";
import { ThrottlerErrors } from "./domain/throttler";

export const ErrorCatalog = {
  ...HomeError,
  ...AccessIdentificationError,
  ...SecurityError,
  ...ApiKeyErrors,
  ...ThrottlerErrors
} as const;

export type ErrorCode = keyof typeof ErrorCatalog;
