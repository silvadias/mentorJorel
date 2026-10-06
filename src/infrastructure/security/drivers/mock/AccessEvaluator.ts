import type { AccessEvaluator,
              AccessRequestMetadata,
              AccessDecisionResponse } from '../../engine/accessEvaluator';
import type { SystemLogger }           from '../../../telemetry/engine/context';

export class MockAccessEvaluator implements AccessEvaluator {
  private readonly telemetryLogger: SystemLogger;

  constructor(telemetryLogger: SystemLogger) {
    this.telemetryLogger = telemetryLogger;
  }

  public async canAccess(metadata: AccessRequestMetadata): Promise<AccessDecisionResponse> {
    this.telemetryLogger.info(`Security boundary evaluation triggered for Actor ID: [${metadata.actorId}] on resource: [${metadata.resourcePath}]`, {
      securityScope  : 'ACCESS_EVALUATION',
      evaluatedActor : metadata.actorId,
      resourceTarget : metadata.resourcePath
    });

    if (metadata.actorId === 'actor_blocked_by_director') {
      return {
        isAvailable : false,
        disabledBy  : 'Diretor',
        reason      : 'Este recurso operacional foi suspenso temporariamente pela gerência administrativa da Empresa.'
      };
    }

    return {
      isAvailable : true
    };
  }
}
