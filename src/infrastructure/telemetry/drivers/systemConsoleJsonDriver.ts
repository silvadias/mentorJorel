/**
 * @file systemConsoleJsonDriver.ts
 * @description Implementação concreta do SystemLogger com formatação e tratamento visual de quebras de erros.
 */

import crypto from 'crypto';
import type { SystemLogger, LogMetadata } from '../engine/context';

export class SystemConsoleJsonDriver implements SystemLogger {
  private readonly traceId: string | undefined;
  private readonly contextualMetadata: LogMetadata | undefined;
  private readonly prettyFormat: boolean;

  constructor(traceId?: string, contextualMetadata?: LogMetadata, prettyFormat = false) {
    this.traceId = traceId;
    this.contextualMetadata = contextualMetadata;
    this.prettyFormat = prettyFormat;
  }

  public withContext(traceId: string, requestMetadata?: LogMetadata): SystemLogger {
    return new SystemConsoleJsonDriver(traceId, requestMetadata, this.prettyFormat);
  }

  public info(message: string, metadata?: LogMetadata): void {
    this.emit('INFO', message, undefined, metadata);
  }

  public warn(message: string, metadata?: LogMetadata): void {
    this.emit('WARN', message, undefined, metadata);
  }

  public error(message: string, rawError?: unknown, metadata?: LogMetadata): void {
    const errorDetails = rawError instanceof Error 
      ? { name: rawError.name, message: rawError.message, stack: rawError.stack }
      : { raw: rawError };

    this.emit('ERROR', message, errorDetails, metadata);
  }

  public audit(action: string, actorId: string, metadata?: LogMetadata): void {
    const securityMetadata = { actorId, ...metadata };
    this.emit('AUDIT', `Security Audit Event: [${action}] executed by user [${actorId}]`, undefined, securityMetadata);
  }

  private emit(level: 'INFO' | 'WARN' | 'ERROR' | 'AUDIT', message: string, error?: any, metadata?: LogMetadata): void {
    // Se estiver em desenvolvimento e houver uma stack trace, nós a extraímos temporariamente do JSON para printá-la pura
    let isolatedStack: string | undefined;
    let targetError = error;

    if (this.prettyFormat && error && typeof error === 'object' && 'stack' in error) {
      isolatedStack = error.stack;
      // Remove a stack trace poluída de dentro do JSON para não duplicar visualmente
      const { stack, ...errorWithoutStack } = error;
      targetError = errorWithoutStack;
    }

    const logOutput = {
      timestamp: new Date().toISOString(),
      level,
      ...(this.traceId && { traceId: this.traceId }),
      message,
      ...(targetError && { error: targetError }),
      metadata: {
        ...this.contextualMetadata,
        ...metadata
      }
    };

    if (this.prettyFormat) {
      console.log(JSON.stringify(logOutput, null, 2));
      
      // CORREÇÃO CRÍTICA: Se houver uma stack trace isolada, ela quebra as linhas de forma nativa e visível no terminal
      if (isolatedStack) {
        console.log(`\x1b[31m[Stack Trace]:\n${isolatedStack}\x1b[0m`);
      }
    } else {
      // Em produção, o JSON original contendo a stack compactada em uma linha continua intacto para as máquinas lerem
      console.log(JSON.stringify({ ...logOutput, ...(error && { error }) }));
    }
  }
}
