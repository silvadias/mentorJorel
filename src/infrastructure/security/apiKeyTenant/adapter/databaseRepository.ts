import type { ConsumerFinderEngine }        from './finder';
import type { ConsumerSpecificationEngine } from '../engine/specification';
import      { apiKeyConnection }            from '../drivers/apiKeyInstance'; // ◄ Aponta para a nova pasta externa de conexão

/**
 * @class DataBaseConsumerFinder
 * @description Adaptador Hexagonal de Persistência (Repository) para Chaves de Acesso.
 * Materializa o contrato 'ConsumerFinderEngine' e consome os métodos lineares de busca física,
 * operando como a barreira tradutora entre os tipos cruas de tabela e os contratos abstratos do Domínio.
 */
export class DataBaseConsumerFinder implements ConsumerFinderEngine {
  
  /**
   * @description Realiza a query física e mapeia os resultados estruturados.
   * Converte a assinatura rudimentar numérica do banco tradicional em propriedades booleanas limpas.
   */
  public async byKey(identificationKey: string): Promise<ConsumerSpecificationEngine | null> {
    const databaseRow = apiKeyConnection.query.findKeyByString(identificationKey);

    if (!databaseRow) {
      return null;
    }

    return {
      identificationKey:        databaseRow.keyString,
      ownerDeveloperIdentifier: databaseRow.developerId,
      rateLimitTier:            databaseRow.planTier,
      isAccessSuspended:        databaseRow.isSuspendedNumber === 1
      
    };
  }
}
