export interface FederatedIdentityPayload {
  readonly externalId       : string;
  readonly email            : string;
  readonly isEmailVerified  : boolean;
  readonly fullName         : string;
  readonly avatarUrl        : string;
}


export interface FederatedAuthenticator {
  authenticate(accessToken: string): Promise<FederatedIdentityPayload>;

}
