export interface TokenSessionPayload {
  readonly actorId             : string;
  readonly deviceFingerprintId : string;
  readonly tokenUniqueId       : string;
  readonly issuedAt            : Date;
  readonly expiresAt           : Date;
}

export interface TokenCryptographerEngine {
  generate(payload: Omit<TokenSessionPayload, 'tokenUniqueId' | 'issuedAt' | 'expiresAt'>): Promise<string>;

  decrypt(token: string): Promise<TokenSessionPayload>;
  
}
