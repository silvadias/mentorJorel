import type { Request, Response } from 'express';
import { GeminiJsonBuilder } from '../../services/gemini/jsonBuilder';
import { geminiGateway } from '../../services/gemini/gateway';
import { catchAsync } from '../../utils/catchAsync';

export class TestController {
  /**
   * Executa um disparo direto para a API do Gemini para validar a infraestrutura de IA.
   */
  public static runConnectionTest = catchAsync(async (_req: Request, res: Response) => {
    // 1. Instancia o orquestrador de JSON
    const builder = new GeminiJsonBuilder();

    // 2. Injeta parâmetros e valores de teste simples
    builder.setSystemInstruction(
      'Você é o Mentor Jorel, um treinador de IA focado em alta performance. Responda de forma curta e profissional.'
    );
    builder.setTemperature(0.5);
    builder.appendUserMessage('Estou iniciando o projeto hoje. Me dê uma frase de motivação técnica.');

    // 3. Monta o payload estruturado
    const finalPayload = builder.build();

    // 4. Envia para o Gateway conectar e despachar pela rede
    const aiResponse = await geminiGateway.requestContentGeneration(finalPayload);

    // 5. Retorna o resultado limpo para validar o sucesso do teste
    return res.status(200).json({
      success: true,
      message: 'Comunicação com o Google Gemini realizada com sucesso!',
      aiResponse: aiResponse
    });
  });
}
