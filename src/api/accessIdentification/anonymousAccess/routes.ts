import type { HttpTrafficExchangeEngine }   from '../../../infrastructure/httpTraffic/engine/context';
import type { HttpTrafficRequest, 
              HttpTrafficResponse }         from '../../../infrastructure/httpTraffic/engine/context';

export function initializeAnonymousAccessRoutes(
  engine: HttpTrafficExchangeEngine, 
  parentResourcePath: string
): void {
  const currentResourcePath = `${parentResourcePath}/anonymous`;

  engine.register('get', currentResourcePath, async (_request: HttpTrafficRequest): Promise<HttpTrafficResponse> => {
    return {
      statusCode: 200,
      body: {
        message: "Rota de Anonymous funcionando falta criar controller",
        status: "online",
        environment: "teste"
      }
    };
  });

}