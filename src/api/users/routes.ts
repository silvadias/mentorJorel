import type { HttpTrafficExchangeEngine }   from '../../infrastructure/httpTraffic/engine/context';
import type { JwtGuard }                    from '../../infrastructure/security/engine/jwtGuard';
import      { UsersController }             from './controller';

export function initializeUsersRoutes(engine: HttpTrafficExchangeEngine, guard: JwtGuard): void {
  engine.register(
    'post',
    '/users',
    UsersController.createUser
  );
  
  engine.register(
    'get',
    '/users/',
    guard.protect(UsersController.getAllUsers)
  );

}
