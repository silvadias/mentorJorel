export interface ITransmissionRequest {
  url: string;
  apiKey: string;
  payload?: Record<string, any>; // Tornou-se opcional, pois requisições GET geralmente não possuem body
  method?: 'POST' | 'GET' | 'PUT' | 'DELETE'; // Flexibilidade total para o futuro
  headers?: Record<string, string>;
}

export class PayloadTransmitter {
  /**
   * Responsabilidade Única: Receber parâmetros brutos, 
   * efetuar o fetch físico de rede e devolver a resposta textual pura.
   */
  public static async transmit(request: ITransmissionRequest): Promise<string> {
    // Define o método injetado ou adota 'POST' como padrão caso omitido
    const httpMethod = request.method || 'POST';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...request.headers
    };

    if (request.apiKey && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${request.apiKey}`;
    }

    // Configura as opções do fetch dinamicamente
    const fetchOptions: RequestInit = {
      method: httpMethod,
      headers
    };

    // Só adiciona o body se o método aceitar carga útil e o payload tiver sido injetado
    if (httpMethod !== 'GET' && request.payload) {
      fetchOptions.body = JSON.stringify(request.payload);
    }

    const response = await fetch(request.url, fetchOptions);
    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(responseText || `HTTP_ERROR_${response.status}`);
    }

    return responseText;
  }
}