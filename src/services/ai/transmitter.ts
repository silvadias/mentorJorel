export interface TransmissionExecutionPayload {
  executeTransmission: () => Promise<string>;
}

export class PayloadTransmitter {
  /**
   * Responsabilidade Única: Receber uma ação de transmissão envelopada por injeção,
   * executar o comando físico isolado e retornar a resposta textual pura.
   * Não possui conhecimento sobre URLs, payloads ou marcas de inteligência artificial.
   */
  public static async transmit(executionPayload: TransmissionExecutionPayload): Promise<string> {
    return await executionPayload.executeTransmission();
  }
}
