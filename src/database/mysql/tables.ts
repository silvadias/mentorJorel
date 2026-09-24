export interface IMySQLUserRow {
  id: number;
  name: string;
  email: string;
}

export const mysqlUsersTable: IMySQLUserRow[] = [
  { id: 1, name: "Luis Carlos", email: "silvadias.perfil@outlook.com" },
  { id: 2, name: "John Doe", email: "john@example.com" }
];
