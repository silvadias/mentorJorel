import { mockApiKeyTable, type ApiKeyRow } from '../../../../database/apiKeys/apiKeyTables';

/**
 * @file apiKeyInstance.ts
 * @description Driver de Conexão Virtual e Motor de Varredura de Chaves de Acesso.
 * Abstrai as assinaturas de busca linear de baixo nível, agindo de forma idêntica
 * a conectores físicos de produção para mitigar acoplamento precoce de infraestrutura.
 */
export const apiKeyConnection = {
  query: {
    /**
     * @description Executa a query física de busca por correspondência de string.
     * Varre atomicamente a tabela mockada e retorna o envelope da linha ou nulo.
     */
    findKeyByString: (identificationKey: string): ApiKeyRow | null => {

      return mockApiKeyTable.find(row => row.keyString === identificationKey) || null;      
    }
  }
};
