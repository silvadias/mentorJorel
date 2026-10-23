import type { IdentityProvidersCatalogEngine, FederatedAuthenticator } from '../engine/federatedAuthenticator';
import      { GoogleAuthenticator }   from './googleAuthenticator';
import      { FacebookAuthenticator } from './facebookAuthenticator';
import      { LinkedinAuthenticator } from './linkedinAuthenticator';
import      { DomainException }       from '../../../api/errors/domainException';

/**
 * @class IdentityProvidersCatalog
 * @description Catálogo Plugável e Strongly-Typed de Provedores de Identidade Externa.
 * Reúne e gerencia as instâncias operacionais das Big Techs dentro da camada de adaptadores.
 */
export class IdentityProvidersCatalog implements IdentityProvidersCatalogEngine {
  private readonly providersCatalogStore = new Map<string, FederatedAuthenticator>();

  constructor() {
    // Registra atomicamente as instâncias executáveis no buffer in-memory
    this.providersCatalogStore.set('google',   new GoogleAuthenticator());
    this.providersCatalogStore.set('facebook', new FacebookAuthenticator());
    this.providersCatalogStore.set('linkedin', new LinkedinAuthenticator());
  }

  public getProvider(providerName: string): FederatedAuthenticator {
    const activeEngine = this.providersCatalogStore.get(providerName.toLowerCase().trim());
    
    if (!activeEngine) {
      throw new DomainException('IDENTITY_PROVIDER_UNSUPPORTED');
    }
    
    return activeEngine;
  }
}
