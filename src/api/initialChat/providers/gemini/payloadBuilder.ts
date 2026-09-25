import { env } from '../../../../config/env';

export interface IGeminiMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export interface IGeminiJsonPayload {
  contents: IGeminiMessage[];
  systemInstruction?: string;
  generationConfig?: {
    temperature?: number;
  };
}

export interface IGeminiConnectionPackage {
  url: string;
  apiKey: string;
  payload: IGeminiJsonPayload;
}

export class GeminiPayloadBuilder {
  // Lista ordenada de versões oficiais da Google que funcionam sem erros
  private static readonly versions = [
    'gemini-3.8-flash',
    'gemini-3.5-flash-lite',
    'gemini-2.5-pro'
  ] as const;

  /**
   * Retorna a quantidade total de versões configuradas para o controle de tentativas.
   */
  public static getVersionsCount(): number {
    return this.versions.length;
  }

  /**
   * Recebe as variáveis controláveis dinâmicas e monta o pacote estruturado para o transmissor.
   */
  public static mountStructure(
    versionIndex: number,
    prompt: string,
    systemInstruction: string,
    temperature: number
  ): IGeminiConnectionPackage {
    // Garante que o ponteiro use uma versão válida da lista ou adota o padrão Flash atual
    const selectedVersion = this.versions[versionIndex] || 'gemini-3.8-flash';

    // Monta o endereço exato injetando a string da versão de forma limpa
    const apiUrl = `https://googleapis.com{selectedVersion}:generateContent`;

    // Organiza os dados dinâmicos no formato exato que a API da Google exige
    const payload: IGeminiJsonPayload = {
      contents: [
        { role: 'user', parts: [{ text: prompt }] }
      ],
      systemInstruction,
      generationConfig: {
        temperature
      }
    };

    return {
      url: apiUrl,
      apiKey: env.GEMINI_API_KEY,
      payload
    };
  }
}