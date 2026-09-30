[ESTRUTURA ATUAL DO TEMPLATE]

📂 .vscode/
└── settings.json
📂 docs/
└── DDD.example.md
📂 src/
├── 📂 api/
│   ├── 📂 accessIdentification/
│   │   ├── 📂 contracts/
│   │   │   └── 📄 deviceContext.ts
│   │   └── 📂 requestParsers/
│   │       └── 📄 clientDeviceExtractor.ts  <-- ADICIONADO CONFORME DELIBERAÇÃO
│   ├── 📂 errors/
│   │   ├── 📂 domain/
│   │   │   └── home.ts
│   │   ├── apiError.ts
│   │   ├── catalog.ts
│   │   └── registy.ts
│   ├── 📂 home/
│   │   ├── controller.ts
│   │   └── routes.ts
│   └── 📂 users/
│       ├── controller.ts
│       ├── model.ts
│       └── routes.ts
├── 📂 config/
│   └── env.ts
├── 📂 database/
│   └── 📂 mysql/
│       ├── instance.ts
│       └── tables.ts
└── 📂 entryPoint/
    ├── 📂 middlewares/
    │   └── errorHandler.ts
    └── 📂 utils/
        └── catchAsync.ts
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
