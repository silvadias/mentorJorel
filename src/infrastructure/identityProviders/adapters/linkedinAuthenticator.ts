import type { FederatedAuthenticator,
              FederatedIdentityPayload } from '../engine/federatedAuthenticator';
import      { DomainException }          from '../../../api/errors/domainException';

/**
 * @class LinkedinAuthenticator
 * @description Adaptador Periférico para Federação de Identidade via LinkedIn v2 API.
 * Encapsula as requisições HTTPS contra o endpoint restrito de gerenciamento de perfis de terceiros.
 */
export class LinkedinAuthenticator implements FederatedAuthenticator {

  public async authenticate(token: string): Promise<FederatedIdentityPayload> {
    try {

      const linkedinApiResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!linkedinApiResponse.ok) {
        throw new DomainException('FEDERATED_AUTHENTICATION_FAILED');
      }

      const linkedinRawProfile = await linkedinApiResponse.json() as any;

      return {
        externalId      : String(linkedinRawProfile.sub || ''),
        email           : String(linkedinRawProfile.email || ''),
        isEmailVerified : linkedinRawProfile.email_verified === true || linkedinRawProfile.email_verified === 'true',
        fullName        : String(linkedinRawProfile.name || ''),
        avatarUrl       : String(linkedinRawProfile.picture || '')
      };

    } catch (capturedError: unknown) {
      if (capturedError instanceof DomainException) {
        throw capturedError;
      }
      throw new DomainException('FEDERATED_AUTHENTICATION_FAILED');
    }
  }
}