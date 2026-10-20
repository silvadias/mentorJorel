import { mockApiKeyTable, 
        type ApiKeyRow } from '../../../../database/apiKeys/apiKeyTables';

export const apiKeyConnection = {
  query: {
    findKeyByString: (identificationKey: string): ApiKeyRow | null => {

      return mockApiKeyTable.find(row => row.keyString === identificationKey) || null;
      
    }
  }
};