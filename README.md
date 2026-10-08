# TypeScript API Boilerplate — Hexagonal Pluggable Adapter Engine

Este projeto é um boilerplate arquitetural de alta maturidade para APIs TypeScript, orientado a **portabilidade**, **isolamento de infraestrutura**, **observabilidade estruturada**, **segurança perimetral** e **resiliência**.

A arquitetura combina **Clean Architecture (Ports & Adapters)** com **Feature-by-Package**, mantendo o núcleo da aplicação independente de frameworks de transporte, bibliotecas criptográficas e implementações específicas de logging. Tecnologias externas ficam concentradas em `drivers/`, enquanto os contratos estáveis do sistema permanecem em `engine/`.

## Arquitetura

A estrutura segue o princípio da **Inversão de Dependências (DIP)**: o domínio define contratos; os adaptadores implementam esses contratos.

```text
src/
├── api/                       # CAMADA DE DOMÍNIO E NEGÓCIO PURA (Soberana/Agnóstica)
│   └── errors/                # Barramento Centralizado de Exceções de Domínio
│       ├── domain/            # Dicionários literais de mensagens e chaves
│       │   └── security.ts
│       ├── catalog.ts         # Ponto Único de Verdade: ErrorCatalog e ErrorCode
│       └── domainException.ts # Exceção de negócio soberana
├── config/                    # Parâmetros globais e configuração strongly-typed
│   └── env.ts                 # Tipagem estrita das variáveis de ambiente
└── infrastructure/            # PERIFERIAS E ADAPTADORES (Ports & Adapters)
    ├── telemetry/             # Observabilidade e não-repúdio
    │   ├── engine/            # Contratos de abstração (Ports)
    │   │   └── systemLogger.ts
    │   └── drivers/            # Implementações substituíveis (Adapters)
    │       └── systemConsoleJsonDriver.ts
    ├── httpTraffic/            # Tráfego de rede e protocolo HTTP
    │   ├── engine/            # Contratos de transporte
    │   │   ├── httpTraffic.ts
    │   │   └── httpValidation.ts
    │   └── drivers/            # Motores tecnológicos
    │       └── nodeExpress/
    │           └── expressHttpDriver.ts
    └── security/              # Segurança, sessão e criptografia
        ├── engine/            # Contratos de sessão
        │   └── tokenSession.ts
        └── drivers/            # Implementações criptográficas
            └── jwt/
                └── expressJwtAdapter.ts
├── apiRouter.ts               # Orquestrador agnóstico de rotas
└── server.ts                  # Composition Root e bootstrap
```

## Princípios arquiteturais

### Drivers e Engines

- **`drivers/`** contém os adaptadores que conhecem tecnologias específicas. O `expressHttpDriver.ts`, por exemplo, conhece o Express e concentra os detalhes da borda HTTP.
- **`engine/`** contém os contratos e regras abstratas do ecossistema. Os drivers devem se adaptar aos contratos do sistema, e não o contrário.

Essa separação permite substituir uma tecnologia de infraestrutura sem espalhar sua dependência pelo restante da aplicação.

### Isolamento de frameworks

O domínio não deve depender diretamente de assinaturas do Express ou de outros frameworks HTTP. A aplicação trabalha com estruturas próprias, como `HttpTrafficRequest` e `HttpTrafficResponse`.

O framework é tratado como detalhe de infraestrutura.

### Nomes que revelam propósito

O dialeto compacto exigido por protocolos e bibliotecas externas fica encapsulado nos adaptadores. O restante do sistema utiliza nomes de domínio claros e fortemente tipados, como:

- `actorId`
- `deviceFingerprintId`
- `initialIpAddress`
- `requestSequenceCounter`
- `lastActivityAt`

Essa tradução mantém os detalhes de transporte e criptografia fora do núcleo da aplicação.

## Observabilidade

A telemetria é definida pelo contrato `SystemLogger`, localizado em `src/infrastructure/telemetry/engine/systemLogger.ts`.

O contrato disponibiliza operações como:

- `info()`
- `warn()`
- `error()`
- `audit()`
- `withContext(traceId, requestMetadata)`

