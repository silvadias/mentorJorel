/**
 * @interface ConsumerSpecificationEngine
 * @description Contrato de Identidade e Capacidade do Tenant.
 * Define as propriedades estruturais de negócio e o nível de plano contratado de uma aplicação parceira.
 */
export interface ConsumerSpecificationEngine {
  /** A credencial física (X-API-Key) tratada como chave exclusiva de identificação. */
  readonly identificationKey             : string;
  /** Vínculo nominal com a conta do programador responsável pela aplicação. */
  readonly ownerDeveloperIdentifier      : string;
  /** Nível ou categoria do plano de consumo ativo ('FREE' | 'PREMIUM' | 'ENTERPRISE'). */
  readonly rateLimitTier                 : 'FREE' | 'PREMIUM' | 'ENTERPRISE';
  /** Indicador de bloqueio administrativo temporal por fraude ou inadimplência. */
  readonly isAccessSuspended             : boolean;
}
