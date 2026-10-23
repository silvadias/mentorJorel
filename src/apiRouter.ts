import type { HttpTrafficExchangeEngine }               from './infrastructure/httpTraffic/engine/httpTraffic';
import      { initializeHomeRoutes }                    from './api/home/routes';
import      { initializeUsersRoutes }                   from './api/users/routes';
import type { AssociateExternalIdentityUseCase }        from './api/users/userCases/associateExternalIdentity';


/**
 * @file apiRouter.ts
 * @description Centralizador de Topografia de Rede.
 * Agrega e delega sequencialmente o acoplamento de rotas e recursos de negócio,
 * servindo como o ponto unificado de fiação declarativa para o motor de tráfego HTTP.
 */
export function configureApiRoutes(engine: HttpTrafficExchangeEngine,
  associateIdentityUseCase: AssociateExternalIdentityUseCase 
): void {
  initializeHomeRoutes(engine);
  initializeUsersRoutes(engine,associateIdentityUseCase);
  
}
