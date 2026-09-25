import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { PayloadTransmitter } from '../../services/ai/transmitter';
import { GeminiPayloadBuilder } from './providers/gemini/payloadBuilder';

export class InitialChatController {
  private static readonly MAX_RETRIES_PER_VERSION = 3;
  private static readonly SHORT_WAIT_TIME_MS = 1000;
  
  // Estados de controle para o bloqueio de respiro de rede do servidor principal
  private static isPrimaryServerLocked = false;
  private static readonly PRIMARY_SERVER_COOLDOWN_MS = 60000; // 1 minuto de respiro

  /**
   * Inicializa o canal de conversação do Handshake da Fase 1 (Entrada sem Atrito).
   */
  public static startMentorConversation = catchAsync(async (request: Request, response: Response) => {
    // Coleta os parâmetros controláveis enviados pelo front-end ou adota os padrões estritos do SaaS
    const promptMessage = (request.body.text as string) || 'Olá! Quero iniciar minha preparação.';
    const systemInstruction = 'Você é o Mentor Jorel, um treinador de IA focado em alta performance. Gere uma saudação curta e impactante.';
    const temperatureSetting = Number(request.body.temperature) || 0.3;

    const totalAvailableVersions = GeminiPayloadBuilder.getVersionsCount();
    
    let currentVersionIndex = 0;
    let currentAttempt = 1;

    // Se o servidor principal (Índice 0) estiver travado sob respiro, o controlador chaveia automaticamente para a contingência
    if (InitialChatController.isPrimaryServerLocked) {
      console.log('⏳ [Chat Controller] Servidor principal em respiro. Redirecionando para a contingência.');
      currentVersionIndex = 1;
    }

    // Máquina de estados cíclica de tentativas e chaveamento
    while (currentVersionIndex < totalAvailableVersions) {
      try {
        // 1. O controlador solicita o pacote de estrutura configurado para a versão da vez
        const connectionPackage = GeminiPayloadBuilder.mountStructure(
          currentVersionIndex,
          promptMessage,
          systemInstruction,
          temperatureSetting
        );

        // 2. Aciona o transmissor passivo de infraestrutura de rede
        const rawResponseText = await PayloadTransmitter.transmit({
          url: connectionPackage.url,
          apiKey: connectionPackage.apiKey,
          payload: connectionPackage.payload
        });

        // 3. Traduz o JSON bruto recebido da Google para extrair o texto limpo
        const parsedData = JSON.parse(rawResponseText);
        const mentorSpeechText = parsedData.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Resposta bem-sucedida finaliza o ciclo e entrega o resultado para o aluno
        return response.status(200).json({
          success: true,
          data: {
            text: mentorSpeechText
          }
        });

      } catch (error: any) {
        console.warn(
          `⚠️ [Tentativa ${currentAttempt}/${InitialChatController.MAX_RETRIES_PER_VERSION}] Falhou na versão índice [${currentVersionIndex}]. Erro: ${error.message}`
        );

        // Se ainda não esgotou as 3 tentativas na versão atual, tenta novamente após o curto intervalo
        if (currentAttempt < InitialChatController.MAX_RETRIES_PER_VERSION) {
          currentAttempt++;
          await InitialChatController.sleep(InitialChatController.SHORT_WAIT_TIME_MS);
          continue;
        }

        // Se esgotou as 3 tentativas no servidor principal (Índice 0), ativa a trava de respiro e chaveia
        if (currentVersionIndex === 0) {
          console.log('🚨 Servidor principal esgotado. Ativando trava de respiro e chaveando para contingência...');
          InitialChatController.activatePrimaryServerCooldown();
          currentVersionIndex++;
          currentAttempt = 1;
          await InitialChatController.sleep(InitialChatController.SHORT_WAIT_TIME_MS);
          continue;
        }

        // Se falhou em todas as tentativas da contingência também, quebra o laço
        break;
      }
    }

    // [Apocalipse de Rede] Se o código atingir este ponto, emite a mensagem humana e polida de recuo
    return response.status(503).json({
      success: false,
      message: 'Olá! No momento, o Mentor Jorel está recebendo uma quantidade massiva de alunos simultâneos. Por favor, aguarde de 1 a 2 minutos e envie sua mensagem novamente para entrarmos na arena de estudos. Obrigado pela paciência!'
    });
  });

  /**
   * Ativa temporariamente o bloqueio do servidor principal e agenda o retorno automático.
   */
  private static activatePrimaryServerCooldown(): void {
    InitialChatController.isPrimaryServerLocked = true;

    setTimeout(() => {
      InitialChatController.isPrimaryServerLocked = false;
      console.log('🔄 [Chat Controller] Tempo de respiro finalizado. Servidor principal reativado para a fila de prioridade.');
    }, InitialChatController.PRIMARY_SERVER_COOLDOWN_MS);
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
