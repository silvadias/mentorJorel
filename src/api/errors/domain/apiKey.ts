export const ApiKeyErrors = {
  API_KEY_MISSING: {
    code       : 'API_KEY_MISSING',
    statusCode : 401,
    message    : 'A requisição operacional não forneceu a chave de credencial X-API-Key necessária para acesso.'
  },
  API_KEY_INVALID: {
    code       : 'API_KEY_INVALID',
    statusCode : 401,
    message    : 'A chave de credencial fornecida encontra-se incorreta, corrompida ou inexistente no ecossistema.'
  },
  API_KEY_SUSPENDED: {
    code       : 'API_KEY_SUSPENDED',
    statusCode : 403,
    message    : 'Este terminal de aplicação parceira encontra-se administrativamente suspenso por violação de termos de uso.'
  }
};
