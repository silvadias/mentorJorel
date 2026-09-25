import { googleAiClient, DEFAULT_AI_MODEL } from './client';

export const geminiGateway = {

  async requestTextGeneration(prompt: string): Promise<string> {
    const payload = {
      model: DEFAULT_AI_MODEL,
      contents: prompt,
    };

    const response = await googleAiClient.models.generateContent(payload);

    return response.text || '';
  }
};
