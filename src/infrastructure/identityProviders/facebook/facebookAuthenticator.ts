import type { FederatedAuthenticator, FederatedIdentityPayload } from '../../../api/identity/ports/federatedAuthenticator';
import      { DomainException }          from '../../../api/errors/domainException';


export class FacebookAuthenticator implements FederatedAuthenticator {

  public async authenticate(accessToken: string): Promise<FederatedIdentityPayload> {
    try {
            
      const facebookApiResponse = await fetch(
        `https://graph.facebook.com/v26.0/me?fields=id,name,email,first_name,last_name,picture&access_token=${accessToken}`  
      );
      
      if (!facebookApiResponse.ok) {
        throw new DomainException('FEDERATED_AUTHENTICATION_FAILED');
      }

      const facebookRawProfile = await facebookApiResponse.json() as any;

      return {
        externalId      : String(facebookRawProfile.id),
        email           : String(facebookRawProfile.email || ''),
        isEmailVerified : !!facebookRawProfile.email,
        fullName        : String(facebookRawProfile.name),
        avatarUrl       : String(facebookRawProfile.picture?.data?.url || 'https://facebook.com')
      };

    } catch (capturedError: unknown) {     
      if (capturedError instanceof DomainException) {
        throw capturedError;
        
      }
      
      throw new DomainException('FEDERATED_AUTHENTICATION_FAILED');
    }
  }
}
