[ESTRUTURA ATUAL DO TEMPLATE]

📂 .vscode/
└── 📄 settings.json
📂 docs/
└── 📄 DDD.example.md
📂 src/
├── 📂 api/
│   ├── 📂 accessIdentification/          <-- PACOTE DE IDENTIFICAÇÃO DE ACESSOS CONSOLIDADO
│   │   ├── 📂 contracts/
│   │   │   └── 📄 deviceContext.ts       <-- Contrato imutável de domínio puros (TypeScript)
│   │   └── 📂 requestParsers/
│   │       └── 📄 clientDeviceExtractor.ts <-- Extrator de DTO agnóstico e livre de acoplamentos
│   ├── 📂 errors/
│   │   ├── 📂 domain/
│   │   │   ├── 📄 accessIdentification.ts <-- Base de dados de erros granulares do domínio (ISO e HTTP)
│   │   │   └── 📄 home.ts
│   │   ├── 📄 apiError.ts                 <-- Classe estendida do motor de erros (Throw New ApiError)
│   │   ├── 📄 catalog.ts                  <-- Agregador automático de dicionários de erros
│   │   └── 📄 registy.ts                  <-- Registro centralizador de domínios expostos
│   ├── 📂 home/
│   │   ├── 📄 controller.ts
│   │   └── 📄 routes.ts
│   └── 📂 users/
│       ├── 📄 controller.ts
│       ├── 📄 model.ts
│       └── 📄 routes.ts
├── 📂 config/
│   └── 📄 env.ts
├── 📂 database/
│   └── 📂 mysql/
│       ├── 📄 instance.ts
│       └── 📄 tables.ts
└── 📂 entryPoint/
    ├── 📂 middlewares/
    │   └── 📄 errorHandler.ts             <-- Captura global de exceções Express e ApiError
    └── 📂 utils/
        └── 📄 catchAsync.ts               <-- Middleware para resolução de Promises assíncronas
📜 .env
📜 .gitignore
📜 docker-compose.yml
📜 package-lock.json
📜 package.json
📜 README.md
📜 tsconfig.json
📜 src/apiRouter.ts
📜 src/app.ts
📜 src/server.ts
