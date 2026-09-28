# Boilerplate API Node.js padrão **Domain-Driven MVC (Feature-by-Package)**

Este projeto serve como uma estrutura base (boilerplate) robusta e escalável para o desenvolvimento de APIs em Node.js com TypeScript. A arquitetura foi desenhada utilizando o padrão **Domain-Driven MVC (Feature-by-Package)**, focando no isolamento de escopo por domínio de negócio e facilidade de adaptação para ambientes de produção.

---

##  Arquitetura do Projeto

A estrutura de pastas rompe o MVC tradicional por camadas técnicas e adota uma abordagem **orientada a domínios (features)**. Cada módulo de negócio possui autonomia sobre seus componentes (controllers, rotas e modelos), facilitando a manutenção e a substituição de tecnologias.

### Estrutura de Pastas

```text
src/
├── api/                  # Módulos de domínio do negócio (Features)
│   ├── errors/           # Engenharia global de erros com classes tipadas
│   ├── home/             # Domínio de Home (Exemplo de rota estática)
│   │   ├── controller.ts
│   │   └── routes.ts
│   └── users/            # Domínio de Usuários (Exemplo com Banco Mockado)
│       ├── controller.ts
│       ├── model.ts      # Contém os dados mockados (Pronto para migrar para BD)
│       └── routes.ts
├── config/               # Configurações globais e variáveis de ambiente (env.ts)
├── entryPoint/           # Scripts de inicialização e bootstrapping do servidor
├── apiRouter.ts          # Centralizador global de rotas da API
├── app.ts                # Configuração do Express / Instância do App
└── server.ts             # Inicialização do servidor HTTP
```

---

##Padrões de Desenvolvimento & Convenções

Para manter a consistência do código à medida que o projeto cresce, siga estritamente as regras abaixo:

### 1. Padrão de Exportação e Importação (Imports)
Todos os arquivos devem utilizar exportações nomeadas. O padrão de importação é **CamelCase** utilizando desestruturação:

```typescript
// Correto (Named Export + CamelCase)
import { UserController } from './controller';

// Incorreto
import userController from './controller';
```

### 2. Engenharia de Erros Global
Não utilize blocos `try/catch` genéricos nos controllers para controle de fluxo básico. Utilize as classes tipadas globais localizadas em `src/api/errors/`. O tratamento de exceções é centralizado e interceptado globalmente.

### 3. Adaptação para Produção (Banco de Dados Real)
O domínio `src/api/users/` utiliza uma camada de dados mockada dentro do arquivo `model.ts` para fins de demonstração e testes de rotas. 
* **Para produção:** Substitua o mock do `model.ts` pela conexão com o ORM/ODM de sua escolha (Prisma, TypeORM, Mongoose, Sequelize, etc.).

---

## Como Usar este Boilerplate para Novos Projetos

Para iniciar um novo projeto do zero utilizando esta estrutura como molde, você pode criar uma nova ramificação ou repositório a partir desta base e simplesmente:
1. Criar suas novas pastas de domínio dentro de `src/api/` (ex: `src/api/products/`).
2. Registrar o novo roteador no arquivo centralizador `src/apiRouter.ts`.

silvadias.perfil@outlook.com
