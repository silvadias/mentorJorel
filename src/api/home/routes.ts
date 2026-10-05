import type { HttpTrafficExchangeEngine }   from '../../infrastructure/httpTraffic/engine/context';
import      { HomeController }              from './controller';

export function initializeHomeRoutes(engine: HttpTrafficExchangeEngine): void {
  engine.register('get', '/', HomeController.simulateUnexpectedError);

}