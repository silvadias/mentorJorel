
import type { HttpTrafficExchangeEngine }       from '../../infrastructure/httpTraffic/engine/context';
import      { initializeAnonymousAccessRoutes } from './anonymousAccess/routes';

export function initializeAccessIdentificationRoutes(engine: HttpTrafficExchangeEngine): void {
  const baseResourcePath = '/access-identification';
  
  initializeAnonymousAccessRoutes(engine, baseResourcePath);
}