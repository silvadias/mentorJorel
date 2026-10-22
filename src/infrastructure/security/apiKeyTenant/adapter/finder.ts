import type { ConsumerSpecificationEngine } from '../engine/specification';

/**
 * @interface ConsumerFinderEngine
 * @description Porta Hexagonal (Port) de Unificação de Busca de Credenciais.
 * Estabelece a assinatura formal que obriga adaptadores e repositórios a conversarem
 * em dialeto purificado de negócios, garantindo que o core permaneça fechado para mudança (OCP).
 */
export interface ConsumerFinderEngine {
  byKey(
    identificationKey: string
  ): Promise<ConsumerSpecificationEngine | null>;
}
