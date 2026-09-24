export interface User {
    id: number;
    name: string;
    email: string;
}
declare class UserModel {
    static findAll(): User[];
    static create({ name, email }: {
        name: string;
        email: string;
    }): User;
}
export default UserModel;
//# sourceMappingURL=model.d.ts.map