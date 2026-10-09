import type { FederatedAuthenticator, FederatedIdentityPayload } from '../../../api/identity/ports/federatedAuthenticator';

export class FacebookAuthenticator implements FederatedAuthenticator {
  public async authenticate(accessToken: string): Promise<FederatedIdentityPayload > {
    return {
      externalId      : 'facebook_graph_uid_777123',
      email           : 'luis.facebook.test@example.com',
      isEmailVerified : true,
      fullName        : 'Luis Carlos Dias (Facebook)',
      avatarUrl       : 'https://facebook.com'
    };
  }
}
