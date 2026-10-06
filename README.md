# TypeScript API Boilerplate — Hexagonal Pluggable Adapter Engine

Este projeto serve como um template (boilerplate) arquitetural de altíssimo nível, focado em **portabilidade absoluta**, **observabilidade avançada**, **segurança Zero-Trust** e **resiliência**. A engenharia do sistema rompe com o acoplamento tradicional a frameworks de mercado e adota o padrão **Adapter (Ports & Adapters)** combinado com **Feature-by-Package**, isolando 100% as regras de negócio contra tecnologias descartáveis de transporte de rede (Express, Fastify) e ferramentas acopladas de segurança ou logging.

---

## 🏗️ Macro-Arquitetura e Engenharia do Sistema

A estrutura de diretórios prioriza o Princípio da Inversão de Dependências (**DIP**). O coração da aplicação (regras de domínio e controladores) manipula dados purificados em tempo de design, enquanto as ferramentas de terceiros e infraestruturas físicas (rede, telemetria, criptografia e autorização) ficam trancadas e isoladas em adaptadores periféricos e intercambiáveis.

### Estrutura do Escopo Técnico Real

```text
src/
├── api/                       # Camada de Negócio Pura e Agnóstica (Feature-by-Package)
│   ├── errors/                # Barramento Central de Falhas de Domínio (DRY Absoluto)
│   │   ├── domain/            # Dicionários literais de exceções por contexto (home, users, security)
│   │   └── catalog.ts         # PONTO ÚNICO DE VERDADE MUNDIAL: Catálogo e ErrorCode unificados
│   ├── home/                  # Domínio de Diagnóstico de Saúde do Sistema
│   │   ├── controller.ts      # Controlador agnóstico integrado à telemetria injetada
│   │   └── routes.ts          # Registrador autônomo de rotas no motor abstrato
│   └── users/                 # Domínio de Usuários
│       ├── controller.ts      # Controlador limpo livre de assinaturas HTTP nativas
│       ├── model.ts           # Entidade e persistência mockada provisória em memória
│       └── routes.ts          # Rota GET protegida declarativamente via JwtGuard
├── config/                    # Governança de Parâmetros Globais Strongly-Typed
│   └── env.ts                 # Tipagem estrita de propriedades (Dotenv com suporte a runtime do watcher)
└── infrastructure/            # Camada de Periferias e Adaptadores Tecnológicos (Ports & Adapters)
    ├── telemetry/             # Contexto Delimitado de Observabilidade e Auditoria
    │   ├── drivers/           # Emissores de fluxos físicos estruturados
    │   │   └── systemConsoleJsonDriver.ts # Formata JSON: compactado para Produção / Pretty-Print para Dev
    │   └── engine/            # Contratos de Telemetria (Ports)
    │       └── context.ts     # Interface SystemLogger (info, warn, error, audit com suporte a Trace ID)
    ├── httpTraffic/           # Contexto Delimitado de Tráfego de Redes
    │   ├── drivers/           # Motores Tecnológicos Descartáveis e Substituíveis
    │   │   └── nodeExpress/   # Micro-ecossistema do Driver Express (Princípio CCP)
    │   │       └── expressHttpDriver.ts # Adapta rede, gera Trace ID, injeta Logger e trata erros
    │   └── engine/            # Regras e Contratos de Transporte (Ports)
    │       ├── context.ts     # Interfaces de fluxo purificadas (HttpTrafficRequest/Response)
    │       ├── errors.ts      # DomainException e barramentos de payloads globais
    │       ├── failureFormatter.ts # Tradutor central de falhas com inteligência 422 e 500
    │       └── validator.ts   # Contrato e exceção de validação de contratos de entrada na portaria
    └── security/              # Contexto Delimitado de Segurança, Sessão e Autorização ABAC
        ├── drivers/           # Implementações Concretas e Mocks Tecnológicos (Adapters)
        │   ├── jwt/
        │   │   └── expressJwtAdapter.ts # Criptografia isolada: traduz nomes humanos para dialetos RFC
        │   └── mock/
        │       └── AccessEvaluator.ts   # Simulador de regras de negócio, tempo e hierarquias com auditoria
        └── engine/            # Contratos de Autenticação e Barreiras Agnósticas (Ports)
            ├── accessEvaluator.ts # Abstração para avaliação dinâmica de direitos em tempo de execução
            ├── jwtGuard.ts    # Porteiro de rotas: intercepta, descriptografa e bloqueia acessos de rede
            └── tokenContext.ts # Contrato de token com nomes memoráveis humanos (actorId, deviceFingerprintId)
├── apiRouter.ts               # Orquestrador Agnóstico Central de Módulos (Repassa o JwtGuard por DIP)
└── server.ts                  # Raiz de Composição (Composition Root): Instancia chaves, logs, drivers e bootstrap
```

---

## ⚙️ Padrões de Desenvolvimento & Convenções Estritas

Para preservar a imunidade arquitetural do template à medida que o sistema expande, siga rigorosamente as diretrizes estabelecidas:

