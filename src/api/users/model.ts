import { mysqlConnection } from '../../database/mysql/instance';
import { type IMySQLUserRow } from '../../database/mysql/tables';

export interface User extends IMySQLUserRow {}

export class UserModel {
  public static findAll(): User[] {
    return mysqlConnection.query.selectUsers();
  }

  public static create(data: { name: string; email: string }): User {
    const newUser = mysqlConnection.query.insertUser(data);
    return newUser;
  }
}
