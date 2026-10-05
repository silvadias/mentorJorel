import { HomeError }                    from "./domain/home";
import { AccessIdentificationError }    from "./domain/accessIdentification";

export const ErrorCatalog = {
  ...HomeError,
  ...AccessIdentificationError
} as const;

export type ErrorCode = keyof typeof ErrorCatalog;