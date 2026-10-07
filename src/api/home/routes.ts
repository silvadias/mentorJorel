import type { HttpTrafficExchangeEngine }   from '../../infrastructure/httpTraffic/engine/httpTraffic';
import      { HomeController }              from './controller';

export function initializeHomeRoutes(engine: HttpTrafficExchangeEngine): void {
  engine.register(
    'get',
    '/',
    HomeController.getResponse,
    //* Desmarcar para simular o erro de domínio e erro de formato inesperado colocados no controller
    //HomeController.simulateDomainError,
    //HomeController.simulateUnexpectedError
  );

}