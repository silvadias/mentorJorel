import type { HttpTrafficExchangeEngine }   from '../../infrastructure/httpTraffic/engine/context';
import      { UsersController }             from './controller';

// REVELAÇÃO DE PROPÓSITO: A rota agora tem APENAS a rota. Zero acoplamento com segurança de chaves.
export function initializeUsersRoutes(engine: HttpTrafficExchangeEngine): void {
  engine.register(
    'post',
    '/users',
    UsersController.createUser
  );
  
  engine.register(
    'get',
    '/users/',
    UsersController.getAllUsers
  );

}
