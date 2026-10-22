import type { HttpTrafficExchangeEngine }   from '../../infrastructure/httpTraffic/engine/httpTraffic';
import      { UsersController }             from './controller';

/**
 * @file routes.ts
 * @description Orquestrador Declarativo de Roteamento para o Subdomínio de Usuários.
 * Mapeia métodos HTTP puros e caminhos de recursos aos seus despachantes de fronteira,
 * isolando a fiação de endpoints de forma modular e expansível.
 */
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
