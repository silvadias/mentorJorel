// === Arquivo: ./src/api/users/model.ts ===
import { mysqlConnection } from '../../database/mysql/instance';
import { type IMySQLUserRow } from '../../database/mysql/tables';

export interface User extends IMySQLUserRow {}

class UserModel {
  public static findAll(): User[] {
    return mysqlConnection.query.selectUsers();
  }

  // Simula o comportamento de um ORM executando: "INSERT INTO users"
  public static create(data: { name: string; email: string }): User {
    const newUser = mysqlConnection.query.insertUser(data);
    return newUser;
  }
}

export default UserModel;