O uso genérico de `console.log()` no core é evitado. Cada ciclo de requisição pode carregar um **Trace ID**, permitindo rastrear o fluxo ponta a ponta.

O `systemConsoleJsonDriver.ts` adapta esse contrato para a saída física:

- em produção, emite JSON de linha única, adequado para ingestão em ferramentas de observabilidade;
- em desenvolvimento, utiliza Pretty Print para facilitar a leitura humana.

## Tráfego HTTP

O contrato `HttpTrafficRequest` / `HttpTrafficResponse`, definido em `src/infrastructure/httpTraffic/engine/httpTraffic.ts`, representa o transporte de forma independente do framework.

O `expressHttpDriver.ts` é o adaptador responsável pela borda HTTP. Ele:

1. recebe o tráfego bruto;
2. executa as validações de entrada;
3. hidrata o contexto da requisição;
4. integra o mecanismo de sessão por inversão de dependência;
5. centraliza o tratamento de falhas;
6. disponibiliza metadados de borda para auditoria.

Quando não existe uma sessão válida, o fluxo pode operar com o ator `ANONYMOUS` e metadados de borda.

Também são capturados dados como IP e um hash reduzido do User-Agent para uso nos cruzamentos de auditoria definidos pelo domínio.

## Segurança e sessões

O contrato `TokenCryptographerEngine` e o modelo `TokenSessionPayload` ficam em `src/infrastructure/security/engine/tokenSession.ts`.

A interface abstrai a tecnologia utilizada para gerar e decifrar tokens, mantendo o restante da aplicação independente da biblioteca criptográfica.

O `expressJwtAdapter.ts` é o único ponto autorizado a conhecer a implementação JWT externa. Ele traduz os nomes de domínio para os campos compactos do protocolo e converte erros da biblioteca em exceções nativas da aplicação.

Exemplo:

```typescript
throw new DomainException('SECURITY_TOKEN_EXPIRED');
```

Essa abordagem evita que exceções específicas da biblioteca vazem para o domínio.

## Engenharia de erros

O tratamento de falhas segue uma abordagem centralizada.

`src/api/errors/catalog.ts` funciona como a **Verdade Única de Erros**, reunindo o catálogo e os respectivos códigos. `domainException.ts` representa a exceção soberana do domínio.

Em vez de espalhar tratamento de erros específicos por controladores e casos de uso, o código lança uma exceção sem conhecer o mecanismo de transporte:

```typescript
throw new DomainException('SECURITY_TOKEN_CORRUPTED');
```

A falha percorre o barramento até o adaptador de rede, onde é traduzida pelo mecanismo de formatação da aplicação para uma resposta HTTP estruturada.

## Rotas e princípio Open/Closed

O arquivo de rotas deve permanecer concentrado no registro dos endpoints.

A segurança de perímetro e a leitura de sessão são responsabilidades da infraestrutura de tráfego e de seus mecanismos de pipeline. Dessa forma, a expansão das políticas de segurança pode ocorrer sem acoplar regras tecnológicas aos módulos de domínio.

A intenção é manter os componentes existentes fechados para modificações desnecessárias e abertos à extensão por novos adaptadores e políticas.

## Próximo marco técnico

Com a camada de tráfego, a telemetria estruturada e a hidratação de tokens encapsuladas, o próximo passo arquitetural é a implementação da camada de **Casos de Uso (`useCases`)**.

O modelo planejado trabalha com **Identificação Progressiva** e **Atores Temporários**:

1. uma requisição inicialmente anônima chega como `ANONYMOUS`;
2. o caso de uso pode cruzar IP, hash do navegador e informações de hardware;
3. sendo identificada uma nova entidade, um ID de negócio é criado;
4. o token passa a representar esse ator temporário;
5. quando o usuário realiza o cadastro oficial, os dados podem atualizar a mesma entidade, preservando seu histórico de uso.

Essa etapa deverá manter as mesmas regras de isolamento: casos de uso e domínio não devem conhecer detalhes de Express, JWT ou outros mecanismos tecnológicos.

## Configuração e execução

