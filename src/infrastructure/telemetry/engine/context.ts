export type LogMetadata = Record<string, any>;

export interface SystemLogger {
  withContext(traceId : string, requestMetadata?  : LogMetadata                            ): SystemLogger;
  info      (message  : string, metadata?         : LogMetadata                            ): void;
  warn      (message  : string, metadata?         : LogMetadata                            ): void;
  error     (message  : string, rawError?         : unknown,      metadata?   : LogMetadata): void;
  audit     (action   : string, actorId           : string,       metadata?   : LogMetadata): void;
}
