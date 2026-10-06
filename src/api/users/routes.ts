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

    engine.register('post', '/users/login-mock', async (request) => {
    // Instancia o mesmo adapter temporariamente para assinar a chave de teste
    const tokenService = new (await import('../../infrastructure/security/drivers/jwt/expressJwtAdapter')).ExpressJwtAdapter({
      secretKey: 'CHAVE_SUPER_SECRETA_BOILERPLATE',
      expirationSeconds: 3600
    });

    // Cria o passaporte para um Ator fictício na máquina atual
    const tokenGenerated = await tokenService.generate({
      actorId: 'usuario_teste_solid_123',
      deviceFingerprintId: 'fingerprint_computador_local'
    });

    return {
      statusCode: 200,
      body: { status: 'success', token: tokenGenerated }
    };
  });

}