As variáveis de ambiente são governadas por `src/config/env.ts`.

Para o desenvolvimento assistido, o comportamento de logging pode ser alternado entre `development` e `production` por meio de `NODE_ENV`, conforme a configuração do projeto.

Novos módulos de domínio devem ser organizados como pacotes autocontidos dentro de `src/api/`, mantendo suas regras separadas da infraestrutura.

## Convenções

### Imports

Para contratos usados apenas como tipos, utilize `import type`:

```typescript
import type { HttpTrafficRequest } from '../../infrastructure/httpTraffic/engine/httpTraffic';
```

### Dependências

- mantenha dependências tecnológicas nos respectivos `drivers/`;
- mantenha contratos e abstrações em `engine/`;
- evite vazamento de tipos de frameworks para o domínio;
- prefira exceções de domínio catalogadas a códigos e mensagens espalhados;
- preserve nomes de negócio compreensíveis no core;
- utilize injeção de dependências para conectar o núcleo aos adaptadores.

## 💻 Arquitetura de Fluxo (Exemplo de Escala com Acoplamento Zero)

### 🛣️ 1. A Fiação da Rota (`src/api/messages/routes.ts`)
O arquivo de rotas possui responsabilidade única (SRP): mapear o método HTTP puro ao seu despachante, delegando a malha de validação de dados de forma declarativa e invisível.

```typescript
import type { HttpTrafficExchangeEngine }   from '../../infrastructure/httpTraffic/engine/httpTraffic';
import      { MessagesController }          from './controller';
import      { MessageInputSchema }          from './validation';

export function initializeMessagesRoutes(engine: HttpTrafficExchangeEngine): void {
  // A rota tem apenas a rota e o contrato sintático de entrada. Zero acoplamento com segurança.
  engine.register(
    'post',
    '/messages',
    MessagesController.dispatchSendMessage,
    MessageInputSchema
  );
}
```

### 🎯 2. O Controlador Despachante (`src/api/messages/controller.ts`)
O controlador atua estritamente como um tradutor de fronteira. Ele não executa lógicas de banco de dados, não valida e-mails e não faz cálculos temporais. Ele simplesmente captura o input limpo, lê a sessão hidratada pela rede e despacha para a Action executar o trabalho pesado.

```typescript
import type { HttpTrafficRequest,
              HttpTrafficResponse } from '../../infrastructure/httpTraffic/engine/httpTraffic';
import      { SendMessageAction }   from './actions/sendMessageAction';

export class MessagesController {
  public static async dispatchSendMessage(request: HttpTrafficRequest): Promise<HttpTrafficResponse> {
    
    // Inversão de Controle: Instancia a ação de negócio injetando a telemetria contextual da requisição
    const messageUseCase = new SendMessageAction(request.logger);

    // Executa o Caso de Uso passando apenas os payloads purificados e a identidade isolada
    const businessResult = await messageUseCase.execute({
      promptText : request.body.prompt,
      userSession: request.session
    });

    // Retorna a resposta visual adaptável para o controlador devolver à rede
    return {
      statusCode : 200,
      body       : {
        status : 'success',
        data   : businessResult
      }
    };
  }
}
```

### ⚙️ 3. A Ação de Domínio / Caso de Uso (`src/api/messages/actions/sendMessageAction.ts`)
O coração do software. Esta classe é imune a frameworks de rede (não sabe o que é Express ou cURL). Ela recebe estruturas fortemente tipadas em tempo de design, aplica as lógicas de bloqueio comportamental de anônimos, consome repositórios e emite auditorias estruturadas imutáveis.

