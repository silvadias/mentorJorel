import      { mysqlConnection } from '../../database/mysql/instance';
import type { IMySQLUserRow }    from '../../database/mysql/tables';

/** Envelope strongly-typed de negócio que herda as propriedades físicas da tabela do banco. */
export interface User extends IMySQLUserRow {}

/**
 * @class UsersModel
 * @description Modelo de Domínio e Barramento de Acesso a Dados de Usuários.
 * Abstrai as chamadas físicas de persistência e expõe métodos semânticos lineares,
 * encapsulando o driver de conexão do MySQL contra o vazamento de queries no core.
 */
export class UsersModel {
  /** Recupera a coleção completa de entidades através de varredura polimórfica. */
  public static findAll(): User[] {

    return mysqlConnection.query.selectUsers();

  }

  /**
   * @description Persiste uma nova entidade estruturada de usuário.
   * Transforma os argumentos primários fornecidos em uma nova linha física de tabela.
   */
  public static create(
    data: { 
    name: string; 
    email: string 
  }): User {
    const newUser = mysqlConnection.query.insertUser(data);

    return newUser;

  }
  
}
