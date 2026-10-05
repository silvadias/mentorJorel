import type { HttpTrafficExchangeEngine }   from '../../infrastructure/httpTraffic/engine/context';
import      { UsersController }             from './controller';

export function initializeUsersRoutes(engine: HttpTrafficExchangeEngine): void {
  engine.register('post', '/users', UsersController.createUser);
  engine.register('get', '/users/', UsersController.getAllUsers);

}