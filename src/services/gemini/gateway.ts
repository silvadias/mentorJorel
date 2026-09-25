import { googleAiClient, DEFAULT_AI_MODEL } from './client.js';
import { type IGeminiPayload } from './jsonBuilder.js';

export const geminiGateway = {
  /**
   * Recebe o JSON completo orquestrado pelo Builder e realiza o disparo físico para a API do Gemini.
   */
  async requestContentGeneration(payload: IGeminiPayload): Promise<string> {
    // Mescla o modelo padrão com as configurações e mensagens montadas pelo Builder
    const requestPayload = {
      model: DEFAULT_AI_MODEL,
      ...payload
    };

    // Conecta e despacha a requisição física de rede
    const response = await googleAiClient.models.generateContent(requestPayload);

    // Retorna a resposta limpa entregue pelos servidores do Google
    return response.text || '';
  }
};
