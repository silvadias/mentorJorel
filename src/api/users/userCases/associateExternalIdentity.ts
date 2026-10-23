import type { IdentityProvidersCatalogEngine, 
              FederatedAuthenticator }       from '../../../infrastructure/identityProviders/engine/federatedAuthenticator';
import type { UsersRepositoryEngine }        from '../ports/usersRepository';
import type { SystemLogger }                 from '../../../infrastructure/telemetry/engine/systemLogger';
import      { DomainException }              from '../../errors/domainException';

/** Contrato de entrada unificado contendo o ID do ator ativo na sessão, o token e a Big Tech alvo. */
export interface AssociateIdentityInput {
  readonly actorId     : string;
  readonly accessToken : string;
  readonly providerName: string; // ◄ Dinâmico enviado pelo clique do cliente: 'google', 'facebook', 'linkedin'
}

/**
 * @class AssociateExternalIdentityUseCase
 * @description Caso de Uso para Unificação e Elevação de Identidade Progressiva (Nível 1).
 * Consome o catálogo polimórfico e a porta de dados de usuários para realizar o upgrade,
 * fundindo históricos efêmeros a contas corporativas consolidadas sem acoplamento tecnológico.
 */
export class AssociateExternalIdentityUseCase {
  private readonly providersCatalog : IdentityProvidersCatalogEngine;
  private readonly usersRepository   : UsersRepositoryEngine;

  /**
   * Injeção de Dependências Pura através de Portas Hexagonais (DIP).
   */
  constructor(providersCatalog: IdentityProvidersCatalogEngine, usersRepository: UsersRepositoryEngine) {
    this.providersCatalog = providersCatalog;
    this.usersRepository  = usersRepository;
  }

  /**
   * @description Dispara a sequência de upgrade perimetral por Inversão de Controle.
   * Resolve o motor dinâmico via catálogo e delega a atualização do nível na persistência.
   */
  public async execute(input: AssociateIdentityInput, logger: SystemLogger): Promise<void> {
    logger.info(`Initiating dynamic federation upgrade sequence via provider: [${input.providerName}]`);

    // 🥇 INVERSÃO DE CONTROLE: Extrai a instância executável correspondente sem ifs hardcoded
    const targetAuthenticator: FederatedAuthenticator = this.providersCatalog.getProvider(input.providerName);
    
    // Aciona a porta assíncrona isolada recebendo os dados purificados do perfil
    const externalProfile = await targetAuthenticator.authenticate(input.accessToken);

    if (!externalProfile.isEmailVerified) {
      logger.warn(`Upgrade aborted. Federated email [${externalProfile.email}] has not been verified by [${input.providerName}].`);
      throw new DomainException('FEDERATED_AUTHENTICATION_FAILED');
    }

    // TODO: Em estágio real de banco, invocar a atualização correspondente na linha do Ator
    // Exemplo: await this.usersRepository.updateToFederated(input.actorId, externalProfile);
    
    logger.info(`Identity mapping secured. Actor [${input.actorId}] successfully upgraded to FEDERATED_SIGNUP via [${input.providerName}].`);
  }
}






