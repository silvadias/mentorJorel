import type { FederatedAuthenticator, FederatedIdentityPayload } from '../engine/federatedAuthenticator';
import      { DomainException }          from '../../../api/errors/domainException';

/**
 * @class GoogleAuthenticator
 * @description Adaptador Periférico (Adapter) para Federação de Identidade via Google.
 * Materializa o contrato 'FederatedAuthenticator' utilizando o 'fetch' nativo do Node.js,
 * isolando o núcleo contra os dialetos de transporte de perfis e autenticação da Big Tech.
 */
export class GoogleAuthenticator implements FederatedAuthenticator {

  public async authenticate(idToken: string): Promise <FederatedIdentityPayload>{
    try {
      const googleApiResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);

      if (!googleApiResponse.ok) {
        throw new DomainException('FEDERATED_AUTHENTICATION_FAILED');
      }

      const googleRawProfile = await googleApiResponse.json() as any;

      return {
        externalId      : String(googleRawProfile.sub),
        email           : String(googleRawProfile.email),
        isEmailVerified : googleRawProfile.email_verified === true || googleRawProfile.email_verified === 'true',
        fullName        : String(googleRawProfile.name),
        avatarUrl       : String(googleRawProfile.picture || 'https://googleusercontent.com')
      };

    } catch (capturedError: unknown) {
      if (capturedError instanceof DomainException) {
        throw capturedError;
      }
      throw new DomainException('FEDERATED_AUTHENTICATION_FAILED');
    }
  }
}
