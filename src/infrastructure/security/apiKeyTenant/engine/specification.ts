export interface ConsumerSpecificationEngine {
  readonly identificationKey             : string;
  readonly ownerDeveloperIdentifier      : string;
  readonly rateLimitTier                 : 'FREE' | 'PREMIUM' | 'ENTERPRISE';
  readonly isAccessSuspended             : boolean;
}
