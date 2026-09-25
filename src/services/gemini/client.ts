import { GoogleGenAI } from '@google/genai';
import { env } from '../../config/env';

if (!env.GEMINI_API_KEY) {
  console.warn(' Alerta: GEMINI_API_KEY não configurada no ambiente (.env).');
}

export const googleAiClient = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

// Atualizado de gemini-2.5-flash para o modelo oficial estável atual
export const DEFAULT_AI_MODEL = 'gemini-3.8-flash';
