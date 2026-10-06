import      { Env }                           from './config/env';
import      { ExpressHttpDriver }             from './infrastructure/httpTraffic/drivers/expressHttpDriver';
import      { ApplicationFailureFormatter }   from './infrastructure/httpTraffic/engine/failureFormatter';
import      { SystemConsoleJsonDriver }       from './infrastructure/telemetry/drivers/systemConsoleJsonDriver';
import      { ExpressJwtAdapter }             from './infrastructure/security/drivers/jwt/expressJwtAdapter';
import      { MockAccessEvaluator }           from './infrastructure/security/drivers/mock/AccessEvaluator';
import      { JwtGuard }                      from './infrastructure/security/engine/jwtGuard';
import      { configureApiRoutes }            from './apiRouter';
import type { HttpTrafficExchangeEngine }     from './infrastructure/httpTraffic/engine/context';
import type { SystemLogger }                  from './infrastructure/telemetry/engine/context';

const systemTelemetryLogger: SystemLogger = new SystemConsoleJsonDriver(
  undefined, 
  undefined, 
  Env.nodeEnv === 'development'
);
const coreFailureFormatter = new ApplicationFailureFormatter();

const serverEngine: HttpTrafficExchangeEngine = new ExpressHttpDriver({ 
  port: Env.port,
  failureFormatter: coreFailureFormatter,
  systemLogger: systemTelemetryLogger,
  displayDebugDetails: Env.nodeEnv === 'development'

});

// COMPOSIÇÃO DE SEGURANÇA: Instancia os drivers periféricos e injeta na Barreira do Porteiro
const securityTokenEngine   = new ExpressJwtAdapter({ secretKey: 'CHAVE_SUPER_SECRETA_BOILERPLATE', expirationSeconds: 3600 });
const securityAccessChecker = new MockAccessEvaluator(systemTelemetryLogger);
const globalJwtGuard        = new JwtGuard(securityTokenEngine, securityAccessChecker);

systemTelemetryLogger.info(`Bootstrapping application core engine under environment: [${Env.nodeEnv}]`);

// ALINHAMENTO DE FIAÇÃO: Repassa o motor e o guarda de segurança pronto para o orquestrador de rotas
configureApiRoutes(serverEngine, globalJwtGuard);

serverEngine.start();
