import { DomainException } from '../../../api/errors/domainException';

/** Contrato estrutural de entrada para os payloads de rastreamento perimetral. */
export interface ThrottlerBarrierInput {
  readonly trackingKey : string;
  readonly maxAllowed  : number;
}

/** Envelope temporal efêmero que armazena a volumetria de cliques por janela. */
interface PeriodicTrafficCounter {
  count               : number;
  chronologicalResetAt: number;
}

/**
 * @class RequestThrottler
 * @description Regulador Dinâmico de Cliques e Limitador de Vazão de Borda.
 * Opera de forma agnóstica na memória RAM local (peso computacional zero de hardware),
 * bloqueando loops e abusos de requisições de acordo com limites de plano Multi-Tenant.
 */
export class RequestThrottler {
  private readonly cycleDurationMilliseconds  : number;
  private readonly ramTrafficRegistry         : Map<string, PeriodicTrafficCounter>;

  constructor(cycleDurationSeconds = 60) {
    this.cycleDurationMilliseconds = cycleDurationSeconds * 1000;
    this.ramTrafficRegistry        = new Map<string, PeriodicTrafficCounter>();
  }

  /**
   * @description Barreira atômica de verificação de cota.
   * Avalia a janela deslizante da chave e incrementa o contador local ou lança um erro 429.
   */
  public async throttle(barrier: ThrottlerBarrierInput): Promise<void> {
    const { trackingKey, maxAllowed } = barrier;
    const currentTimestamp            = Date.now();
    const activePeriodRecord          = this.ramTrafficRegistry.get(trackingKey);

    // Se a entrada for inexistente ou a sinaleira do relógio estourar a janela de cooldown ativa
    if (!activePeriodRecord || 
        currentTimestamp > activePeriodRecord.chronologicalResetAt
      ) {
        this.ramTrafficRegistry.set(trackingKey, {
          count               : 1,
          chronologicalResetAt: currentTimestamp + this.cycleDurationMilliseconds
      });

      return;
    }

    // Se o contador atômico violar o limite máximo permitido pelo plano do Tenant
    if (activePeriodRecord.count >= maxAllowed) {
      throw new DomainException('REQUEST_THROTTLED');
    }

    activePeriodRecord.count++;
  }

  /** Limpa de forma preventiva chaves e registros obsoletos para liberar alocação de hardware. */
  public evictExpiredRecords(): void {
    const currentTimestamp = Date.now();
    
    for (const [trackingKey, record] of this.ramTrafficRegistry.entries()) {
      if (currentTimestamp > record.chronologicalResetAt) {
        this.ramTrafficRegistry.delete(trackingKey);
      }
    }
  }
}
