import      { Env }                         from './config/env';
import      { ExpressHttpDriver }           from './infrastructure/httpTraffic/drivers/expressHttpDriver';
import      { ApplicationFailureFormatter } from './infrastructure/httpTraffic/engine/failureFormatter';
import      { configureHttpTraffic }        from './apiRouter';
import type { HttpTrafficExchangeEngine }   from './infrastructure/httpTraffic/engine/context';

const coreFailureFormatter = new ApplicationFailureFormatter();

const serverEngine: HttpTrafficExchangeEngine = new ExpressHttpDriver({ 
  port: Env.port,
  failureFormatter: coreFailureFormatter,
  displayDebugDetails: Env.nodeEnv === 'development'
  
});

configureHttpTraffic(serverEngine);

serverEngine.start();