/**
 * @file identity.ts
 * @description Dicionário literal de mensagens de erro específicas para o perímetro de identificação progressiva e acessos.
 */

export const IdentityErrors = {
  FEDERATED_AUTHENTICATION_FAILED: {
    code       : 'FEDERATED_AUTHENTICATION_FAILED',
    statusCode : 401,
    message    : 'A validação de identidade junto ao provedor externo falhou ou o token fornecido encontra-se expirado.'
  },
  IDENTITY_PROVIDER_COLLISION: {
    code       : 'IDENTITY_PROVIDER_COLLISION',
    statusCode : 409,
    message    : 'Esta conta de provedor externo já encontra-se vinculada e em posse de outra identidade ativa no sistema.'
  },
  ACTOR_NOT_FOUND: {
    code       : 'ACTOR_NOT_FOUND',
    statusCode : 404,
    message    : 'O identificador de ator operacional fornecido não foi localizado no ecossistema de dados ativo.'
  },
  IDENTITY_PROVIDER_UNSUPPORTED: {
    code       : 'IDENTITY_PROVIDER_UNSUPPORTED',
    statusCode : 400,
    message    : 'O provedor de identidade externa solicitado não possui suporte técnico ou foi desativado na plataforma.'
  },
  ANONYMOUS_SESSION_EXPIRED: {
    code       : 'ANONYMOUS_SESSION_EXPIRED',
    statusCode : 401,
    message    : 'A assinatura temporal do seu dispositivo efêmero expirou. É necessária a renovação da assinatura de hardware.'
  }
};
