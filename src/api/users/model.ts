//src/api/users/model.ts

import db, { type UserData } from '../../database/db'; // ✨ Importa o banco e a tipagem dele!

// O seu modelo exporta a interface que a API vai usar (reutilizando a do banco)
export interface User extends UserData {}

class UserModel {
  static findAll(): User[] {
    return db.users;
  }

  static create({ name, email }: { name: string; email: string }): User {
    const newUser: User = {
      id: db.users.length + 1,
      name,
      email
    };
    db.users.push(newUser);
    return newUser;
  }
}

export default UserModel;
