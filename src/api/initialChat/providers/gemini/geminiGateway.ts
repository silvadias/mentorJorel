
import { GoogleGenAI } from '@google/genai';
import type { InitialChatProvider, ChatGenerationInput } from '../initialChatProvider';

// Inicializa a API utilizando a variável global injetada no ambiente Node
const googleAI = new GoogleGenAI();

/**
 * Contratos de Dados (Interfaces) do Gateway
 */
export interface AgentOptions { config: any }
export interface AuthTokenOptions { credentials: any }
export interface BatchOptions { batchData: any }
export interface CacheOptions { cacheConfig: any }
export interface ChatOptions { chatHistory: any }
export interface CredentialOptions { authConfig: any }
export interface EnvironmentOptions { envName: string }
export interface FileSearchOptions { storeConfig: any }
export interface FileOptions { fileData: any }
export interface InteractionOptions { interactionId: string }
export interface LiveOptions { sessionConfig: any }
export interface ModelOptions { prompt: string; modelName?: string }
export interface OperationOptions { operationId: any }
export interface TriggerOptions { triggerData: any }
export interface TuningOptions { tuningConfig: any }
export interface VertexOptions { payload: any }
export interface VoiceOptions { voiceId: string }
export interface WebhookOptions { webhookConfig: any }

/**
 * GeminiGateway
 * Centraliza e encapsula as assinaturas nativas exatas do SDK oficial.
 * Responsabilidade Única (SRP): Ponto de contato isolado com o ecossistema do Google.
 * Assegura compatibilidade com a interface InitialChatProvider para o domínio.
 */
export const GeminiGateway = {
  
  generateText: async (input: ChatGenerationInput): Promise<string> => {
    const response = await googleAI.models.generateContent({
      model: input.modelOverride || 'gemini-3.7-flash',
      contents: input.prompt,
    });
    return response.text || '';
  },

  dispatchAgent: async (options: AgentOptions) => 
    await googleAI.agents.create(options.config),
  
  generateAuthToken: async (options: AuthTokenOptions) => 
    await googleAI.authTokens.create(options.credentials),
  
  processBatch: async (options: BatchOptions) => 
    await googleAI.batches.create(options.batchData),
  
  configureCache: async (options: CacheOptions) => 
    await googleAI.caches.create(options.cacheConfig),
  
  initiateChat: async (options: ChatOptions) => 
    await googleAI.chats.create(options.chatHistory),
  
  updateCredentials: async (options: CredentialOptions) => 
    await googleAI.credentials.create(options.authConfig),
  
  fetchEnvironment: async (options: EnvironmentOptions) => 
    await googleAI.environments.get(options.envName),
  
  setupFileSearchStore: async (options: FileSearchOptions) => 
    await googleAI.fileSearchStores.create(options.storeConfig),
  
  uploadFile: async (options: FileOptions) => 
    await googleAI.files.upload(options.fileData),
  
  fetchInteraction: async (options: InteractionOptions) => 
    await googleAI.interactions.get(options.interactionId),
  
  connectLiveStream: async (options: LiveOptions) => 
    await googleAI.live.connect(options.sessionConfig),
  
  fetchOperation: async (options: OperationOptions) => 
    await googleAI.operations.get({ operation: options.operationId }),
  
  createTrigger: async (options: TriggerOptions) => 
    await googleAI.triggers.create(options.triggerData),
  
  tuneModel: async (options: TuningOptions) => 
    await googleAI.tunings.tune(options.tuningConfig),
  
  integrateVertexAI: async (options: VertexOptions) => 
    await googleAI.models.generateContent(options.payload),
  
  fetchVoiceProfile: async (options: VoiceOptions) => 
    await googleAI.voices.get(options.voiceId),
  
  setupWebhook: async (options: WebhookOptions) => 
    await googleAI.webhooks.create(options.webhookConfig)
} satisfies InitialChatProvider & Record<string, any>;
