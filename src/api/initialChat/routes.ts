import { Router } from 'express';
import { InitialChatController } from './controller';

export const InitialChatRoutes = Router();

const http = InitialChatRoutes;

/**
 * Endpoint de Handshake da Fase 1 (Entrada sem Atrito).
 * Dispara a transmissão inicial de teste com o provedor de IA.
 */
http.post('/', InitialChatController.handle);
