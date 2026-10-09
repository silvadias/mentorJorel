import type { FederatedAuthenticator, FederatedIdentityPayload } from '../../../api/identity/ports/federatedAuthenticator';

export class GoogleAuthenticator implements FederatedAuthenticator {
  public async authenticate(accessToken: string): Promise<FederatedIdentityPayload > {
    if (accessToken === 'invalid_google_token') {
      throw new Error('GOOGLE_API_AUTHENTICATION_FAILED');
    }

    return {
      externalId : 'google_oauth2_sub_9992312',
      email      : 'silvadias.perfil@outlook.com',
      fullName   : 'Luis Carlos Silva Dias'
      
    };
  }
}
