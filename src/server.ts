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

// =========================================================================
//  COMPOSITION ROOT — FIAÇÃO E MONTAGEM DO ECOSSISTEMA PERIFÉRICO
// =========================================================================

/** Inicializa o motor de telemetria configurando modo visual humanizado exclusivamente para desenvolvimento. */
const systemTelemetryLogger: SystemLogger = new SystemConsoleJsonDriver(
  undefined, 
  undefined, 
  Env.nodeEnv === 'development'
);

/** Instancia o formatador responsável por traduzir falhas agnósticas de negócio em payloads de rede. */
const coreFailureFormatter    = new ApplicationFailureFormatter();

/** Acopla o motor criptográfico de gerenciamento e decodificação de assinaturas digitais (JWT). */
const securityTokenEngine     = new ExpressJwtAdapter({ 
  secretKey: Env.jwtSecret, 
  expirationSeconds: Env.jwtExpirationSec 
});

// Camada de dados efêmera e repositórios para validação Multi-Tenant de parceiros (API Keys)
const ramCacheStore                                           = new ConsumerCacheStore();
const databaseRepository                                      = new DataBaseConsumerFinder();
const consumerAccessEngine                                    = new ConsumerAccessValidator(databaseRepository, ramCacheStore, 300);

/** Inicializa o limitador atômico de vazão por janela fixa (Rate Limiter). */
const requestLimitThrottler                                   = new RequestThrottler(60); 

/** Inicializa o governador central de monitoramento e drenagem de conexões (Graceful Shutdown). */
const lifecycleGovernor                                       = new ServerLifecycleGovernor(systemTelemetryLogger, 20);

/** Definição estrita das apólices globais de segurança de tráfego de rede da aplicação. */
const globalNetworkSecurityPolicy: HttpNetworkSecurityPolicy  = {
  allowedOrigins:            ['*'],
  allowedMethods:            ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders:            ['Content-Type', 'Authorization', 'X-API-Key', 'X-Session-Token'],
  exposedHeaders:            ['X-Session-Token', 'X-Trace-Id'],
  isFrameworkSignatureHidden: true,
  perimeterDefenses: {
    'X-Frame-Options'       : 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection'      : '0',
    'X-Download-Options'    : 'noopen'
  }
};

/** Injeção encadeada de dependências plugáveis (DIP) acopladas ao motor do servidor HTTP Express. */
const serverEngine: HttpTrafficExchangeEngine = new ExpressHttpDriver({ 
  port                : Env.port,
  failureFormatter    : coreFailureFormatter,
  systemLogger        : systemTelemetryLogger,
  tokenEngine         : securityTokenEngine,
  consumerEngine      : consumerAccessEngine,
  throttlerEngine     : requestLimitThrottler,
  lifecycleGovernor   : lifecycleGovernor,
  networkPolicy       : globalNetworkSecurityPolicy,
  displayDebugDetails : Env.nodeEnv === 'development'
});

// =========================================================================
//  BOOTSTRAP — ROTEAMENTO E IGNIÇÃO DA INFRAESTRUTURA
// =========================================================================

systemTelemetryLogger.info(`Bootstrapping application core engine under environment: [${Env.nodeEnv}]`);

/** Vincula polimorficamente a malha declarativa de endpoints cadastrados ao servidor ativo. */
configureApiRoutes(serverEngine);

/** Inicia de forma oficial a escuta física do tráfego de dados na porta designada. */
serverEngine.start();
