import { mysqlUsersTable } from './tables';

/**
 * @file instance.ts
 * @description Driver de Baixo Nível e Instância de Conexão Virtual do MySQL.
 * Emula queries de seleção e inserção linear com cálculo de ID autoincrementável nativo,
 * agindo como o mecanismo simulado de persistência relacional do boilerplate.
 */
export const mysqlConnection = {
  query: {
    /** Retorna a referência física direta do ponteiro do array de dados da tabela. */
    selectUsers : () => mysqlUsersTable,
    
    /**
     * @description Executa a inserção atômica e emula o comportamento de escrita em disco.
     * Calcula o ID incrementando o tamanho da tabela e anexa o novo registro no buffer.
     */
    insertUser  : (
      data: { 
      name: string; 
      email: string 
    }) => {
      const newRow = { 
        id: mysqlUsersTable.length + 1, ...data 
      };
      mysqlUsersTable.push(newRow);

      return newRow;
    }
  }

};
