[ESTRUTURA ATUAL DO TEMPLATE]

📂 / (Raiz do Projeto)
├── 📂 .vscode/                     # Configurações de Governança do Editor
│   └── 📄 settings.json            # Otimiza performance da IDE ocultando watchers pesados (dist/node_modules)
├── 📂 docs/                        # Documentações Auxiliares e Diagramas de Escopo
├── 📂 node_modules/                # Binários e Dependências físicas isoladas do ecossistema Node.js
├── 📂 src/                         # Core Source: O Coração Tecnológico da Aplicação
│   ├── 📂 api/                     # Camada de Negócio Pura e Agnóstica (Feature-by-Package)
│   │   ├── 📂 errors/              # Barramento Central de Falhas de Domínio
│   │   │   ├── 📂 domain/          # Dicionários Literais de Exceções por Contexto
│   │   │   │   ├── 📄 accessIdentification.ts # Erros focados em ISO, autenticação e hardware
│   │   │   │   └── 📄 home.ts      # Erros focados em diagnósticos e falhas cognitivas
│   │   │   ├── 📄 catalog.ts       # Agregador estático unificado (`as const`) para autocomplete em design-time
│   │   │   └── 📄 registry.ts      # Centralizador e exportador de módulos de erro expostos
│   │   ├── 📂 home/                # Contexto Delimitado de Diagnóstico e Saúde do Sistema
│   │   │   ├── 📄 controller.ts    # Controlador puro (Manipula requisições puras e simula quebras de resiliência)
│   │   │   └── 📄 routes.ts        # Inicializador autônomo que pluga o domínio no motor abstrato
│   │   └── 📂 users/               # Contexto Delimitado de Gerenciamento de Usuários
│   │       ├── 📄 controller.ts    # Controlador limpo (Processa fluxos de usuários sem acoplamento a frameworks)
│   │       ├── 📄 model.ts         # Entidades de negócio e persistência mockada provisória em memória
│   │       └── 📄 routes.ts        # Acoplador agnóstico que expõe as portas de entrada de usuários
│   ├── 📂 config/                  # Governança de Parâmetros Mundiais
│   │   └── 📄 env.ts               # Tipagem forte de variáveis (Lê do .env com suporte a runtime do watcher)
│   ├── 📂 database/                # Detalhes de Infraestrutura de Persistência Física
│   │   └── 📂 mysql/               # Driver de Conexão Relacional MySQL
│   │       ├── 📄 instance.ts      # Instanciação nativa do cliente e gerenciador de pooling de rede
│   │       └── 📄 tables.ts        # Scripts de DDL (Criação e integridade física de tabelas)
│   └── 📂 infrastructure/          # Camada de Periferias e Adaptadores Tecnológicos (Ports & Adapters)
│       ├── 📂 httpTraffic/         # Contexto Delimitado de Tráfego de Redes
│       │   ├── 📂 drivers/         # Motores Tecnológicos Descartáveis de Terceiros
│       │   │   └── 📂 nodeExpress/ # Micro-ecossistema Autocontido do Driver Express (Princípio CCP)
│       │   │       └── 📄 expressHttpDriver.ts # Detalhe do Express: Adapta rede, gera Trace ID e intercepta erros
│       │   └── 📂 engine/          # Regras Lógicas e Interfaces Abstratas de Transporte (Ports)
│       │       ├── 📄 context.ts   # Contratos de fluxo purificados (HttpTrafficRequest, HttpTrafficResponse)
│       │       ├── 📄 errors.ts    # Especificação da DomainException e barramentos de payloads nativos
│       │       └── 📄 failureFormatter.ts # Tradutor purificado de exceções para códigos de status HTTP
│       └── 📂 telemetry/           # Contexto Delimitado de Observabilidade e Auditoria
│           ├── 📂 drivers/         # Emissores Físicos de Logs estruturados
│           │   └── 📄 systemConsoleJsonDriver.ts # Formata JSON: compactado para Produção / Pretty-Print para Dev
│           └── 📂 engine/          # Contratos e Escopos de Telemetria (Ports)
│               └── 📄 context.ts   # Interface SystemLogger (info, warn, error, audit com suporte a Trace ID)
│   ├── 📄 apiRouter.ts             # Orquestrador Agnóstico Central: Conecta todas as rotas de domínio ao motor
│   └── 📄 server.ts                # Raiz de Composição (Composition Root): Instancia logs, drivers e inicia o bootstrap
├── 📄 .env                         # Segredos locais e chaves dinâmicas lidas em tempo de execução
├── 📄 .gitignore                   # Proteção de Repositório (Impede vazamento de binários e segredos locais)
├── 📄 docker-compose.yml           # Orquestrador de Hardware Local Enxuto (Puxa imagem Alpine e roda npm install)
├── 📄 package-lock.json            # Árvore imutável de sub-dependências e hashes de segurança do Node.js
├── 📄 package.json                 # Manifesto de dependências e scripts de automação de runtime (tsx watch)
├── 📄 README.md                    # Documentação comercial de onboarding e convenções arquiteturais da banca
└── 📄 tsconfig.json                # Governança estrita do compilador TypeScript (Flag exactOptionalPropertyTypes)
