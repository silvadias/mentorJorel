// Interface que espelha exatamente a estrutura de histórico exigida pelo SDK
export interface IGeminiMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

// Interface que encapsula as configurações avançadas de comportamento da IA
export interface IGenerationConfig {
  temperature?: number;
  responseMimeType?: 'text/plain' | 'application/json';
  responseSchema?: Record<string, any>;
}

// Interface que define o contrato do Payload completo que o Gateway enviará para a rede
export interface IGeminiPayload {
  contents: IGeminiMessage[];
  systemInstruction?: string;
  generationConfig?: IGenerationConfig;
}

export class GeminiJsonBuilder {
  private messages: IGeminiMessage[] = [];
  private systemInstructionText: string | undefined = undefined;
  
  // Parâmetros de configuração com seus estados iniciais indefinidos
  private temperatureValue: number | undefined = undefined;
  private mimeTypeValue: 'text/plain' | 'application/json' | undefined = undefined;
  private schemaValue: Record<string, any> | undefined = undefined;

  /**
   * Define a instrução do sistema (Persona do Mentor, regras de negócio e travas de foco).
   */
  public setSystemInstruction(instruction: string): void {
    this.systemInstructionText = instruction;
  }

  /**
   * Define o nível de criatividade/precisão da IA (Geralmente entre 0.0 e 1.0).
   */
  public setTemperature(temp: number): void {
    this.temperatureValue = temp;
  }

  /**
   * Força a IA a responder em Texto Puro ou JSON Estruturado.
   */
  public setResponseMimeType(mimeType: 'text/plain' | 'application/json'): void {
    this.mimeTypeValue = mimeType;
  }

  /**
   * Define o contrato/molde de chaves obrigatórias quando o retorno for em JSON.
   */
  public setResponseSchema(schema: Record<string, any>): void {
    this.schemaValue = schema;
  }

  /**
   * Adiciona a mensagem do aluno e seu respectivo valor na estrutura de memória.
   */
  public appendUserMessage(text: string): void {
    this.messages.push({
      role: 'user',
      parts: [{ text }],
    });
  }

  /**
   * Adiciona a resposta da IA e seu respectivo valor na estrutura de memória.
   */
  public appendModelMessage(text: string): void {
    this.messages.push({
      role: 'model',
      parts: [{ text }],
    });
  }

  /**
   * Limpa absolutamente todos os parâmetros e a memória do construtor.
   */
  public clear(): void {
    this.messages = [];
    this.systemInstructionText = undefined;
    this.temperatureValue = undefined;
    this.mimeTypeValue = undefined;
    this.schemaValue = undefined;
  }

  /**
   * Orquestra, monta e entrega o JSON final com todos os parâmetros configurados para o Gateway.
   */
  public build(): IGeminiPayload {
    // Monta o sub-objeto de configuração apenas se algum parâmetro foi definido
    const hasConfig = this.temperatureValue !== undefined || this.mimeTypeValue !== undefined || this.schemaValue !== undefined;
    
    const generationConfig: IGenerationConfig = {
      ...(this.temperatureValue !== undefined && { temperature: this.temperatureValue }),
      ...(this.mimeTypeValue !== undefined && { responseMimeType: this.mimeTypeValue }),
      ...(this.schemaValue !== undefined && { responseSchema: this.schemaValue }),
    };

    return {
      contents: [...this.messages],
      ...(this.systemInstructionText && { systemInstruction: this.systemInstructionText }),
      ...(hasConfig && { generationConfig }),
    };
  }
}
