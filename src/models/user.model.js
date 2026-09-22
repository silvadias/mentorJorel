const db = require('../../database/db');

class UserModel {
  static findAll() {
    return db.users;
  }

  static create({ name, email }) {
    const newUser = {
      id: db.users.length + 1,
      name,
      email
    };
    db.users.push(newUser);
    return newUser;
  }
}

module.exports = UserModel;
