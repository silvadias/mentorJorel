import db, { type UserData } from '../../database/db'; 

// O seu modelo estende e exporta a tipagem vinda do banco central
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

// ✨ APENAS UM EXPORT DEFAULT AQUI NO FINAL!
export default UserModel;
