export interface UserData {
  id: number;
  name: string;
  email: string;
}

interface MockDatabase {
  users: UserData[];
}

const mockDatabase: MockDatabase = {
  users: [
    { id: 1, name: "Luis Carlos", email: "silvadias.perfil@outlook.com" },
    { id: 2, name: "John Doe", email: "john@example.com" }
  ]
};

export default mockDatabase;
