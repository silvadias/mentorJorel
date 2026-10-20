import      { Env }                           from './config/env';
import      { ExpressHttpDriver }             from './infrastructure/httpTraffic/drivers/expressHttpDriver';
import      { ApplicationFailureFormatter }   from './infrastructure/httpTraffic/engine/failureFormatter';
import      { SystemConsoleJsonDriver }       from './infrastructure/telemetry/drivers/systemConsoleJsonDriver';
import      { ExpressJwtAdapter }             from './infrastructure/security/token/drivers/expressJwtAdapter';
import      { ConsumerCacheStore }            from './infrastructure/security/apiKeyTenant/adapter/ramCache';
import      { DataBaseConsumerFinder }        from './infrastructure/security/apiKeyTenant/adapter/databaseRepository';
import      { ConsumerAccessValidator }       from './infrastructure/security/apiKeyTenant/adapter/accessValidator';
import      { RequestThrottler }              from './infrastructure/security/throttler/requestThrottler';
import      { ServerLifecycleGovernor }       from './infrastructure/lifeCycle/serverLifecycleGovernor';
import      { configureApiRoutes }            from './apiRouter';
import type { HttpTrafficExchangeEngine }     from './infrastructure/httpTraffic/engine/httpTraffic';
import type { SystemLogger }                  from './infrastructure/telemetry/engine/systemLogger';

const systemTelemetryLogger: SystemLogger = new SystemConsoleJsonDriver(
  undefined, 
  undefined, 
  Env.nodeEnv === 'development'
);

const coreFailureFormatter    = new ApplicationFailureFormatter();
const securityTokenEngine     = new ExpressJwtAdapter({ secretKey: 'CHAVE_SUPER_SECRETA_BOILERPLATE', expirationSeconds: 3600 });
const ramCacheStore           = new ConsumerCacheStore();
const databaseRepository      = new DataBaseConsumerFinder();
const consumerAccessEngine    = new ConsumerAccessValidator(databaseRepository, ramCacheStore, 300);
const requestLimitThrottler   = new RequestThrottler(60); 
const systemLifecycleZelador  = new ServerLifecycleGovernor(systemTelemetryLogger, 20);

const serverEngine: HttpTrafficExchangeEngine = new ExpressHttpDriver({ 
  port                : Env.port,
  failureFormatter    : coreFailureFormatter,
  systemLogger        : systemTelemetryLogger,
  tokenEngine         : securityTokenEngine,
  consumerEngine      : consumerAccessEngine,
  throttlerEngine     : requestLimitThrottler,
  lifecycleGovernor   : systemLifecycleZelador,
  displayDebugDetails : Env.nodeEnv === 'development'
});

systemTelemetryLogger.info(`Bootstrapping application core engine under environment: [${Env.nodeEnv}]`);

configureApiRoutes(serverEngine);

serverEngine.start();
