import { DomainException } from '../../../api/errors/domainException';

/**
 * Contrato estruturado para definição de barreiras operacionais de tráfego.
 * Define o identificador de rastreio e o teto máximo aceito no ciclo ativo.
 */
export interface ThrottlerBarrierInput {
  readonly trackingKey : string;
  readonly maxAllowed  : number;
}

/**
 * Estrutura de dados efêmera para governança cronológica de cotas por ciclo de tempo.
 * Armazena a contagem atômica de acessos e o momento exato em que o ciclo expira.
 */
interface PeriodicTrafficCounter {
  count               : number;
  chronologicalResetAt: number;
}

/**
 * @class RequestThrottler
 * @description Motor atômico de alta performance para segurança perimetral (Rate Limiting).
 * Opera em nível de memória RAM local (peso computacional zero), agindo de forma totalmente
 * agnóstica a planos comerciais, modelos de faturamento ou regras de negócio.
 */
export class RequestThrottler {
  private readonly cycleDurationMilliseconds: number;
  private readonly ramTrafficRegistry        : Map<string, PeriodicTrafficCounter>;

  /**
   * @constructor
   * @param cycleDurationSeconds Tempo de validade de cada ciclo de contagem (Padrão: 60 segundos).
   */
  constructor(cycleDurationSeconds = 60) {
    this.cycleDurationMilliseconds = cycleDurationSeconds * 1000;
    this.ramTrafficRegistry        = new Map<string, PeriodicTrafficCounter>();
  }

  /**
   * Intercepta a requisição e avalia a chave de rastreio contra a cota configurada.
   * Totalmente polimórfico, tratando de forma idêntica IPs, Chaves de Tenants ou Usuários Finais.
   * 
   * @param barrier Estrutura contendo o identificador de rastreio e a cota dinâmica.
   * @throws {DomainException} Lança 'REQUEST_THROTTLED' se o teto for violado no ciclo vigente.
   */
  public async throttle(barrier: ThrottlerBarrierInput): Promise<void> {
    const { trackingKey, maxAllowed } = barrier;
    const currentTimestamp = Date.now();

    // Recupera o registro de tráfego periódico associado à chave de rastreio na RAM
    const activePeriodRecord = this.ramTrafficRegistry.get(trackingKey);

    // CENÁRIO 1: Se a chave for inédita ou o ciclo cronológico anterior expirou, inicia uma nova época
    if (!activePeriodRecord || currentTimestamp > activePeriodRecord.chronologicalResetAt) {
      this.ramTrafficRegistry.set(trackingKey, {
        count               : 1,
        chronologicalResetAt: currentTimestamp + this.cycleDurationMilliseconds
      });
      return;
    }

    // CENÁRIO 2: Se o contador ativo na RAM violar ou igualar o limite estipulado dinamicamente
    if (activePeriodRecord.count >= maxAllowed) {
      throw new DomainException('REQUEST_THROTTLED');
    }

    // CENÁRIO 3: Tráfego legítimo sob a cota permitida. Incrementa o contador na RAM.
    activePeriodRecord.count++;
  }

  /**
   * Varre a memória RAM local eliminando registros cujos ciclos cronológicos já expiraram.
   * Evita o vazamento de memória (Memory Leak) mantendo o mapa limpo de forma preemptiva.
   */
  public evictExpiredRecords(): void {
    const currentTimestamp = Date.now();
    
    for (const [trackingKey, record] of this.ramTrafficRegistry.entries()) {
      if (currentTimestamp > record.chronologicalResetAt) {
        this.ramTrafficRegistry.delete(trackingKey);
      }
    }
  }
}
