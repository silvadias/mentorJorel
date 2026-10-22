import type { FederatedAuthenticator } from '../../../infrastructure/identityProviders/engine/federatedAuthenticator';
import type { SystemLogger }           from '../../../infrastructure/telemetry/engine/systemLogger';

/** Contrato de entrada contendo a sessão ativa e o token da federação de identidade. */
export interface AssociateIdentityInput {
  readonly actorId     : string;
  readonly accessToken : string;
}

/**
 * @class AssociateExternalIdentityUseCase
 * @description Caso de Uso para Unificação de Identidade Progressiva.
 * Consome pontes abstratas de federação para elevar privilégios operacionais de um ator,
 * fundindo históricos efêmeros a contas corporativas consolidadas (ex: Google, Facebook).
 */
export class AssociateExternalIdentityUseCase {
  private readonly authenticator: FederatedAuthenticator;

  constructor(authenticator: FederatedAuthenticator) {
    this.authenticator = authenticator;
  }

  /**
   * @description Dispara a sequência de upgrade perimetral por Inversão de Controle.
   * Aciona a porta de autenticação polimórfica sem expor o domínio ao provedor físico final.
   */
  public async execute(input: AssociateIdentityInput, logger: SystemLogger): Promise<void> {
    logger.info(`Initiating federation upgrade sequence for target actor: [${input.actorId}]`);

    // Inversão de Controle: Consome o contrato agnóstico recebendo os dados purificados do perfil
    const externalProfile = await this.authenticator.authenticate(input.accessToken);

    logger.info(`Identity mapping secured between [${externalProfile.email}] and actor [${input.actorId}]`);
  }
}
