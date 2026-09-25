import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { PayloadTransmitter } from '../../services/ai/transmitter';
import { GeminiPayloadBuilder } from '../initialChat/providers/gemini/payloadBuilder';

export class TestController {
  /**
   * Executa um teste de fumaça para validar a nova arquitetura com PayloadTransmitter e GeminiPayloadBuilder.
   */
  public static runConnectionTest = catchAsync(async (_req: Request, res: Response) => {
    const promptMessage = 'Estou testando o novo PayloadTransmitter. Me dê uma resposta curta de confirmação.';
    const systemInstruction = 'Você é um validador de sistemas. Responda apenas com a palavra: CONFIRMADO.';
    const temperatureSetting = 0.3;

    let currentVersionIndex = 0;
    const totalAvailableVersions = GeminiPayloadBuilder.getVersionsCount();

    // Loop simplificado de teste simulando a máquina de estados
    while (currentVersionIndex < totalAvailableVersions) {
      try {
        // 1. Solicita a montagem do pacote de estrutura para o builder do Gemini
        const connectionPackage = GeminiPayloadBuilder.mountStructure(
          currentVersionIndex,
          promptMessage,
          systemInstruction,
          temperatureSetting
        );

        // 2. Dispara através do transmissor passivo de infraestrutura HTTP
        const rawResponseText = await PayloadTransmitter.transmit({
          url: connectionPackage.url,
          apiKey: connectionPackage.apiKey,
          payload: connectionPackage.payload
        });

        // 3. Destrincha o JSON retornado pela API do Google
        const parsedData = JSON.parse(rawResponseText);
        const aiResponseText = parsedData.candidates?.[0]?.content?.parts?.[0]?.text || '';

        return res.status(200).json({
          success: true,
          message: 'Novo motor de IA validado com sucesso!',
          currentVersionIndex,
          aiResponse: aiResponseText.trim()
        });

      } catch (error: any) {
        console.warn(`⚠️ [Smoke Test] Falhou no índice [${currentVersionIndex}]. Mudando de versão...`);
        currentVersionIndex++;
      }
    }

    return res.status(503).json({
      success: false,
      message: 'Falha crítica: Todas as versões falharam no teste de fumaça.'
    });
  });
}
