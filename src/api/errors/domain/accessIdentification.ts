export const AccessIdentificationError = {
  MISSING_DEVICE_IDENTIFIERS: {
    code: "MISSING_DEVICE_IDENTIFIERS",
    message: "Os identificadores vitais do hardware (Fingerprint ou Browser Instance ID) estão ausentes na requisição.",
    statusCode: 400,
  },
  INVALID_FINGERPRINT_FORMAT: {
    code: "INVALID_FINGERPRINT_FORMAT",
    message: "A assinatura estrutural (Fingerprint ID) informada não atende aos padrões de codificação esperados.",
    statusCode: 400,
  },
  INVALID_BROWSER_INSTANCE_FORMAT: {
    code: "INVALID_BROWSER_INSTANCE_FORMAT",
    message: "O identificador de ciclo do navegador (Browser Instance ID) está malformado.",
    statusCode: 400,
  },
  INVALID_PERMANENT_DEVICE_TOKEN: {
    code: "INVALID_PERMANENT_DEVICE_TOKEN",
    message: "O token de persistência física (Permanent Device ID) é inválido ou expirou.",
    statusCode: 422,
  },

  // AccessDeviceBrowserMetadata
  MISSING_USER_AGENT: {
    code: "MISSING_USER_AGENT",
    message: "O cabeçalho identificador do agente do usuário (User-Agent) é obrigatório e não foi informado.",
    statusCode: 400,
  },
  UNSUPPORTED_OPERATING_SYSTEM: {
    code: "UNSUPPORTED_OPERATING_SYSTEM",
    message: "O sistema operacional extraído do dispositivo não é suportado pelas regras corporativas.",
    statusCode: 422,
  },
  INVALID_IP_ADDRESS_FORMAT: {
    code: "INVALID_IP_ADDRESS_FORMAT",
    message: "A string de rede fornecida não corresponde a um endereço de protocolo IP (v4 ou v6) válido.",
    statusCode: 400,
  },
  INVALID_COUNTRY_CODE: {
    code: "INVALID_COUNTRY_CODE",
    message: "O código de localização geográfica do país deve seguir estritamente o padrão ISO 3166-1 Alpha-2.",
    statusCode: 400,
  },
  MISSING_PREFERRED_LANGUAGES: {
    code: "MISSING_PREFERRED_LANGUAGES",
    message: "A lista de idiomas preferidos do navegador (Accept-Language) não pôde ser interpretada.",
    statusCode: 400,
  }
} as const;
