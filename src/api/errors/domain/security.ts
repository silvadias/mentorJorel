export const SecurityError = {
  SECURITY_TOKEN_EXPIRED: {
    code       : "SECURITY_TOKEN_EXPIRED",
    message    : "O passaporte de segurança expirou. Por favor, realize uma nova identificação.",
    statusCode : 401
  },
  SECURITY_TOKEN_CORRUPTED: {
    code       : "SECURITY_TOKEN_CORRUPTED",
    message    : "A assinatura do passaporte digital é inválida ou foi corrompida por terceiros.",
    statusCode : 401
  },
  SECURITY_TOKEN_COMPROMISED: {
    code       : "SECURITY_TOKEN_COMPROMISED",
    message    : "A assinatura física do dispositivo não bate com o passaporte ativo. Acesso bloqueado por segurança.",
    statusCode : 403
  }
} as const;
