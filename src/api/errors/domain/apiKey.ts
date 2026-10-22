/**
 * @file apiKey.ts
 * @description Dicionário de falhas estruturadas para o perímetro de chaves de acesso (Tenancy).
 * Mapeia os estados de negação na borda de tráfego de rede para parceiros e consumidores de API.
 */
export const ApiKeyErrors = {
  /** Indica ausência do cabeçalho de transporte 'x-api-key'. */
  API_KEY_MISSING: {
    code       : 'API_KEY_MISSING',
    statusCode : 401,
    message    : 'A requisição operacional não forneceu a chave de credencial X-API-Key necessária para acesso.'
  },
  /** Indica chave incorreta, inválida ou não persistida no ecossistema. */
  API_KEY_INVALID: {
    code       : 'API_KEY_INVALID',
    statusCode : 401,
    message    : 'A chave de credencial fornecida encontra-se incorreta, corrompida ou inexistente no ecossistema.'
  },
  /** Indica chave válida, porém bloqueada por motivos administrativos ou contratuais. */
  API_KEY_SUSPENDED: {
    code       : 'API_KEY_SUSPENDED',
    statusCode : 403,
    message    : 'Este terminal de aplicação parceira encontra-se administrativamente suspenso por violação de termos de uso.'
  }
};
