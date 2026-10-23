import type { UsersRepositoryEngine } from '../ports/usersRepository';

export type ActorTrustLevel =
  | 'UNRECOGNIZED_ANONYMOUS' 
  | 'TRACKED_ANONYMOUS'      
  | 'FEDERATED_SIGNUP'       
  | 'EMAIL_VERIFIED'         
  | 'IDENTITY_AUDITED';

/**
 * @interface VisitorHardwareSignature
 * @description Assinatura de Hardware do Dispositivo de Entrada.
 * Consolida as amarras físicas cruzadas coletadas na portaria de rede para cruzamentos de identidade.
 */
export interface VisitorHardwareSignature {
  readonly clientGeneratedFingerprintId : string;
  readonly incomingNetworkIpAddress     : string;
  readonly clientUserAgentHash          : string;
}

/**
 * @interface DiscoveredIdentityProfile
 * @description Perfil de Identidade Descoberto e Re-hidratado.
 * Retorna as propriedades limpas do Ator localizadas através da correspondência de hardware.
 */
export interface DiscoveredIdentityProfile {
  readonly actorId                 : string;
  readonly temporaryDisplayUsername: string;
  readonly actorTrustLevel         : ActorTrustLevel;
  readonly deviceFingerprintId     : string;
  readonly initialIpAddress        : string;
  readonly clientUserAgentHash     : string;
}

/**
 * @interface DiscoveryResultBoundary
 * @description Envelope de Fronteira do Resultado do Diagnóstico de Disco.
 * Sinaliza de forma tipada para a portaria se a máquina foi reconhecida ou se é inédita.
 */
export interface DiscoveryResultBoundary {
  readonly isIdentified  : boolean;
  readonly activeProfile : DiscoveredIdentityProfile;
}

/**
 * @class DiscoverVisitorIdentityUseCase
 * @description Caso de Uso para Descoberta de Identidade por Hardware.
 * Coordena o fluxo lógico puro de negócios para re-hidratar ou classificar atores na portaria.
 */
export class DiscoverVisitorIdentityUseCase {
  private readonly usersRepository: UsersRepositoryEngine;

  /**
   * Injeção de Dependência da Porta Hexagonal de Persistência (DIP).
   */
  constructor(usersRepository: UsersRepositoryEngine) {
    this.usersRepository = usersRepository;
  }
  
  /**
   * @description Executa a busca cruzada delegando a varredura ao adaptador de dados.
   * @returns O envelope contendo o diagnóstico de identificação e o perfil estruturado com as assinaturas.
   */
  public async execute(signature: VisitorHardwareSignature): Promise<DiscoveryResultBoundary> {
    const safeFingerprint = signature.clientGeneratedFingerprintId || 'unknown_hardware';

    // Consulta a porta de persistência que retorna a linha crua do MySQL
    const databaseProfile = await this.usersRepository.findVisitorByHardware(signature);

    // CORREÇÃO ESTRITA SOLICITADA: Mapeia de forma explícita as propriedades de IMySQLUserRow para DiscoveredIdentityProfile
    if (databaseProfile) {
      return {
        isIdentified  : true,
        activeProfile : {
          actorId                  : `user_id_${databaseProfile.id}`,
          temporaryDisplayUsername : databaseProfile.name,
          actorTrustLevel          : 'TRACKED_ANONYMOUS',
          deviceFingerprintId      : safeFingerprint,
          initialIpAddress         : signature.incomingNetworkIpAddress,
          clientUserAgentHash      : signature.clientUserAgentHash
        }
      };
    }

    // 🧬 FLUXO DE DESCOBERTA INÉDITA: Sinaliza o Cache Miss preservando o envelope de assinaturas intacto
    return {
      isIdentified  : false,
      activeProfile : {
        actorId                  : 'ANONYMOUS',
        temporaryDisplayUsername : 'guest_temporary',
        actorTrustLevel          : 'UNRECOGNIZED_ANONYMOUS',
        deviceFingerprintId      : safeFingerprint,
        initialIpAddress         : signature.incomingNetworkIpAddress,
        clientUserAgentHash      : signature.clientUserAgentHash
      }
    };
  }
}
