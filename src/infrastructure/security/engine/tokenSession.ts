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
  
  generate(payload: Omit<TokenSessionPayload, 'tokenUniqueId' | 'issuedAt' | 'expiresAt' | 'lastActivityAt'>): Promise<string>;
  decrypt(token: string): Promise<TokenSessionPayload>;
}
