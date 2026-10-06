export interface AccessRequestMetadata {
  readonly actorId      : string;
  readonly resourcePath : string;
}

export interface AccessDecisionResponse {
  readonly isAvailable : boolean;
  readonly disabledBy? : string;
  readonly reason?     : string;
}

export interface AccessEvaluator {

  canAccess(metadata: AccessRequestMetadata): Promise<AccessDecisionResponse>;
}
