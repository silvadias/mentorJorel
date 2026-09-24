//src/api/users/model.ts
import db from '../../../src/database/db';
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
export default UserModel;
//# sourceMappingURL=model.js.map