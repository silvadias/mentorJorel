/** Dicionário genérico e strongly-typed para acoplamento de metadados contextuais complexos na sinaleira de logs. */
export type LogMetadata = Record<string, any>;

/**
 * @interface SystemLogger
 * @description Porta Hexagonal (Port) de Telemetria e Auditoria Perimetral.
 * Abstrai os motores tecnológicos de saída física de dados e obriga o ecossistema
 * a operar sob a governança de Trace IDs contextualizados e registros de não-repúdio.
 */
export interface SystemLogger {
  /** Deriva uma nova instância do logger acoplando um Trace ID unificado e metadados de requisição fixos. */
  withContext(traceId : string, requestMetadata?  : LogMetadata                            ): SystemLogger;
  /** Registra eventos operacionais de rotina ou fluxos lineares do sistema. */
  info      (message  : string, metadata?         : LogMetadata                            ): void;
  /** Alerta sobre comportamentos anômalos que violam barreiras operacionais mas não abortam a execução. */
  warn      (message  : string, metadata?         : LogMetadata                            ): void;
  /** Captura exceções brutas desempacotando stacks de rastreamento físicos para diagnóstico de falhas. */
  error     (message  : string, rawError?         : unknown,      metadata?   : LogMetadata): void;
  /** Emite eventos imutáveis de segurança perimetral associando ações a atores operacionais específicos. */
  audit     (action   : string, actorId           : string,       metadata?   : LogMetadata): void;
}
