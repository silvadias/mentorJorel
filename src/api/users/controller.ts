import type { HttpTrafficRequest,
              HttpTrafficResponse }          from '../../infrastructure/httpTraffic/engine/httpTraffic';
import      { UsersModel }                   from './model';
import type { AssociateExternalIdentityUseCase } from './userCases/associateExternalIdentity';
import      { AccessQuotaEvaluator }         from './policies/accessQuotaEvaluator';

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

  /** 
   * @description Captura a listagem de registros aplicando a barreira horizontal de privilégios.
   * Exige nível mínimo 'TRACKED_ANONYMOUS' para mitigar vazamentos por robôs inéditos.
   */
  public static async getAllUsers(
    request: HttpTrafficRequest
  ): Promise<HttpTrafficResponse> {
    // Instancia o avaliador tardio para processamento das políticas isoladas por rota
    const policyEvaluator = new AccessQuotaEvaluator();

    // BARREIRA DE PROTEÇÃO HORIZONTAL: Bloqueia o tráfego se as sinaleiras de contexto falharem
    policyEvaluator.evaluate(request.session, {
      requiredMinimumTrustLevel  : 'TRACKED_ANONYMOUS',
      maxAllowedOperationsPerMin : 30
    });

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
   * Exige privilégios elevados de federação (Nível 1) para consolidar a conta permanente.
   */
  public static async createUser(
    request: HttpTrafficRequest
  ): Promise<HttpTrafficResponse> {
    const policyEvaluator = new AccessQuotaEvaluator();

    // BARREIRA DE PROTEÇÃO HORIZONTAL: Exige o Trust Level de FEDERATED_SIGNUP (Nível 1)
    policyEvaluator.evaluate(request.session, {
      requiredMinimumTrustLevel  : 'FEDERATED_SIGNUP',
      maxAllowedOperationsPerMin : 10
    });

    const { name, email } = request.body;

    if (!name || !email) {
      const error: CustomError = new Error("Name and email are required fields");
      error.statusCode = 400;
      throw error;
    }

    const newUser = UsersModel.create({ name, email });
  
    return {
      statusCode: 201,
      body: {
        success: true,
        message: "User created successfully",
        data: newUser
      }
    };
  }

  /**
   * @description Pipeline de Upgrade e Elevação de Privilégios Federados (Nível 1).
   * Intercepta o envelope de tráfego, extrai as credenciais e aciona o caso de uso injetado.
   */
  public static async upgradeIdentity(
    request: HttpTrafficRequest,
    associateIdentityUseCase: AssociateExternalIdentityUseCase
  ): Promise<HttpTrafficResponse> {
    const { accessToken, providerName } = request.body;

    if (!accessToken || !providerName) {
      const error: CustomError = new Error("AccessToken and providerName are required fields");
      error.statusCode = 400;
      throw error;
    }

    // Executa a ação de negócio por Inversão de Controle, repassando o ID de sessão e o logger nativo
    await associateIdentityUseCase.execute({
      actorId      : request.session.actorId,
      accessToken  : accessToken,
      providerName : String(providerName)
    }, request.logger);

    return {
      statusCode: 200,
      body: {
        success: true,
        message: `Identity successfully upgraded to FEDERATED_SIGNUP via ${providerName}.`
      }
    };
  }
}
