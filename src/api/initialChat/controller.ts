import type { Request, Response } from 'express';
import { GeminiGateway } from './providers/gemini/geminiGateway';

/**
 * InitialChatController
 * Responsabilidade Única: Tratar a entrada e saída da requisição HTTP.
 * Não possui conhecimento de regras de negócio complexas ou chaves de API.
 */
export const InitialChatController = {
  
  handle: async (req: Request, res: Response): Promise<Response> => {
    try {
      // 1. Extração e Validação Inicial dos Dados Brutos do Cliente
      const { prompt } = req.body;

      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ 
          error: 'O campo "prompt" é obrigatório e deve ser uma string de texto.' 
        });
      }

      // 2. Encapsulamento cego e delegação direta para o Gateway
      // O Controller consome a ação através da assinatura de contrato válida
      const generatedText = await GeminiGateway.generateText({ prompt });

      // 3. Resposta HTTP de Sucesso com o JSON esperado pelo cliente
      return res.status(200).json({ 
        response: generatedText 
      });

    } catch (error: any) {
      // 4. Tratamento isolado de exceções sem expor dados críticos de infraestrutura
      return res.status(500).json({ 
        error: 'Falha interna ao processar a requisição do chat.',
        details: error.message 
      });
    }
  }
};
