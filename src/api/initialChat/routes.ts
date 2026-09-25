import { Router } from 'express';
import { InitialChatController } from './controller';

export const InitialChatRoutes = Router();

// Nome expressivo que revela a intenção de rede do protocolo HTTP
const http = InitialChatRoutes;

/**
 * Endpoint de Handshake da Fase 1 (Entrada sem Atrito).
 * Aciona o loop de resiliência e responde com a saudação inicial do Mentor.
 */
http.post('/', InitialChatController.startMentorConversation);
