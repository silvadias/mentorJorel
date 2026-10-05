import      { Env }                           from './config/env';
import      { ExpressHttpDriver }             from './infrastructure/httpTraffic/drivers/nodeExpress/expressHttpDriver';
import      { ApplicationFailureFormatter }   from './infrastructure/httpTraffic/engine/failureFormatter';
import      { SystemConsoleJsonDriver }       from './infrastructure/telemetry/drivers/systemConsoleJsonDriver';
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

systemTelemetryLogger.info(`Bootstrapping application core engine under environment: [${Env.nodeEnv}]`);

configureApiRoutes(serverEngine);

serverEngine.start();
