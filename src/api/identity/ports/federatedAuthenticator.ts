export interface FederatedIdentityPayload {
  readonly externalId : string;
  readonly email      : string;
  readonly fullName   : string;
}

export interface FederatedAuthenticator {
  /**
   * Valida a assinatura do token e extrai as informações do perfil do usuário de forma agnóstica.
   */
  authenticate(accessToken: string): Promise<FederatedIdentityPayload>;
}
