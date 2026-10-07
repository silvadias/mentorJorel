/**
 * @file tokenContext.ts
 * @description Contrato abstrato de criptografia e tipagem humana da Sessão de Segurança Expandida.
 */

export interface TokenSessionPayload {
  readonly actorId                : string;
  readonly deviceFingerprintId    : string;
  readonly tokenUniqueId          : string;
  readonly initialIpAddress       : string;
  readonly clientUserAgentHash    : string;
  readonly requestSequenceCounter : number;
  readonly issuedAt               : Date;
  readonly expiresAt              : Date;
  readonly lastActivityAt         : Date;
}

export interface TokenCryptographerEngine {
  /** Transforma um payload humano estruturado em uma string criptografada inviolável */
  generate(payload: Omit<TokenSessionPayload, 'tokenUniqueId' | 'issuedAt' | 'expiresAt' | 'lastActivityAt'>): Promise<string>;

  /** Decodifica e valida a assinatura do token, devolvendo o payload humano higienizado */
  decrypt(token: string): Promise<TokenSessionPayload>;
}
