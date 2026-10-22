import        jwt                              from 'jsonwebtoken';
import        crypto                           from 'crypto';
import type { TokenCryptographerEngine,
              TokenSessionPayload }            from '../engine/tokenSession';
import      { DomainException }                from '../../../../api/errors/domainException';

/**
 * @class ExpressJwtAdapter
 * @description Adaptador Criptográfico (Adapter) Periférico do Ecossistema JWT.
 * Materializa o contrato 'TokenCryptographerEngine' e enclausura a biblioteca externa 'jsonwebtoken',
 * atuando como o tradutor soberano entre as claims compactas de rede e os payloads estruturados de negócio.
 */
export class ExpressJwtAdapter implements TokenCryptographerEngine {
  private readonly secretPrivateKey     : string;
  private readonly expirationInSeconds  : number;

  constructor(configuration: { 
    secretKey         : string; 
    expirationSeconds : number;
  }) {
    this.secretPrivateKey     = configuration.secretKey;
    this.expirationInSeconds  = configuration.expirationSeconds;
  }

  /**
   * @description Compacta e assina digitalmente um payload de negócio.
   * Traduz as propriedades extensas do domínio para o dicionário encriptado reduzido de tráfego.
   */
  public async generate(payload: Omit<
                        TokenSessionPayload,'tokenUniqueId' | 'issuedAt' | 'expiresAt' | 'lastActivityAt'
                        >
    ): Promise<string> {
    const generatedTokenId  = crypto.randomUUID();
    const tokenClaims       = {
      sub : payload.actorId,
      did : payload.deviceFingerprintId,
      jti : generatedTokenId,
      cip : payload.initialIpAddress,
      uah : payload.clientUserAgentHash,
      rcw : payload.requestSequenceCounter,
      lca : Math.floor(Date.now() / 1000)
    };

    return jwt.sign(tokenClaims, this.secretPrivateKey, {
      expiresIn: this.expirationInSeconds
    });
  }

  /**
   * @description Decodifica e valida a assinatura criptográfica do token de rede.
   * Intercepta falhas primitivas da biblioteca e as normaliza sob o catálogo de exceções.
   */
  public async decrypt(token: string): Promise<TokenSessionPayload> {
    try {
      const decodedClaims = jwt.verify(token, this.secretPrivateKey) as jwt.JwtPayload;

      // BARREIRA DE INTEGRIDADE: Garante que todas as claims vitais exigidas estão presentes no envelope
      if (!decodedClaims['sub'] || 
          !decodedClaims['did'] || 
          !decodedClaims['jti'] ||
          !decodedClaims['cip'] ||
          !decodedClaims['uah'] ||
          decodedClaims['rcw'] === undefined ||
          !decodedClaims['lca']
        ) {
        throw new DomainException('SECURITY_TOKEN_CORRUPTED');
      }

      // Desempacota e traduz as claims compactas para o dialeto estruturado do Domínio
      return {
        actorId                : decodedClaims['sub'],
        deviceFingerprintId    : decodedClaims['did'],
        tokenUniqueId          : decodedClaims['jti'],
        initialIpAddress       : decodedClaims['cip'],
        clientUserAgentHash    : decodedClaims['uah'],
        requestSequenceCounter : decodedClaims['rcw'],
        lastActivityAt         : new Date(decodedClaims['lca'] * 1000),
        issuedAt               : new Date((decodedClaims['iat'] ?? 0) * 1000),
        expiresAt              : new Date((decodedClaims['exp'] ?? 0) * 1000)
      };

    } catch (capturedError: unknown) {

      if (capturedError instanceof DomainException) {
        throw capturedError;
      }
      
      // Captura erros nativos expostos pela biblioteca e envelopa em exceções catalogadas
      if (capturedError instanceof jwt.TokenExpiredError) {
        throw new DomainException('SECURITY_TOKEN_EXPIRED');
      }

      throw new DomainException('SECURITY_TOKEN_CORRUPTED');
    }
  }
}