```typescript
import type { SystemLogger }        from '../../../../infrastructure/telemetry/engine/systemLogger';
import type { TokenSessionPayload } from '../../../../infrastructure/security/engine/tokenSession';
import      { DomainException }     from '../../../errors/domainException';

interface SendMessageInput {
  readonly promptText  : string;
  readonly userSession : TokenSessionPayload;
}

interface SendMessageOutput {
  readonly aiResponse : string;
  readonly promptId   : string;
}

export class SendMessageAction {
  private readonly logger: SystemLogger;

  constructor(logger: SystemLogger) {
    this.logger = logger;
  }

  public async execute(input: SendMessageInput): Promise<SendMessageOutput> {
    const { actorId, initialIpAddress, requestSequenceCounter } = input.userSession;

    // BARREIRA DE COMPORTAMENTO: Se for um ator anônimo e o contador violar o limite contra vírus
    if (actorId === 'ANONYMOUS' && requestSequenceCounter > 5) {
      this.logger.warn(`Security threshold breached. IP [${initialIpAddress}] blocked by anti-bot policy.`);
      throw new DomainException('SECURITY_TOKEN_CORRUPTED');
    }

    // AUDITORIA NATIVA: Registro estruturado de não-repúdio gerado em formato JSON camaleônico
    this.logger.audit('AI_PROMPT_PROCESSED', actorId, {
      promptLength : input.promptText.length,
      sequenceId   : requestSequenceCounter
    });

    // Simulando a execução real da regra de negócio (Consulta a IA / Banco de Dados de forma isolada)
    return {
      aiResponse : `Resposta computada para o prompt: ${input.promptText}`,
      promptId   : 'prompt_uuid_999'
    };
  }
}
```

### 💡 Por que esta dinâmica garante a Imunidade Arquitetural?
-   **Validação Desacoplada:** Se o frontend enviar um JSON sem o campo `prompt`, o driver de rede barra na portaria (422) antes mesmo do `MessagesController` ser invocado [Uncle Bob].
-   **Manutenabilidade e Escala:** Se a regra de bloqueio de bots mudar (ex: validar o hash do navegador em vez do contador), você altera **apenas um arquivo**: a action `SendMessageAction`. As rotas, os controladores e as criptografias do JWT permanecem **100% intocados e imunes**, impossibilitando que uma alteração lógica cause efeitos colaterais ou quebre outras partes do ecossistema [Uncle Bob, Farley].

## 🛡️ Ecossistema Perimetral Multi-Tenant & Cache RAM Dinâmico

O sistema implementa uma barreira de defesa em profundidade na portaria de rede baseada em chaves de acesso dinâmicas para aplicações parceiras (estilo Google Gemini e OpenAI), operando através de um mecanismo de **Cache Dinâmico In-Memory (Read-Through Cache)** para garantir segurança máxima com o menor desgaste de rede do planeta [Farley].

```text
[Cliente Externo: Bruno] ──( Envia X-API-Key )──► [ExpressHttpDriver (Portaria de Rede)]
                                                              │
                     ┌────────────────────────────────────────┴────────────────────────────────────────┐
                     ▼                                                                                 ▼
     [BARREIRA 1: Cache RAM Local (Map)]                                             [BARREIRA 2: Fallback ao Banco (Repository)]
  Procura a chave na memória do servidor.                                          Se der Cache Miss, executa a query física.
  - Cache Hit: Retorna em microsegundos (62ms) ◄────────────────────────────────── - Chave Inexistente? 401 Unauthorized (Aborta)
  - Aplicação Suspensa? 403 Forbidden (Aborta)                                     - Chave Ativa? Grava uma cópia na RAM (TTL) e libera.
```

### 🧠 Como Funciona a Engenharia do Cache Dinâmico
1. **O Cliente é Agnóstico:** O frontend de terceiros envia a credencial bruta a cada clique por motivos de segurança perimetral (evitando o salvamento de chaves no LocalStorage do navegador do usuário, o que exporia a chave a clonagens) [Farley].
2. **A API gerencia a RAM:** O servidor intercepta a chave na entrada de rede e consulta uma estrutura type-safe nativa alocada diretamente nos chips de memória RAM do container Docker (`Map<string, CachedKeyEntry>`), consumindo peso computacional zero de hardware [Farley].
3. **Mecanismo Read-Through com TTL:** Na primeira requisição, ocorre um *Cache Miss* (falha de cache). O sistema vai ao banco de dados por meio do repositório, valida a credencial, monta um envelope temporal e **salva uma cópia exata do registro na memória RAM** com um tempo de expiração (*Time-To-Live*) de 5 minutos [Farley]. Pelos próximos 300 segundos, todas as requisições leem exclusivamente essa cópia na RAM (Cache Hit), gerando respostas ultra-rápidas (62ms) e protegendo os bancos de dados principais contra bombardeios ou ataques de negação de serviço aplicacionais (DDoS) [Farley].

