ENTREGAS DE CICLOS: CONTRATOS DEFINIDOS (CONSOLIDADO)

🏢 Visão Geral do Template Atual (Hexagonal Adapter)
O template encontra-se em um estado de isolamento absoluto de infraestrutura de rede e transporte. Todo o acoplamento com o framework Express foi expurgado das regras de negócio. O ecossistema agora opera baseado em Contratos e Drivers substituíveis, tornando o core da aplicação 100% portável.
🗺️ Mapeamento Físico e Propósito dos Arquivos
text
src/
├── api/                       # CAMADA DE NEGÓCIO PURA (Feature-by-Package)
│   ├── errors/                # Ecossistema Inteligente de Falhas Granulares
│   │   ├── domain/            # Dicionários literais de erros por domínio
│   │   │   └── home.ts        # Catálogo estático de falhas cognitivas e de IA
│   │   ├── catalog.ts         # Agregador unificado (`as const`) para autocomplete estático total
│   │   └── registry.ts        # Centralizador agnóstico de mapeamento de domínios expostos
│   ├── home/                  # Domínio Base de Diagnóstico da Aplicação
│   │   ├── controller.ts      # Controlador agnóstico (Manipula HttpTrafficRequest e retorna HttpTrafficResponse)
│   │   └── routes.ts          # Registrador autônomo de rotas injetado no motor abstrato
│   └── users/                 # Domínio de Gerenciamento de Usuários
│       ├── controller.ts      # Controlador puro livre de assinaturas HTTP nativas
│       ├── model.ts           # Entidade e persistência mockada em memória de usuários
│       └── routes.ts          # Inicializador agnóstico do pacote de usuários
├── config/                    # Configurações globais fortemente tipadas (env.ts)
├── database/                  # Detalhes de infraestrutura física de persistência
│   └── mysql/                 # Conector nativo e tabelas estruturais físicas (DDL)
└── infrastructure/            # CAMADA DE INFRAESTRUTURA ISOLADA (O Coração do Adapter)
    └── httpTraffic/           # Contexto delimitado de tráfego de rede
        ├── drivers/           # Motores tecnológicos descartáveis e substituíveis
        │   └── expressHttpDriver.ts  # Implementação do Express (Invisible Detail com try/catch embutido)
        └── engine/            # Regras lógicas e contratos imutáveis da aplicação
            ├── context.ts     # Especificação de tipos de fluxo (Payload, Request, Response)
            ├── errors.ts      # A classe de exceção pura 'DomainException' e contratos de payloads
            └── failureFormatter.ts  # Interceptador inteligente agnóstico de falhas brutas
├── apiRouter.ts               # Orquestrador agnóstico central de módulos da raiz
└── server.ts                  # Raiz de Composição (Composition Root): ativa o driver e inicia o processo
Use o código com cuidado.
⚙️ Funcionamento das Camadas Atuais
1. A Raiz de Composição (server.ts): É o ponto de entrada único. Ele lê as variáveis de ambiente, instancia o formatador de erros e o driver tecnológico desejado (ExpressHttpDriver), passando as configurações via construtor. Ele injeta esse motor no roteador central e liga o servidor.
2. O Driver de Tráfego (expressHttpDriver.ts): É o único componente que conhece o Express. Ele implementa a interface abstrata HttpTrafficExchangeEngine. Ao receber uma requisição, ele a isola e a traduz em um objeto puro do sistema (HttpTrafficRequest), repassando-a para o controlador de domínio.
3. Os Controladores de Domínio (src/api/*/controller.ts): São funções assíncronas puras que operam sem nenhum tipo de importação técnica do Express. Recebem dados limpos do contexto e retornam um objeto JavaScript literal contendo apenas { statusCode, body }.
4. O Barramento de Resiliência (failureFormatter.ts): Centraliza o tratamento de erros sem usar middlewares de frameworks. Se o controlador dispara uma falha de negócio conhecida (DomainException), o driver captura o erro no try/catch interno, aciona o formatador agnóstico e injeta o status correto diretamente no cabeçalho HTTP de rede de forma automatizada, protegendo a aplicação contra quebras ou vazamentos de debug.

Iniciado construção de identificação de acesso.
### `src/api/accessIdentification/contracts/deviceContext.ts`
Contrato abstrato, imutável (`readonly`) e alinhado a padrões de alta segurança de mercado (Auth0/Clerk). Capt>
*   `AccessDeviceBrowserMetadata`: `os`, `browser`, `ipAddress`, `countryCode`, `userAgent`, `preferredLanguag>
*   `AccessDeviceContext`: `fingerprintId` (fixo da máquina), `browserInstanceId` (efêmero do navegador), `per>
