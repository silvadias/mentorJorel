import type { HttpTrafficExchangeEngine }               from './infrastructure/httpTraffic/engine/context';
import type { JwtGuard }                                from './infrastructure/security/engine/jwtGuard';
import      { initializeHomeRoutes }                    from './api/home/routes';
import      { initializeUsersRoutes }                   from './api/users/routes';

// CORREÇÃO CRÍTICA: Aceita o segundo parâmetro vindo da Raiz de Composição (server.ts)
export function configureApiRoutes(engine: HttpTrafficExchangeEngine, guard: JwtGuard): void {
  initializeHomeRoutes(engine);
  // Distribui o guarda de forma cirúrgica para o escopo do domínio de usuários
  initializeUsersRoutes(engine, guard);
  
}
