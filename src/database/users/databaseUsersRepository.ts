import type { UsersRepositoryEngine } from '../../api/users/ports/usersRepository';
import type { VisitorHardwareSignature, DiscoveredIdentityProfile } from '../../api/users/userCases/discoverVisitorIdentity';
import type { IMySQLUserRow } from '../mysql/tables';
import      { mysqlConnection } from '../mysql/instance';

/**
 * @class DatabaseUsersRepository
 * @description Adaptador Concreto de Persistência (Adapter).
 * Localizado na periferia de dados para blindar o negócio contra tecnologias.
 */
export class DatabaseUsersRepository implements UsersRepositoryEngine {
  
  /**
   * @description Varre o buffer simulado do MySQL existente na infraestrutura.
   * @returns O perfil purificado de domínio se o dispositivo já foi visto ou 'null' se for inédito.
   */
  public async findVisitorByHardware(signature: VisitorHardwareSignature): Promise<DiscoveredIdentityProfile | null> {
    // Varre o buffer simulado do MySQL existente na infraestrutura
    const allRows = mysqlConnection.query.selectUsers() as any[];
    
    const matchedRow = allRows.find(row => 
      row.deviceFingerprintId === signature.clientGeneratedFingerprintId ||
      (row.initialIpAddress === signature.incomingNetworkIpAddress && row.clientUserAgentHash === signature.clientUserAgentHash)
    );

    if (!matchedRow) {
      return null;
    }

    // 🥇 TRADUÇÃO DE DIALETO (Eric Evans): Transforma a linha crua do banco no Perfil exigido pelo Domínio
    return {
      actorId                  : `user_id_${matchedRow.id}`,
      temporaryDisplayUsername : matchedRow.name,
      actorTrustLevel          : matchedRow.trustLevel || 'TRACKED_ANONYMOUS',
      deviceFingerprintId      : matchedRow.deviceFingerprintId || signature.clientGeneratedFingerprintId,
      initialIpAddress         : matchedRow.initialIpAddress || signature.incomingNetworkIpAddress,
      clientUserAgentHash      : matchedRow.clientUserAgentHash || signature.clientUserAgentHash
    };
  }

  public findAllPermanents(): IMySQLUserRow[] {
    return mysqlConnection.query.selectUsers();
  }

  public insertPermanent(data: { name: string; email: string }): IMySQLUserRow {
    const extendedData = {
      ...data,
      trustLevel: 'UNRECOGNIZED_ANONYMOUS'
    };
    return mysqlConnection.query.insertUser(extendedData as any);
  }
}
