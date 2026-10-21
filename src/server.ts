import      { Env }                           from './config/env';
import      { ExpressHttpDriver }             from './infrastructure/httpTraffic/drivers/expressHttpDriver';
import      { ApplicationFailureFormatter }   from './infrastructure/httpTraffic/adapters/failureFormatter';
import      { SystemConsoleJsonDriver }       from './infrastructure/telemetry/drivers/systemConsoleJsonDriver';
import      { ExpressJwtAdapter }             from './infrastructure/security/token/drivers/expressJwtAdapter';
import      { ConsumerCacheStore }            from './infrastructure/security/apiKeyTenant/adapter/ramCache';
import      { DataBaseConsumerFinder }        from './infrastructure/security/apiKeyTenant/adapter/databaseRepository';
import      { ConsumerAccessValidator }       from './infrastructure/security/apiKeyTenant/adapter/accessValidator';
import      { RequestThrottler }              from './infrastructure/security/throttler/requestThrottler';
import      { ServerLifecycleGovernor }       from './infrastructure/lifeCycle/serverLifecycleGovernor';
import      { configureApiRoutes }            from './apiRouter';
import type { HttpTrafficExchangeEngine,
              HttpNetworkSecurityPolicy }     from './infrastructure/httpTraffic/engine/httpTraffic';
import type { SystemLogger }                  from './infrastructure/telemetry/engine/systemLogger';

const systemTelemetryLogger: SystemLogger = new SystemConsoleJsonDriver(
  undefined, 
  undefined, 
  Env.nodeEnv === 'development'
);

const coreFailureFormatter    = new ApplicationFailureFormatter();

const securityTokenEngine     = new ExpressJwtAdapter({ 
  secretKey: Env.jwtSecret, 
  expirationSeconds: Env.jwtExpirationSec 
});

const ramCacheStore           = new ConsumerCacheStore();
const databaseRepository      = new DataBaseConsumerFinder();
const consumerAccessEngine    = new ConsumerAccessValidator(databaseRepository, ramCacheStore, 300);
const requestLimitThrottler   = new RequestThrottler(60); 
const lifecycleGovernor       = new ServerLifecycleGovernor(systemTelemetryLogger, 20);

// 🏢 CONFIGURAÇÃO COMPORTAMENTAL AGNÓSTICA: Diretrizes corporativas de segurança web de uso geral
const globalNetworkSecurityPolicy: HttpNetworkSecurityPolicy = {
  allowedOrigins:            ['*'], // Aberto para permitir requisições de qualquer frontend Multi-Tenant parceiro
  allowedMethods:            ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders:            ['Content-Type', 'Authorization', 'X-API-Key', 'X-Session-Token'],
  exposedHeaders:            ['X-Session-Token', 'X-Trace-Id'],
  isFrameworkSignatureHidden: true,
  perimeterDefenses: {
    'X-Frame-Options':       'SAMEORIGIN',  // Mitigação contra Clickjacking
    'X-Content-Type-Options':'nosniff',     // Bloqueia farejamento hacker de MIME-types
    'X-XSS-Protection':      '0',           // Desativa filtros legados inseguros de browsers
    'X-Download-Options':    'noopen'       // Protege contra injeção de arquivos HTML maliciosos
  }
};

const serverEngine: HttpTrafficExchangeEngine = new ExpressHttpDriver({ 
  port                : Env.port,
  failureFormatter    : coreFailureFormatter,
  systemLogger        : systemTelemetryLogger,
  tokenEngine         : securityTokenEngine,
  consumerEngine      : consumerAccessEngine,
  throttlerEngine     : requestLimitThrottler,
  lifecycleGovernor   : lifecycleGovernor,
  networkPolicy       : globalNetworkSecurityPolicy, // 🔌 Acoplamento Plug-in Puro
  displayDebugDetails : Env.nodeEnv === 'development'
});

systemTelemetryLogger.info(`Bootstrapping application core engine under environment: [${Env.nodeEnv}]`);

configureApiRoutes(serverEngine);

serverEngine.start();