### 1. Padrão de Exportação e Importação (Imports)
Todos os arquivos devem utilizar exportações nomeadas corporativas. O padrão de importação de contratos abstratos deve usar explicitamente a palavra-chave `import type` para otimizar a transpilação e evitar vazamento de dependências executáveis em tempo de execução:

```typescript
// Correto: Inversão de Dependência com Type Safety
import type { HttpTrafficRequest } from '../../infrastructure/httpTraffic/engine/context';
```

### 2. Isolamento de Frameworks (Tolerância Zero)
Os controladores e rotas de domínio **são terminantemente proibidos** de importar assinaturas de frameworks de entrega (como Express ou Fastify). Eles recebem estruturas limpas (`HttpTrafficRequest`) e respondem devolvendo estruturas de dados puras (`HttpTrafficResponse`). O framework HTTP é apenas um detalhe invisível de infraestrutura.

### 3. Nomes Memoráveis que Revelam Propósito (Critério Ottinger)
O dialeto interno de bibliotecas de criptografia de terceiros (`sub`, `did`, `jti`, `iat`, `exp`) fica trancado dentro do adaptador (`expressJwtAdapter.ts`). O restante de todo o sistema conversa em linguagem de negócios humana fortemente tipada e memorável:

*   `actorId`: Identificador único do usuário portador.
*   `deviceFingerprintId`: Assinatura digital estável de hardware da máquina do cliente.
*   `tokenUniqueId`: Identificador único do token utilizado contra ataques de repetição e vírus.
*   `issuedAt` / `expiresAt`: Prazos de vigência e morte do passaporte criptográfico.

### 4. Controle de Acesso ABAC & Hierarquia Reversa
O `JwtGuard` atua estritamente como guarda de passaporte. Ele não valida permissões de forma engessada. Ele delega o direito de acesso ao contrato **`AccessEvaluator`** em tempo de execução puro.
*   **Hierarquia Reversa:** Se um nível superior (Diretor/Empresa) revoga um privilégio, o motor calcula em tempo real e bloqueia o acesso na portaria de rede.
*   **Estado Visual ("Meio Apagado"):** Ao bloquear por hierarquia, o sistema injeta o metadado declarativo no corpo da falha 403 (ex: `{ isAvailable: false, disabledBy: "Diretor" }`), permitindo ao frontend renderizar botões ou menus cinzas/bloqueados nativamente.
*   **Não-Repúdio:** Toda e qualquer avaliação de segurança dispara um log de auditoria estruturado imutável, impossibilitando que qualquer ator negue a ação realizada.

### 5. Telemetria Estruturada com Rastreabilidade (Trace ID)
O objeto global `console.log()` é banido do core de negócios. Toda ação emite telemetria através do barramento agnóstico injetado na requisição (`request.logger`).
*   **Trace ID Automático:** Cada ciclo de requisição ganha um identificador único exclusivo que viaja por todo o sistema.
*   **JSON Camaleônico:** Em produção, os logs são emitidos em JSON de linha única compilado, ideais para ferramentas como Datadog ou Elasticsearch. Em desenvolvimento local, o sistema ativa o *Pretty Format* isolando e destacando as `[Stack Trace]` em vermelho para alta legibilidade humana.

### 6. Engenharia de Erros com Propósito Revelado (DRY)
A aplicação possui o arquivo unificado `src/api/errors/catalog.ts` como o **Ponto Único de Verdade** de falhas. Não utilize middlewares interceptadores específicos de ferramentas terceiras. Quando uma falha de negócio ocorre, dispara-se a exceção pura de domínio informando a chave literal do catálogo para autocomplete:

```typescript
throw new DomainException("SECURITY_TOKEN_EXPIRED");
```
O próprio driver ativo se encarrega de capturar a exceção e usar o `ApplicationFailureFormatter` de forma automatizada para desenhar a saída e injetar o código de status correto no cabeçalho HTTP (incluindo erros técnicos `422` de portaria de rede), eliminando completamente blocos `try/catch` genéricos de controle de fluxo nos controladores.

---

## 🚀 Como Usar este Boilerplate para Iniciar Novos Projetos

1. Configure as variáveis locais no arquivo `.env` da raiz baseado nas chaves contidas em `src/config/env.ts`.
2. Para alternar dinamicamente o comportamento de formatação dos logs em desenvolvimento assistido, altere a flag `NODE_ENV` entre `development` e `production` e reinicie rapidamente o contêiner Docker para sincronizar o cache de variáveis do Linux.
3. Crie suas novas pastas de domínio autocontidas dentro de `src/api/` (ex: `src/api/products/`).
4. Desenvolva o controlador e utilize a função de inicialização agnóstica para plugar as novas rotas no motor abstrato.
5. Registre a função de inicialização do seu novo pacote no orquestrador central da raiz (`src/apiRouter.ts`).
6. Para proteger rotas privadas, envolva-as declarativamente no arquivo de rotas do domínio utilizando o método `guard.protect(controller)`.

---
### 🛠️ Mantenedor e Suporte Técnico
* **Autor:** Luis Carlos da Silva Dias
* **Contato:** silvadias.perfil@outlook.com
