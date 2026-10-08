import { mockApiKeyTable, 
        type ApiKeyRow } from './apiKeyTables';

export const apiKeyConnection = {
  query: {
    findKeyByString: (apiKey: string): ApiKeyRow | null => {
      return mockApiKeyTable.find(row => row.keyString === apiKey) || null;
    }
  }
};
