export type ActorTrustLevel =
  | 'UNRECOGNIZED_ANONYMOUS' 
  | 'TRACKED_ANONYMOUS'      
  | 'FEDERATED_SIGNUP'       
  | 'EMAIL_VERIFIED'         
  | 'IDENTITY_AUDITED';

/**
 * @interface IMySQLUserRow
 * @description Esquema de Registro Físico da Tabela de Usuários no MySQL.
 * Mapeia o formato cru dos campos persistidos, incorporando as amarras cruzadas de hardware
 * e níveis progressivos de identificação para suporte a identidades efêmeras.
 */
export interface IMySQLUserRow {
  id                  : number;
  name                : string;
  email               : string;
  trustLevel          : ActorTrustLevel;
  deviceFingerprintId  : string | null;
  initialIpAddress     : string | null;
  clientUserAgentHash  : string | null;
}

/** Array mutável alocado na memória RAM que simula os registros em disco da tabela física. */
export const mysqlUsersTable: IMySQLUserRow[] = [
  { 
    id                  : 1, 
    name                : "Luis Carlos", 
    email               : "silvadias.perfil@outlook.com",
    trustLevel          : 'IDENTITY_AUDITED',
    deviceFingerprintId  : "fingerprint_luis_corporation_999",
    initialIpAddress     : "127.0.0.1",
    clientUserAgentHash  : "sha256_navegador_luis"
  },
  { 
    id                  : 2,
    name                : "John Doe",
    email               : "john@example.com",
    trustLevel          : 'FEDERATED_SIGNUP',
    deviceFingerprintId  : "fingerprint_john_test_456",
    initialIpAddress     : "192.168.1.1",
    clientUserAgentHash  : "sha256_navegador_john"
  },
  {
    id                  : 3,
    name                : "guest_efemeral_tracked_777",
    email               : "guest_777@efemeral.local",
    trustLevel          : 'TRACKED_ANONYMOUS',
    deviceFingerprintId  : "gemini_free_token_test_123", // ◄ Amarração física para testes controlados de Cache Hit de anônimo recorrente
    initialIpAddress     : "127.0.0.1",
    clientUserAgentHash  : "sha256_hardware_test_zone"
  }
];