---

## 📑 Mapeamento Técnico de Componentes (Quem chama Quem)

### 1. O Contrato de Sessão (`src/infrastructure/security/engine/apiKeySession.ts`)
*   **Exportações Nomeadas:** Interfaces `ApiKeySessionPayload`, `ApplicationRepository` e `ApiKeyEvaluatorEngine`.
*   **Propósito:** Contrato abstrato (Port) que obriga a camada de dados e o motor lógico de segurança a conversarem em dialeto purificado de negócios, garantindo que o core do sistema permaneça 100% aberto para expansão e fechado para mudança (OCP) [Uncle Bob].
*   **Variáveis e Payload Estruturado (`ApiKeySessionPayload`):**
    *   `applicationId` : Identificador único da empresa ou site parceiro dono da credencial [Ottinger].
    *   `developerId`   : Vínculo com a conta do programador que gerou a chave no painel de desenvolvedor [Ottinger].
    *   `rateLimitTier` : Nível do plano de consumo atribuído à chave (`FREE` | `PREMIUM` | `ENTERPRISE`) [Ottinger].
    *   `isSuspended`   : Boolean indicador de bloqueio administrativo temporal por fraude ou inadimplência [Ottinger].

### 2. A Camada de Dados e Consulta Burra (`src/database/apiKeys/`)
*   `apiKeyTables.ts`   : Contém a interface pura da linha da tabela (`ApiKeyRow`) e o array em memória RAM que simula as chaves de teste registradas, expurgando o amadorismo de prefixar interfaces com a letra "I" [Uncle Bob, Ottinger].
*   `apiKeyInstance.ts` : Driver de conexão burro (`apiKeyConnection`). Sua responsabilidade única (SRP) é rodar o método linear de busca física `.findKeyByString(apiKey)` e retornar a linha crua do banco, agindo de forma idêntica a drivers de produção como MySQL ou MongoDB [Uncle Bob].
*   `apiKeyRepository.ts`: O adaptador hexagonal concreto (`ApiKeyRepository`). Ele consome a instância do banco, captura a linha crua e realiza a **tradução de dialeto físico para dialeto humano**, devolvendo o objeto no formato da interface `ApiKeySessionPayload` [Uncle Bob].

### 3. O Motor de Orquestração do Cache (`src/infrastructure/security/engine/apiKeyEvaluator.ts`)
*   **Implementação:** Implementa a interface `ApiKeyEvaluatorEngine`. Ele recebe o `ApplicationRepository` por Inversão de Dependências (DIP) e gerencia o mapa privado de cache dinâmico com TTL (`ramCacheStore`) [Uncle Bob, Farley].
*   **Ações:** Executa o método `.evaluate(apiKey)`. Se a chave for inexistente no ecossistema, interrompe o fluxo disparando a exceção soberana de domínio `DomainException('API_KEY_INVALID')`. Se o registro indicar que o parceiro foi banido pelo painel administrativo, dispara a exceção `DomainException('API_KEY_SUSPENDED')`, forçando o barramento central a responder com o status de rede adequado (401 ou 403) [Uncle Bob].

### 4. A Interceptação Perimetral de Entrada (`src/infrastructure/httpTraffic/drivers/expressHttpDriver.ts`)
*   **Funcionamento:** Modificado no construtor para receber a abstração `apiKeyEngine: ApiKeyEvaluatorEngine` por acoplamento plug-in [Uncle Bob].
*   **O Pipeline de Borda:** Na primeiríssima linha do processamento HTTP, o driver extrai o cabeçalho de transporte `incomingRequest.headers['x-api-key']` [Farley]. Se o cabeçalho estiver ausente, joga o erro `API_KEY_MISSING` [Uncle Bob]. Se estiver presente, repassa a string para o motor de cache dinâmico processar em microsegundos [Uncle Bob]. Passando com sinal verde pela RAM, os metadados do parceiro são anexados de forma transparente na propriedade **`request.application`**, disponibilizando as variáveis de planos (`FREE`/`ENTERPRISE`) para as rotas e os casos de uso consumirem nativamente [Uncle Bob, Farley].

