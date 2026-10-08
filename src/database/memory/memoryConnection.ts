import { mockApiKeyTable } from './apiKeyTable';

export const memoryConnection = {
  query: {
    selectApiKeyRows : () => mockApiKeyTable,
    findKeyByString  : (apiKey: string) => {
      return mockApiKeyTable.find(row => row.key_string === apiKey) || null;
    }
  }
};
