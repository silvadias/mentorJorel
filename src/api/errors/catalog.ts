import * as Domains from "./registy";

type ExtractChaves<T> = T extends any ? keyof T : never;

export const ErrorCatalog = Object.assign({}, ...Object.values(Domains));
export type ErrorCode = ExtractChaves<typeof Domains[keyof typeof Domains]>;