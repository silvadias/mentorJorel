import type { ConsumerSpecificationEngine } from '../engine/specification';

export interface ConsumerFinderEngine {
  byKey(
    identificationKey: string
  ): Promise<ConsumerSpecificationEngine | null>;
}