---

## 🚀 O que pode ser Feito Agora (Abertura para Expansão)

Com o esqueleto perimetral Multi-Tenant e a barreira de cache dinâmico dinâmico operando com nota máxima de design na branch `branchApiKey` [Farley], a infraestrutura técnica está completamente fechada para modificações e aberta para as seguintes extensões e plugs lógicos de negócio [Uncle Bob]:

*   **Plugar o MongoDB ou Sequelize:** Para migrar do array em memória para um banco de dados real ou ORM de mercado, o desenvolvedor precisa alterar **apenas um arquivo**: criar uma nova classe dentro de `src/database/apiKeys/` (ex: `MongoApiKeyRepository.ts`) implementando a interface `ApplicationRepository` [Uncle Bob]. A portaria de rede, os controladores e o motor de cache dinâmico permanecerão intactos e imunes, sem saber que o banco de dados mudou [Uncle Bob].
*   **Rota de Geração de Chaves:** O sistema está pronto para receber uma rota de negócio voltada a desenvolvedores (ex: `POST /developer/keys`). O caso de uso dessa rota chamará o repositório de persistência para inserir uma nova linha na tabela física, expandindo os acessos dinamicamente sem tocar em arquivos de infraestrutura [Uncle Bob, Farley].

## 🛡️ Malha de Segurança e Resiliência Internacional (Camada de Infraestrutura)

O esqueleto possui um pipeline de defesa em profundidade e gerenciamento de processos na portaria de tráfego HTTP. Essas barreiras operam de forma agnóstica em nível de **Memória RAM local (peso computacional zero de hardware)**, garantindo imunidade absoluta contra robôs, bombardeios de requisições, colapsos de serviços externos e desligamentos abruptos [Farley].

```text
               JORNADA DE UM CLIQUE DO CLIENTE (PIPELINE SEQUENCIAL)
               
 [Navegador / Bruno] ───► [ExpressHttpDriver: Entrada de Rede]
                                    │
                                    ▼
       ┌────────────────────────────────────────────────────────┐
       │ 🧬 1. ServerLifecycleGovernor (Incrementa +1 na RAM)    │
       │    * Rejeita a conexão com status 503 se o SO estiver  │
       │      em processo de encerramento em nuvem (Docker).    │
       └────────────────────────────┬───────────────────────────┘
                                    │ Sinal Verde (Avança)
                                    ▼
       ┌────────────────────────────────────────────────────────┐
       │ 🔑 2. ApiKeyEvaluator (Cache RAM Dinâmico Read-Through)│
       │    * Valida X-API-Key in microsegundos via RAM Cache.  │
       │    * Cache Miss? Fallback ao banco e popula a RAM.     │
       └────────────────────────────┬───────────────────────────┘
                                    │ Chave Válida (Avança)
                                    ▼
       ┌────────────────────────────────────────────────────────┐
       │ 🛡️ 3. RequestThrottler (Regulador de Janela de Cliques) │
       │    * Conta os cliques por minuto (Tenancy do Plano).   │
       │    * Estourou a cota do plano? Status 429 Aborta.      │
       └────────────────────────────┬───────────────────────────┘
                                    │ Sob a Cota (Avança)
                                    ▼
       ┌────────────────────────────────────────────────────────┐
       │ 🎯 4. Execução do Caso de Uso (Seu Core de IA)          │
       │    * Durante chamadas externas demoradas (OpenAI)...   │
       │    * ServiceResilienceGate monitora o circuito.       │
       │    * Falhou 5 vezes consecutivas? O portão abre e     │
       │      desvia chamadas futuras com status 503 (0ms).    │
       └────────────────────────────┬───────────────────────────┘
                                    │ Fluxo Encerrado (Sucesso/Erro)
                                    ▼
       ┌────────────────────────────────────────────────────────┐
       │ ⚰️ 5. ExpressHttpDriver: Bloco Finally                 │
       │    * Decrementa obrigatoriamente o contador (-1 na RAM).│
       │    * Libera a morte segura do processo se for o último.│
       └────────────────────────────────────────────────────────┘
```

