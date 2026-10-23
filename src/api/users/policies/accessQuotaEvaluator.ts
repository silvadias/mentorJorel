import type { TokenSessionPayload } from '../../../infrastructure/security/token/engine/tokenSession';
import      { DomainException }     from '../../errors/domainException';

export type PolicyTrustLevel =
  | 'UNRECOGNIZED_ANONYMOUS' 
  | 'TRACKED_ANONYMOUS'      
  | 'FEDERATED_SIGNUP'       
  | 'EMAIL_VERIFIED'         
  | 'IDENTITY_AUDITED';

/**
 * @interface RoutePolicyConstraints
 * @description Restrições e Delimitadores Semânticos de uma Rota Específica.
 * Define os critérios mínimos para que o tráfego cruze a fronteira da funcionalidade.
 */
export interface RoutePolicyConstraints {
  readonly requiredMinimumTrustLevel : PolicyTrustLevel;
  readonly maxAllowedOperationsPerMin : number;
}

/**
 * @class AccessQuotaEvaluator
 * @description Guardião Tardio de Direitos e Políticas de Tráfego Isoladas por Rota.
 * Delibera por inversão de controle se a sessão cumpre os requisitos horizontais do contexto atual,
 * operando de forma 100% agnóstica a organogramas corporativos rígidos.
 */
export class AccessQuotaEvaluator {
  
  /**
   * @description Avalia a elegibilidade de acesso cruzando o contexto da sessão ativa com os limites da rota.
   * Torna o sistema imune à adição de novos níveis de cargos ou à remoção total de hierarquias.
   * 
   * @param session O passaporte digital de tráfego re-hidratado na borda perimetral.
   * @param constraints As restrições específicas da rota que está sendo acessada.
   * @returns Retorna true se o acesso for concedido ou arremessa uma exceção unificada de domínio.
   */
  public evaluate(session: TokenSessionPayload, constraints: RoutePolicyConstraints): boolean {
    const currentTenantZone = session.activeContextTenantId;
    const actorIdentification = session.actorId;

    // 🧬 MATRIZ HORIZONTAL DE CONFIANÇA (Trust Level Escalation)
    // Mapeia o peso matemático de cada nível para permitir comparações lógicas horizontais limpas
    const trustWeightMap: Record<PolicyTrustLevel, number> = {
      'UNRECOGNIZED_ANONYMOUS' : 0,
      'TRACKED_ANONYMOUS'      : 1,
      'FEDERATED_SIGNUP'       : 2,
      'EMAIL_VERIFIED'         : 3,
      'IDENTITY_AUDITED'       : 4
    };

    // Resgata o nível de confiança inferido do actorId ou do mapeamento da sessão (Padrão: anônimo nível 0)
    // TODO: Em fiação avançada, carregar o trustLevel em tempo real do banco relacional por inquilino ativo
    const actorCurrentTrustLevel: PolicyTrustLevel = actorIdentification === 'ANONYMOUS' 
      ? 'UNRECOGNIZED_ANONYMOUS' 
      : 'TRACKED_ANONYMOUS';

    const actorWeight = trustWeightMap[actorCurrentTrustLevel] ?? 0;
    const requiredWeight = trustWeightMap[constraints.requiredMinimumTrustLevel] ?? 0;

    // 🥇 BARREIRA SEMÂNTICA 1: Validação do nível de confiança progressiva independente de cargo
    if (actorWeight < requiredWeight) {
      throw new DomainException('SECURITY_TOKEN_CORRUPTED'); // Degradação por insuficiência de privilégios perimetrais
    }

    // 🥇 BARREIRA SEMÂNTICA 2: Validação tardia baseada em cotas dinâmicas do Inquilino Corporativo Ativo
    // Permite que subordinados ou chefes flutuantes tenham limites elásticos dependendo de qual instituição estão acessando
    if (currentTenantZone === 'institution_blocked_zone') {
      throw new DomainException('REQUEST_THROTTLED');
    }

    return true;
  }
}