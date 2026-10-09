import type { SystemLogger } from '../../../infrastructure/telemetry/engine/systemLogger';

export interface RegisterAnonymousInput {
  readonly deviceFingerprintId : string;
  readonly initialIpAddress    : string;
}

export interface RegisterAnonymousOutput {
  readonly actorId : string;
  readonly status  : string;
}

export class RegisterAnonymousActorUseCase {

  public async execute(input: RegisterAnonymousInput, logger: SystemLogger): Promise<RegisterAnonymousOutput> {
    logger.info(`Registering dynamic anonymous boundary for hardware fingerprint: [${input.deviceFingerprintId}]`);

    return {
      actorId : `anonymous_${Date.now()}`,
      status  : 'CREATED_EFEMERAL'
    };
  }
}