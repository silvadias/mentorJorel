import      { Env }                           from './config/env';
import      { ExpressHttpDriver }             from './infrastructure/httpTraffic/drivers/expressHttpDriver';
import      { ApplicationFailureFormatter }   from './infrastructure/httpTraffic/engine/failureFormatter';
import      { SystemConsoleJsonDriver }       from './infrastructure/telemetry/drivers/systemConsoleJsonDriver';
import      { ExpressJwtAdapter }             from './infrastructure/security/drivers/jwt/expressJwtAdapter';
import      { configureApiRoutes }            from './apiRouter';
import type { HttpTrafficExchangeEngine }     from './infrastructure/httpTraffic/engine/httpTraffic';
import type { SystemLogger }                  from './infrastructure/telemetry/engine/systemLogger';

const systemTelemetryLogger: SystemLogger = new SystemConsoleJsonDriver(
  undefined, 
  undefined, 
  Env.nodeEnv === 'development'
);
const coreFailureFormatter = new ApplicationFailureFormatter();

const securityTokenEngine = new ExpressJwtAdapter({ secretKey: 'CHAVE_SUPER_SECRETA_BOILERPLATE', expirationSeconds: 3600 });

const serverEngine: HttpTrafficExchangeEngine = new ExpressHttpDriver({ 
  port                : Env.port,
  failureFormatter    : coreFailureFormatter,
  systemLogger        : systemTelemetryLogger,
  tokenEngine         : securityTokenEngine,
  displayDebugDetails : Env.nodeEnv === 'development'

});

systemTelemetryLogger.info(`Bootstrapping application core engine under environment: [${Env.nodeEnv}]`);

configureApiRoutes(serverEngine);

serverEngine.start();
