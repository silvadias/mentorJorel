import type { HttpTrafficExchangeEngine }               from './infrastructure/httpTraffic/engine/httpTraffic';
import      { initializeHomeRoutes }                    from './api/home/routes';
import      { initializeUsersRoutes }                   from './api/users/routes';

export function configureApiRoutes(engine: HttpTrafficExchangeEngine): void {
  initializeHomeRoutes(engine);
  initializeUsersRoutes(engine);
  
}
