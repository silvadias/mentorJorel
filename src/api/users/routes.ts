import type { HttpTrafficExchangeEngine }   from '../../infrastructure/httpTraffic/engine/httpTraffic';
import      { UsersController }             from './controller';
import type { AssociateExternalIdentityUseCase } from './userCases/associateExternalIdentity';

/**
 * @file routes.ts
 * @description Orquestrador Declarativo de Roteamento para o Subdomínio de Usuários.
 * Mapeia métodos HTTP puros e caminhos de recursos aos seus despachantes de fronteira,
 * isolando a fiação de endpoints de forma modular e injetando dependências do Core.
 */
export function initializeUsersRoutes(
  engine: HttpTrafficExchangeEngine,
  associateIdentityUseCase: AssociateExternalIdentityUseCase // ◄ Recebe a engrenagem repassada pelo apiRouter
): void {
  
  // Canal focado na listagem de usuários nominais (Cenário existente)
  engine.register(
    'get',
    '/users/',
    UsersController.getAllUsers
  );

  // Canal focado na criação de contas nominais tradicionais
  engine.register(
    'post',
    '/users',
    UsersController.createUser
  );  

  // 🧬 NOVO ENDPOINT PERIMETRAL: Canal focado na elevação progressiva de privilégios via Big Techs
  engine.register(
    'post',
    '/auth/upgrade',
    (request) => UsersController.upgradeIdentity(request, associateIdentityUseCase)
  );
}
