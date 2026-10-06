import      jwt                             from 'jsonwebtoken';
import      crypto                          from 'crypto';
import type { TokenCryptographerEngine,
              TokenSessionPayload }         from '../../engine/tokenContext';
import      { DomainException }             from '../../../httpTraffic/engine/errors';


export class ExpressJwtAdapter implements TokenCryptographerEngine {
  private readonly secretPrivateKey   : string;
  private readonly expirationInSeconds : number;

  constructor(configuration: { 
    secretKey         : string; 
    expirationSeconds : number; 
  }) {
    this.secretPrivateKey     = configuration.secretKey;
    this.expirationInSeconds  = configuration.expirationSeconds;
  }

  public async generate(payload: Omit<TokenSessionPayload, 'tokenUniqueId' | 'issuedAt' | 'expiresAt'>): Promise<string> {
    const generatedTokenId = crypto.randomUUID();
    
    const tokenClaims = {
      sub : payload.actorId,
      did : payload.deviceFingerprintId,
      jti : generatedTokenId
    };

    return jwt.sign(tokenClaims, this.secretPrivateKey, {
      expiresIn: this.expirationInSeconds
    });
  }

  public async decrypt(token: string): Promise<TokenSessionPayload> {
    try {
      const decodedClaims = jwt.verify(token, this.secretPrivateKey) as jwt.JwtPayload;

      if (!decodedClaims['sub'] || !decodedClaims['did'] || !decodedClaims['jti']) {
        throw new DomainException('SECURITY_TOKEN_CORRUPTED');
      }

      return {
        actorId             : decodedClaims['sub'],
        deviceFingerprintId : decodedClaims['did'],
        tokenUniqueId       : decodedClaims['jti'],
        issuedAt            : new Date((decodedClaims['iat'] ?? 0) * 1000),
        expiresAt           : new Date((decodedClaims['exp'] ?? 0) * 1000)
      };

    } catch (capturedError: unknown) {
      if (capturedError instanceof DomainException) {
        throw capturedError;
      }

      if (capturedError instanceof jwt.TokenExpiredError) {
        throw new DomainException('SECURITY_TOKEN_EXPIRED');
      }

      throw new DomainException('SECURITY_TOKEN_CORRUPTED');
    }
  }
}