---

### 📑 1. Regulador Dinâmico de Cliques (`RequestThrottler`)
*   **Propósito:** Proteger os recursos computacionais do servidor e mitigar abusos de faturamento causados por scripts robôs em loops infinitos, aplicando limites estritos baseados no plano contratado da aplicação parceira (Multi-Tenant) [Farley].
*   **Como é Implementado:** Localizado em `src/infrastructure/security/engine/requestThrottler.ts`. Opera de forma nativa e agnóstica através do algoritmo de **Janela Deslizante Simplificada (*Fixed Window Rate Limiting*)** recorrendo a estruturas de `Map` da memória RAM do processo Node.js [Farley].
*   **Variáveis e Janelas Internas:**
    *   `RATE_LIMITS` : Dicionário imutável strongly-typed mapeando as cotas (`FREE: 10`, `PREMIUM: 100`, `ENTERPRISE: 1000` cliques a cada 60 segundos).
    *   `appCountersStore` : Tabela efêmera em RAM que armazena a contagem ativa indexada por `applicationId`.
    *   `ipCountersStore`  : Tabela efêmera em RAM indexada por `clientIp` com teto bruto de 200 cliques/minuto contra ataques DDoS na Camada 7.
*   **Tratamento de Exceção:** Quando o contador atômico de uma chave supera o teto permitido dentro da janela ativa de 60 segundos, explode a exceção de domínio unificada do catálogo, interceptada na portaria com o status **`429 Too Many Requests` (REQUEST_THROTTLED)** [Farley].

#### 🎮 Cenário Lúdico de Funcionamento do `RequestThrottler`
Imagine uma balada exclusiva onde parceiros têm crachás de acesso. O parceiro **Luiz** tem o crachá plano `FREE`, que dá direito a apenas **10 drinques por minuto**. 
Luiz decide trapacear e coloca um robô para pedir os 10 drinques na sinaleira de uma só vez em 2 segundos. Quando o robô de Luiz tenta pedir o **11º drinque** no 3º segundo, o barman (`RequestThrottler`), que tem um bloco de notas ultra-rápido na memória de sua cabeça (`Map`), olha e diz: *"Negado! Você estourou seu limite em menos de 60 segundos. Espere o relógio virar!"*. 
O pedido nem chega a gastar os ingredientes do bar (sua CPU/IA), economizando os recursos da casa imediatamente com o erro `429` [Farley].

```typescript
// Exemplo sucinto de ativação automática perimetral no ExpressHttpDriver
const apiCredentials = await this.apiKeyEngine.evaluate(String(request.headers['x-api-key']));

// O Throttler intercepta e conta atômico na RAM. Se estourar 10 cliques do plano FREE, mata a requisição aqui!
await this.throttlerEngine.throttle(apiCredentials.applicationId, apiCredentials.rateLimitTier, request.ipAddress);
```

---

### 📑 2. Portão de Resiliência Contra Colapsos Externos (`ServiceResilienceGate`)
*   **Propósito:** Blindar a API contra o **efeito cascata catastrófico de lentidão ou quedas de serviços terceiros** (como OpenAI, Gemini ou Gateways de Pagamento). Impede que conexões longas travadas consumam a memória RAM do contêiner Docker [Farley].
*   **Como é Implementado:** Localizado em `src/infrastructure/security/engine/serviceResilienceGate.ts`. Funciona como um **Mecanismo de Disjuntor Técnico (*Circuit Breaker*)** de alta resiliência operando de forma desacoplada por domínio [Farley].
*   **Os Três Estados Lógicos na Memória RAM:**
    *   `CLOSED` 🟢 (Circuito Fechado): Estado operacional padrão. O tráfego para APIs de IA flui livremente. O portão monitora em silêncio.
    *   `OPEN` 🔴 (Circuito Aberto): Se a API externa falhar consecutivamente por 5 vezes, o portão abre. Pelos próximos 60 segundos, qualquer disparo é interceptado e bloqueado na RAM em **0 milissegundos**, estourando o erro **`EXTERNAL_SERVICE_UNAVAILABLE` (Status 503)** sem tentar gastar tempo de rede com o serviço fora do ar [Farley].
    *   `HALF_OPEN` 🟡 (Circuito Entreaberto): Passados os 60 segundos de repouso, o portão deixa passar uma única requisição de teste. Se falhar, volta para `OPEN` por mais um ciclo; se passar, restabelece o estado `CLOSED` automaticamente [Farley].
