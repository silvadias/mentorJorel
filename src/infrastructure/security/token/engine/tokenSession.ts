/**
 * @interface TokenSessionPayload
 * @description Modelo de Sessão e Passaporte Digital.
 * Define o envelope strongly-typed com nomes legíveis do domínio que representam
 * a identidade ativa do ator, assinaturas de hardware e sinaleiras temporais de ciclo de vida.
 */
export interface TokenSessionPayload {
  /** Identificador único do ator de negócio (degrada em 'ANONYMOUS' na ausência de sessão). */
  readonly actorId                : string;
  /** Impressão digital estrutural do hardware ou navegador do usuário. */
  readonly deviceFingerprintId    : string;
  /** Identificador criptográfico único imutável do token (JTI) contra ataques de replay. */
  readonly tokenUniqueId          : string;
  /** Endereço IP de rede que originou a emissão e abertura do ciclo de sessão. */
  readonly initialIpAddress       : string;
  /** Hash reduzido (SHA-256) do cabeçalho User-Agent para cruzamentos e auditoria perimetral. */
  readonly clientUserAgentHash    : string;
  /** Contador atômico sequencial de requisições operacionais realizadas sob o mesmo token. */
  readonly requestSequenceCounter : number;
  readonly issuedAt               : Date;
  readonly expiresAt              : Date;
  readonly lastActivityAt         : Date;
}

/**
 * @interface TokenCryptographerEngine
 * @description Porta Hexagonal (Port) de Criptografia de Sessão.
 * Abstrai mecanismos e bibliotecas tecnológicas de serialização e decodificação,
 * isolando o núcleo contra os dialetos compactados de transporte do JWT.
 */
export interface TokenCryptographerEngine {
  
  /** Gera um token compactado omitindo metadados de ciclo de vida gerenciados de forma externa. */
  generate(payload: Omit<TokenSessionPayload, 'tokenUniqueId' | 'issuedAt' | 'expiresAt' | 'lastActivityAt'>): Promise<string>;
  /** Decodifica e traduz o token bruto externo para as propriedades limpas do domínio. */
  decrypt(token: string): Promise<TokenSessionPayload>;

}
