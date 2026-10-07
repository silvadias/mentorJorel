import type { HttpTrafficExchangeEngine }   from '../../infrastructure/httpTraffic/engine/httpTraffic';
import      { HomeController }              from './controller';

export function initializeHomeRoutes(engine: HttpTrafficExchangeEngine): void {
  engine.register('get', '/', HomeController.getResponse);

}