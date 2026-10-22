import type { SystemLogger } from '../../../infrastructure/telemetry/engine/systemLogger';

/** Contrato estrutural de entrada contendo assinaturas efêmeras capturadas na borda. */
export interface RegisterAnonymousInput {
  readonly deviceFingerprintId : string;
  readonly initialIpAddress    : string;
}

/** Contrato de saída contendo o ID temporário gerado e o status de criação. */
export interface RegisterAnonymousOutput {
  readonly actorId : string;
  readonly status  : string;
}

/**
 * @class RegisterAnonymousActorUseCase
 * @description Caso de Uso para Registro de Ator Anônimo Efêmero.
 * Isola a lógica de criação de fronteiras dinâmicas baseadas em assinaturas de hardware.
 * Permite que a IA e serviços externos atole dados contextuais de forma isolada antes do cadastro oficial.
 */
export class RegisterAnonymousActorUseCase {

  /**
   * @description Executa o provisionamento do ator temporário na memória.
   * Vincula a sinaleira de tempo ao ID de negócio reduzido para fins de rastreabilidade.
   */
  public async execute(input: RegisterAnonymousInput, logger: SystemLogger): Promise<RegisterAnonymousOutput> {
    logger.info(`Registering dynamic anonymous boundary for hardware fingerprint: [${input.deviceFingerprintId}]`);

    return {
      actorId : `anonymous_${Date.now()}`,
      status  : 'CREATED_EFEMERAL'
    };
  }
}
