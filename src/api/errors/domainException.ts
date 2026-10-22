import      { ErrorCatalog }    from './catalog';
import type { ErrorCode }       from './catalog';

/**
 * @file domainException.ts
 * @description Exceção agnóstica do Domínio.
 * Intercepta as configurações do catálogo unificado através de tipagem estrita,
 * hidratando automaticamente mensagens de negócio e códigos de estado HTTP nativos.
 */
export class DomainException extends Error {
  public readonly uniqueCode: string;
  public readonly httpStatus: number;

  constructor(catalogCode: ErrorCode) {
    const                   errorConfiguration = ErrorCatalog[catalogCode];    
    super                   (errorConfiguration.message);    
    this.uniqueCode         = errorConfiguration.code;
    this.httpStatus         = errorConfiguration.statusCode;    
    Object.setPrototypeOf   (this, DomainException.prototype);

  } 
}

/** Contrato estrutural padrão para payloads de falhas externas devolvidos à rede física. */
export interface HttpFailurePayload {
  status        : 'error' | 'fail';
  code          : string;
  message       : string;
  debugMessage? : string;
  errors?       : string[];

}

/** Contrato de tradução polimórfica que obriga adaptadores a formatarem erros brutos em respostas HTTP de borda. */
export interface HttpFailureFormatter {
  format(rawError: unknown, includeDebugDetails: boolean): {
    statusCode   : number;
    payload      : HttpFailurePayload;

  };  
}
