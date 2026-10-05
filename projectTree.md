[ESTRUTURA ATUAL DO TEMPLATE]

📂 .vscode/
└── 📄 settings.json              <-- Otimiza o desempenho do editor omitindo indexações pesadas.
📂 src/
├── 📂 api/                       <-- CAMADA DE NEGÓCIO E ENTREGA (Feature-by-Package)
│   ├── 📂 accessIdentification/  <-- Domínio de Identificação de Dispositivos e Acessos
│   │   ├── 📂 anonymousAccess/   <-- Sub-módulo isolado de fluxo de acessos anônimos
│   │   │   ├── 📄 context.ts     <-- Tipagens de regras puras do sub-domínio anônimo
│   │   │   ├── 📄 delivery.ts    <-- Controlador/Caso de uso específico do fluxo anônimo
│   │   │   ├── 📄 requestParser.ts <-- DTO extractor agnóstico para sanitizar dados de entrada
│   │   │   └── 📄 routes.ts       <-- Compositor de rotas aninhadas injetadas no motor HTTP
│   │   └── 📄 routes.ts          <-- Ponto de entrada do pacote principal que delega sub-rotas
│   ├── 📂 errors/                <-- ECOSSISTEMA DE FALHAS GRANULARES DO SISTEMA
│   │   ├── 📂 domain/            <-- Os Dicionários puros e estritos de cada área de negócio
│   │   │   ├── 📄 accessIdentification.ts <-- Catálogo literal de falhas de hardware e rede (ISO/HTTP)
│   │   │   └── 📄 home.ts        <-- Catálogo literal de falhas cognitivas e de IA
│   │   ├── 📄 catalog.ts         <-- Agregador estático unificado (`as const`) para autocomplete total
│   │   └── 📄 registry.ts        <-- Centralizador agnóstico de mapeamento de domínios expostos
│   ├── 📂 home/                  <-- Domínio Base de Diagnóstico da Aplicação
│   │   ├── 📄 controller.ts      <-- Orquestrador de fluxo agnóstico com rotas de simulação de falhas
│   │   └── 📄 routes.ts          <-- Registrador autônomo da rota raiz no motor HTTP
│   └── 📂 users/                 <-- Domínio de Gerenciamento de Usuários
│       ├── 📄 controller.ts      <-- Controlador puro (getAllUsers/createUser) sem vazar Express
│       ├── 📄 model.ts           <-- Entidade e regras de persistência em memória de usuários
│       └── 📄 routes.ts          <-- Registrador autônomo das rotas de usuários no motor HTTP
├── 📂 config/
│   └── 📄 env.ts                 <-- Centralizador fortemente tipado das variáveis contidas no `.env`
├── 📂 database/
│   └── 📂 mysql/                 <-- Detalhe Tecnológico de Persistência Relacional
│       ├── 📄 instance.ts        <-- Conector e pool de drivers nativos do banco MySQL
│       └── 📄 tables.ts          <-- DDL / Esquemas de estruturas físicas de tabelas
└── 📂 infrastructure/            <-- CAMADA DE INFRAESTRUTURA ISOLADA (O Coração do Adapter)
    └── 📂 httpTraffic/           <-- Contexto de gerenciamento de tráfego de rede
        ├── 📂 drivers/           <-- Motores tecnológicos substituíveis e descartáveis
        │   └── 📄 expressHttpDriver.ts <-- Detalhe do Express: implementa o motor e intercepta erros
        └── 📂 engine/            <-- Regras lógicas e contratos imutáveis da aplicação
            ├── 📄 context.ts     <-- Especificação tipada do fluxo HTTP (Payload, Request, Response)
            ├── 📄 errors.ts      <-- A classe de exceção pura `DomainException` e contratos de payloads
            └── 📄 failureFormatter.ts <-- Interceptador inteligente agnóstico de falhas brutas
📜 src/apiRouter.ts               <-- Orquestrador central agnóstico (Liga os módulos ao motor injetado)
📜 src/server.ts                  <-- Raiz de Composição (Composition Root): lê Env, ativa o driver e inicia o processo
📜 .env                           <-- Segredos e chaves de ambiente do container Docker
📜 .gitignore                     <-- Proteção contra envio de binários e node_modules para o Git
📜 docker-compose.yml             <-- Orquestrador de infraestrutura local do container Node.js e MySQL
📜 package-lock.json              <-- Árvore exata de resolução e integridade de dependências
📜 package.json                   <-- Manifesto do projeto contendo scripts (tsx watch) e dependências do driver
📜 README.md                      <-- Documentação técnica de onboarding do projeto
📜 tsconfig.json                  <-- Governança de regras de compilação estrita do compilador TypeScript
