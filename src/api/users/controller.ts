import type { HttpTrafficRequest,
              HttpTrafficResponse } from '../../infrastructure/httpTraffic/engine/httpTraffic';
import      { UsersModel }          from './model';

interface CustomError extends Error {
  statusCode?: number;

}

export class UsersController {  
    public static async getAllUsers(request: HttpTrafficRequest): Promise<HttpTrafficResponse> {
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
  }

  /* public static async getAllUsers(
    _request: HttpTrafficRequest

  ): Promise<HttpTrafficResponse> {
      const users = UsersModel.findAll();

      return {
        statusCode: 200,
        body: {
          success: true,
          data: users
        }
      };

    } */

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
