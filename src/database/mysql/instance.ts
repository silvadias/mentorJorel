import { mysqlUsersTable } from './tables';

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
