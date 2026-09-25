import { googleAiClient, DEFAULT_AI_MODEL } from './client';

export const geminiGateway = {
  /**
   * Envia uma mensagem de texto simples e retorna a resposta puramente textual da IA.
   */
  async requestTextGeneration(prompt: string): Promise<string> {
    // Monta a estrutura de payload exigida nativamente pelo SDK da Google
    const payload = {
      model: DEFAULT_AI_MODEL,
      contents: prompt,
    };

    // Conecta e despacha a requisição física de rede
    const response = await googleAiClient.models.generateContent(payload);

    // Recebe, traduz e entrega apenas o dado que o nosso sistema precisa
    return response.text || '';
  }
};
