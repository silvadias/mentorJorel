import type { FederatedAuthenticator } from '../ports/federatedAuthenticator';
import type { SystemLogger }           from '../../../infrastructure/telemetry/engine/systemLogger';

export interface AssociateIdentityInput {
  readonly actorId     : string;
  readonly accessToken : string;
}

export class AssociateExternalIdentityUseCase {
  private readonly authenticator: FederatedAuthenticator;

  constructor(authenticator: FederatedAuthenticator) {
    this.authenticator = authenticator;
  }


  public async execute(input: AssociateIdentityInput, logger: SystemLogger): Promise<void> {
    logger.info(`Initiating federation upgrade sequence for target actor: [${input.actorId}]`);

    const externalProfile = await this.authenticator.authenticate(input.accessToken);

    logger.info(`Identity mapping secured between [${externalProfile.email}] and actor [${input.actorId}]`);
  }
}
