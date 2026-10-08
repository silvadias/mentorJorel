import      { Env }                       from '../../config/env';
import      { DomainException }           from '../errors/domainException';
import type { HttpTrafficRequest,
              HttpTrafficResponse }       from '../../infrastructure/httpTraffic/engine/httpTraffic';

export const HomeController = {
  getResponse: async (_request: HttpTrafficRequest): Promise<HttpTrafficResponse> => {
    return {
      statusCode: 200,
      body: {
        message: "Node.ts Standard Template with Express running perfectly inside Docker!",
        status: "online",
        environment: Env.nodeEnv
      }
    };
  },

  simulateDomainError: async (_request: HttpTrafficRequest): Promise<HttpTrafficResponse> => {
    throw new DomainException("STUDENT_NOT_FOUND");
  },

  simulateUnexpectedError: async (_request: HttpTrafficRequest): Promise<HttpTrafficResponse> => {
    throw new Error("Falha catastrófica de conexão com serviço externo simulada!");
  }
};
