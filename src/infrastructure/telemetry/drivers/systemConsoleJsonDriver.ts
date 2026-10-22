import type { SystemLogger,
              LogMetadata } from '../engine/systemLogger';

/**
 * @class SystemConsoleJsonDriver
 * @description Adaptador Periférico (Adapter) para Emissão de Telemetria via Console.
 * Implementa o contrato 'SystemLogger' e formata dinamicamente o fluxo de observabilidade
 * em envelopes estruturados JSON, aplicando isolamento de stack traces em modo de depuração.
 */
export class SystemConsoleJsonDriver implements SystemLogger {
  private readonly traceId            : string | undefined;
  private readonly contextualMetadata : LogMetadata | undefined;
  private readonly prettyFormat       : boolean;

  constructor(
    traceId?            : string,
    contextualMetadata? : LogMetadata,
    prettyFormat        = false
  ) {
    this.traceId            = traceId;
    this.contextualMetadata = contextualMetadata;
    this.prettyFormat       = prettyFormat;

  }

  /** Fábrica polimórfica que estende o contexto operacional injetando o Trace ID e metadados de rede fixos. */
  public withContext(traceId: string, requestMetadata?: LogMetadata): SystemLogger {
    return new SystemConsoleJsonDriver(traceId, requestMetadata, this.prettyFormat);
  }

  public info(message: string, metadata?: LogMetadata): void {
    this.emit('INFO', message, undefined, metadata);
  }

  public warn(message: string, metadata?: LogMetadata): void {
    this.emit('WARN', message, undefined, metadata);
  }

  public error(
    message   : string,
    rawError? : unknown,
    metadata? : LogMetadata
  ): void {
    const errorDetails = rawError instanceof Error 
      ? { name: rawError.name, message: rawError.message, stack: rawError.stack }
      : { raw: rawError };

    this.emit('ERROR', message, errorDetails, metadata);
  }

  public audit(
    action   : string, 
    actorId  : string, 
    metadata?: LogMetadata
  ): void {
    const securityMetadata = { actorId, ...metadata };
    this.emit('AUDIT', `Security Audit Event: [${action}] executed by user [${actorId}]`, undefined, securityMetadata);
  }

  /**
   * @private
   * @description Motor central de renderização e descarga de buffers no stream de saída do processo.
   * Realiza a higienização do objeto de erro e serializa o payload conforme o nível de verbosidade ativo.
   */
  private emit(
    level    : 'INFO' | 'WARN' | 'ERROR' | 'AUDIT',
    message  : string, 
    error?   : any,
    metadata?: LogMetadata
  ): void {
    let isolatedStack : string | undefined;
    let targetError   = error;

    if (this.prettyFormat && 
        error && 
        typeof error === 'object' && 
        'stack' in error
      ) {
      isolatedStack = error.stack;

      const { stack, ...errorWithoutStack } = error;
      targetError = errorWithoutStack;
    }

    const logOutput = {
      timestamp : new Date().toISOString(),
      level     : level,
      message   : message,
      ...(this.traceId   && { traceId: this.traceId }),
      ...(targetError    && { error: targetError }),
      metadata  : {
        ...this.contextualMetadata,
        ...metadata
      }
    };

    if (this.prettyFormat) {
      console.log(JSON.stringify(logOutput, null, 2));
      
      if (isolatedStack) {
        console.log(`\x1b[31m[Stack Trace]:\n${isolatedStack}\x1b[0m`);
      }
    } else {
      console.log(JSON.stringify({ 
        ...logOutput,
        ...(error && { error: targetError })
      }));
    }
  }
}
