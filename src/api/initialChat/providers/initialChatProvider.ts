/**
 * DTO de entrada padrão para qualquer inteligência artificial.
 * Isolado de jargões de SDKs específicos.
 */
export interface ChatGenerationInput {
  prompt: string;
  modelOverride?: string;
}

/**
 * InitialChatProvider
 * Interface estrita baseada no ISP (Princípio da Segregação de Interfaces).
 * Define o contrato único que o domínio exige de qualquer IA contratada.
 */
export interface InitialChatProvider {
  generateText(input: ChatGenerationInput): Promise<string>;
}
