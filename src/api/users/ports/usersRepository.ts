import type { VisitorHardwareSignature, DiscoveredIdentityProfile } from '../userCases/discoverVisitorIdentity';
import type { IMySQLUserRow } from '../../../database/mysql/tables';

/**
 * @interface UsersRepositoryEngine
 * @description Porta Hexagonal Unificada de Persistência do Domínio de Usuários.
 * Conecta de forma limpa as regras de negócio aos registros da tabela real do MySQL,
 * tratando os estágios anônimos efêmeros e as contas nominais sob o mesmo barramento.
 */
export interface UsersRepositoryEngine {
  /**
   * @description Varre a tabela real do banco por correspondência de amarras cruzadas de hardware.
   * @param signature O envelope contendo as assinaturas de hardware extraídas na borda.
   * @returns O perfil purificado de domínio se o dispositivo já foi visto ou 'null' se for inédito.
   */
  findVisitorByHardware(signature: VisitorHardwareSignature): Promise<DiscoveredIdentityProfile | null>;

  /** 
   * @description Recupera a coleção factual completa de registros da tabela física do MySQL.
   * @returns Array de linhas cruas estruturadas do banco de dados.
   */
  findAllPermanents(): IMySQLUserRow[];

  /** 
   * @description Insere de forma incremental um novo registro de usuário na tabela real do banco.
   * @param data Payload contendo os dados nominais obrigatórios de cadastro.
   * @returns A linha física do usuário persistida com seu respectivo ID autoincrementado.
   */
  insertPermanent(data: { name: string; email: string }): IMySQLUserRow;
}
