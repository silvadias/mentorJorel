/**
 * @interface IMySQLUserRow
 * @description Esquema de Registro Físico da Tabela de Usuários.
 * Mapeia o formato cru dos campos tipados persistidos no banco de dados relacional.
 */
export interface IMySQLUserRow {
  id    : number;
  name  : string;
  email : string;
}

/** Array mutável alocado na memória RAM que simula os registros em disco da tabela física. */
export const mysqlUsersTable: IMySQLUserRow[] = [
  { id: 1, 
    name: "Luis Carlos", 
    email: "silvadias.perfil@outlook.com" 
  },
  { id: 2,
    name: "John Doe",
    email: "john@example.com"
  }
];
