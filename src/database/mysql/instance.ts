import { mysqlUsersTable } from './tables.js';

export const mysqlConnection = {
  query: {
    selectUsers: () => mysqlUsersTable,
    insertUser: (data: { name: string; email: string }) => {
      const newRow = { id: mysqlUsersTable.length + 1, ...data };
      mysqlUsersTable.push(newRow);
      return newRow;
    }
  }
};
