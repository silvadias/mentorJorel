import type { HttpTrafficRequest,
              HttpTrafficResponse } from '../../infrastructure/httpTraffic/engine/httpTraffic';
import      { UsersModel }          from './model';

/** Interface utilitária local para injeção dinâmica de status HTTP em erros nativos. */
interface CustomError extends Error {
  statusCode?: number;

}

/**
 * @class UsersController
 * @description Controlador de Fronteira e Despachante do Subdomínio de Usuários.
 * Traduz os envelopes purificados de requisição em chamadas lineares de modelo de negócio,
 * agindo de forma desacoplada das assinaturas de rede primitivas no padrão adapter.
 */
export class UsersController {  
    

  /** Captura a listagem de registros repassando um payload encapsulado com status 200. */
  public static async getAllUsers(
    request: HttpTrafficRequest

  ): Promise<HttpTrafficResponse> {
      const users = UsersModel.findAll();

      return {
        statusCode: 200,
        body: {
          success: true,
          data: users
        }
      };

    } 

  /**
   * @description Pipeline de criação de novas entidades de usuário.
   * Executa checagem sintática de obrigatoriedade e arremessa erros customizados de barramento.
   */
  public static async createUser(
    request: HttpTrafficRequest

  ): Promise<HttpTrafficResponse> {
      const { 
        name,
        email
      } = request.body;

      if (
        !name || !email
      ) {
        const error: CustomError = new Error("Name and email are required fields");
        error.statusCode = 400;
        throw error;

      }

      const newUser = UsersModel.create({ 
        name,
        email
      });
    
      return {
        statusCode: 201,
        body: {
          success: true,
          message: "User created successfully",
          data: newUser
          
        }
      };
    }

}

//Para teste de jwt

/* public static async getAllUsers(request: HttpTrafficRequest): Promise<HttpTrafficResponse> {
    // CAPTURA TRANS-FRONTEIRA: O controlador de negócio lê a variável injetada nativamente pelo driver
    const activeSession = request.session;

    return {
      statusCode: 200,
      body: {
        status         : 'success',
        message        : 'A camada de negócios interceptou as variáveis de identificação de forma limpa.',
        decodedSession : activeSession
      }
    };
  } */
