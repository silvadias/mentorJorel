import type { UsersRepositoryEngine } from '../ports/usersRepository';
import type { VisitorHardwareSignature, DiscoveredIdentityProfile } from './discoverVisitorIdentity';

/**
 * @class ProvisionNewEfemeralVisitorUseCase
 * @description Caso de Uso para Provisionamento e Carimbo de Novo Visitante Efêmero.
 * Gerencia as regras de criação de perfis inéditos e delega a escrita atômica à persistência.
 */
export class ProvisionNewEfemeralVisitorUseCase {
  private readonly usersRepository: UsersRepositoryEngine;

  /**
   * Injeção de Dependência da Porta Hexagonal de Persistência (DIP).
   */
  constructor(usersRepository: UsersRepositoryEngine) {
    this.usersRepository = usersRepository;
  }

  /**
   * @description Executa a escrita atômica do visitante inédito no banco através da abstração.
   * @param signature O envelope contendo as amarras de hardware extraídas na portaria.
   * @returns O passaporte digital estruturado completo preenchido para emissão do Token de tráfego.
   */
  public async execute(signature: VisitorHardwareSignature): Promise <DiscoveredIdentityProfile>{
    const uniqueSequenceTimestamp = Date.now();
    
    // 🥇 TRADUÇÃO DE DIALETO: Transforma os metadados de hardware nas propriedades semânticas nominais.
    // Como a tabela mysqlUsersTable exige 'name' e 'email', o repositório gerará um registro efêmero.
    const temporaryGuestUsername = `guest_${String(uniqueSequenceTimestamp).substring(8)}`;
    const temporaryGuestEmail = `${temporaryGuestUsername}@efemeral.local`;

    // Invoca o repositório por inversão de controle para inserir a linha física real na tabela
    const databaseRow = this.usersRepository.insertPermanent({
      name: temporaryGuestUsername,
      email: temporaryGuestEmail
    });

    // Retorna o perfil unificado fortemente tipado amarrando o ID real do banco ao fluxo do Domínio
    return {
      actorId                  : `user_id_${databaseRow.id}`,
      temporaryDisplayUsername : databaseRow.name,
      actorTrustLevel          : 'UNRECOGNIZED_ANONYMOUS',
      deviceFingerprintId      : signature.clientGeneratedFingerprintId || 'unknown_hardware',
      initialIpAddress         : signature.incomingNetworkIpAddress,
      clientUserAgentHash      : signature.clientUserAgentHash
    };
  }
}
