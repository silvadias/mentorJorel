[ESTRUTURA ATUAL DO TEMPLATE]

📂 .vscode/
└── 📄 settings.json
📂 docs/
└── 📄 DDD.example.md
📂 src/
├── 📂 api/
│   ├── 📂 accessIdentification/
│   │   ├── 📂 contracts/
│   │   │   └── 📄 deviceContext.ts
│   │   └── 📂 requestParsers/
│   │       └── 📄 clientDeviceExtractor.ts
│   ├── 📂 errors/
│   │   ├── 📂 domain/
│   │   │   ├── 📄 accessIdentification.ts
│   │   │   └── 📄 home.ts
│   │   ├── 📄 apiError.ts
│   │   ├── 📄 catalog.ts
│   │   └── 📄 registy.ts
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
├── 📂 entryPoint/
│   ├── 📂 middlewares/
│   │   └── 📄 errorHandler.ts
│   └── 📂 utils/
│       └── 📄 catchAsync.ts
└── 📂 infrastructure/                   <-- NOVA PASTA DE INFRAESTRUTURA
    └── 📂 httpTraffic/
        ├── 📂 drivers/                  <-- (Próximo passo: expressHttpDriver.ts)
        └── 📂 engine/
            └── 📄 context.ts            <-- ARQUIVO CRIADO COM SUCESSO
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