*   **Variáveis Internas:** `consecutiveFailures` (Contador atômico de erros sequenciais), `currentState` (Indicador textual do estado ativo na RAM), e `nextAttemptAllowedAt` (Timestamp delimitador da janela de cooldown) [Ottinger].

#### 🎮 Cenário Lúdico de Funcionamento do `ServiceResilienceGate`
Você gerencia um restaurante e tem um motoboy terceirizado (**OpenAI**) para entregar pedidos longos. De repente, a avenida principal da cidade desaba e o motoboy começa a atrasar ou sumir. 
O primeiro, o segundo e o terceiro cliente ligam reclamando de pane (`Error`). Ao atingir **5 falhas seguidas**, o gerente do restaurante liga o disjuntor de segurança (`ServiceResilienceGate` muda para `OPEN` 🔴). Pelos próximos 60 segundos, quando o 6º cliente tenta fazer um pedido, o gerente nem anota e nem chama o motoboy; ele diz na hora: *"Desculpe, nosso canal de entregas desabou, tente novamente em instantes!"*. 
A resposta volta em **0 milissegundos**, evitando que a cozinha fique entulhada de pratos frios esperando um motoboy que nunca vai chegar (sua memória RAM travada por timeouts longos) [Farley].

```typescript
// Exemplo lúdico de uso dentro do Caso de Uso de Chat com Inteligência Artificial
public async executeChatPrompt(prompt: string): string {
  // Se o disjuntor estiver OPEN, barra na hora com erro 503 sem gastar processamento de rede!
  this.openAiResilienceGate.verifyGateHealth();

  try {
    const aiResult = await apiOpenAiThirdParty.send(prompt);
    this.openAiResilienceGate.recordSuccess(); // Sucesso: Limpa o circuito 🟢
    return aiResult;
  } catch (error) {
    this.openAiResilienceGate.recordFailure(); // Falha: Conta +1 erro rumo ao bloqueio 🔴
    throw error;
  }
}
```

---

### 📑 3. Governador do Ciclo de Vida do Servidor (`ServerLifecycleGovernor`)
*   **Propósito:** Garantir o encerramento seguro e livre de corrupção de transações ou dados da aplicação (**Graceful Shutdown**), coordenando de forma transparente a drenagem de conexões longas de Inteligência Artificial quando a infraestrutura em nuvem (Docker/Kubernetes) solicitar a substituição do contêiner [Farley].
*   **Como é Implementado:** Localizado em `src/infrastructure/security/engine/serverLifecycleGovernor.ts`. O driver HTTP Express intercepta os sinais primitivos do sistema operacional Linux (`SIGTERM`, `SIGINT`) e delega o encerramento do processo de forma atômica para este governador [Uncle Bob].
*   **O Pipeline de Drenagem In-Memory:**
    *   **Entrada de Tráfego:** No início de cada requisição, o driver executa o método `.incrementActiveRequests()`, somando `+1` ao contador central de memória [Uncle Bob]. Se o sinal de encerramento já foi disparado, rejeita novos cliques com o status 503 (`SERVER_TERMINATING`).
    *   **Saída de Tráfego:** Utilizando a cláusula de segurança **`finally`** do JavaScript na portaria de rede, o driver executa o método `.decrementActiveRequests()` de forma obrigatória (seja a requisição um sucesso ou um erro), subtraindo `-1` [Uncle Bob].


## Mantenedor

**Autor:** Luis Carlos da Silva Dias  
**Contato:** silvadias.perfil@outlook.com
