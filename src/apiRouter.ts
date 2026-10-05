import type { HttpTrafficExchangeEngine }               from './infrastructure/httpTraffic/engine/context';
import      { initializeHomeRoutes }                    from './api/home/routes';
import      { initializeUsersRoutes }                   from './api/users/routes';
import      { initializeAccessIdentificationRoutes }    from './api/accessIdentification/routes';

export function configureHttpTraffic(engine: HttpTrafficExchangeEngine): void {
  initializeHomeRoutes(engine);
  initializeUsersRoutes(engine);
  initializeAccessIdentificationRoutes(engine);
  
}