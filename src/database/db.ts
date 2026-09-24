//src/api/database/db.ts
// Localizado em: src/config/db.ts
import type { User } from '../api/users/model'; // ✨ Caminho corrigido!

interface MockDatabase {
  users: User[];
}

const mockDatabase: MockDatabase = {
  users: [
    { id: 1, name: "Luis Carlos", email: "silvadias.perfil@outlook.com" },
    { id: 2, name: "John Doe", email: "john@example.com" }
  ]
};

export default mockDatabase;
