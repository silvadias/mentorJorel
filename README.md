# TypeScript API Boilerplate — Hexagonal Pluggable Adapter Engine

Este projeto serve como um template (boilerplate) arquitetural de altíssimo nível, focado em **portabilidade absoluta**, **observabilidade avançada** e **resiliência**. A engenharia do sistema rompe com o acoplamento tradicional a frameworks de mercado e adota o padrão **Adapter (Ports & Adapters)** combinado com **Feature-by-Package**, isolando 100% as regras de negócio contra tecnologias descartáveis de transporte de rede (Express, Fastify, Next.js) e ferramentas acopladas de logging.

---

## 🏗️ Macro-Arquitetura e Engenharia do Sistema

A estrutura de diretórios prioriza o Princípio da Inversão de Dependências (**DIP**). O coração da aplicação (regras de domínio e controladores) manipula dados purificados em tempo de design, enquanto as ferramentas de terceiros e infraestruturas físicas (rede, telemetria) ficam trancadas e isoladas em adaptadores periféricos e intercambiáveis.

### Estrutura do Escopo Técnico

```text
src/
├── api/                       # Camada de Negócio Pura (Feature-by-Package)
│   ├── errors/                # Ecossistema Inteligente de Falhas Granulares
│   │   ├── domain/            # Dicionários literais de erros por domínio (home, users)
│   │   ├── catalog.ts         # Agregador estático unificado (`as const`) para autocomplete
│   │   └── registry.ts        # Centralizador de módulos de erro expostos
│   ├── home/                  # Domínio de Diagnóstico (Testes de Resiliência de Erros)
│   │   ├── controller.ts      # Controlador agnóstico integrado à telemetria injetada
│   │   └── routes.ts          # Registrador autônomo de rotas no motor abstrato
│   └── users/                 # Domínio de Usuários
│       ├── controller.ts      # Controlador puro livre de assinaturas HTTP nativas
│       ├── model.ts           # Entidade e persistência mockada isolada
│       └── routes.ts          # Inicializador agnóstico do pacote de usuários
├── config/                    # Configurações mundiais fortemente tipadas (env.ts)
├── database/                  # Detalhes tecnológicos de persistência relacional/física
└── infrastructure/            # Camada de Infraestrutura Isolada (O Coração do Adapter)
    ├── telemetry/             # Contexto de Observabilidade e Auditoria do Sistema
    │   ├── drivers/           # Emissores de fluxos físicos estruturados
    │   │   └── systemConsoleJsonDriver.ts # Driver de Produção JSON com Pretty Print adaptável para Dev
    │   └── engine/            # Contratos de telemetria e gerenciamento de escopos
    │       └── context.ts     # Abstração de assinaturas e metadados lógicos do SystemLogger
    └── httpTraffic/           # Contexto delimitado de tráfego de rede
        ├── drivers/           # Motores tecnológicos descartáveis e substituíveis
        │   └── nodeExpress/   # Micro-ecossistema autocontido do driver de rede (CCP)
        │       └── expressHttpDriver.ts # Detalhe do Express: intercepta tráfego e injeta Trace ID
        └── engine/            # Regras lógicas e contratos imutáveis da aplicação
            ├── context.ts     # Especificação tipada do fluxo (Payload, Request, Response, Logger)
            ├── errors.ts      # A classe de exceção pura 'DomainException' e contratos de payloads
            └── failureFormatter.ts # Interceptador inteligente agnóstico de falhas brutas
├── apiRouter.ts               # Orquestrador agnóstico central de módulos da raiz
└── server.ts                  # Raiz de Composição (Composition Root): ativa o driver e inicia o processo
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

### 3. Telemetria Estruturada com Rastreabilidade (Trace ID)
O objeto global `console.log()` é banido do core de negócios. Toda ação emite telemetria através do barramento agnóstico injetado na requisição (`request.logger`).
* **Trace ID Automático:** Cada ciclo de requisição ganha um identificador único exclusivo que viaja por todo o sistema.
* ** JSON Camaleônico:** Em produção, os logs são emitidos em JSON de linha única compilado, ideais para ferramentas como Datadog ou Elasticsearch. Em desenvolvimento local, o sistema ativa o *Pretty Format* isolando e destacando as `[Stack Trace]` em vermelho para alta legibilidade humana.

### 4. Engenharia de Erros com Propósito Revelado
A aplicação possui um **Adapter de Erros Inteligente**. Não utilize middlewares interceptadores específicos de ferramentas terceiras. Quando uma falha de negócio ocorre, dispara-se a exceção pura de domínio informando a chave literal do catálogo para autocomplete:

```typescript
throw new DomainException("STUDENT_NOT_FOUND");
```
O próprio driver ativo se encarrega de capturar a exceção e usar o `ApplicationFailureFormatter` de forma automatizada para desenhar a saída e injetar o código de status correto no cabeçalho HTTP, eliminando completamente blocos `try/catch` genéricos de controle de fluxo nos controladores.

---

## 🚀 Como Usar este Boilerplate para Iniciar Novos Projetos

Este molde foi desenhado para escalabilidade e reaproveitamento imediato em qualquer ecossistema de microsserviços.

1. Configure as variáveis locais no arquivo `.env` da raiz baseado nas chaves contidas em `src/config/env.ts`.
2. Para alternar dinamicamente o comportamento de formatação dos logs em desenvolvimento assistido, altere a flag `NODE_ENV` entre `development` e `production` e reinicie rapidamente o contêiner Docker para sincronizar o cache de variáveis do Linux.
3. Crie suas novas pastas de domínio autocontidas dentro de `src/api/` (ex: `src/api/products/`).
4. Desenvolva o controlador e utilize a função de inicialização agnóstica para plugar as novas rotas no motor abstrato.
5. Registre a função de inicialização do seu novo pacote no orquestrador central da raiz (`src/apiRouter.ts`).

---
### 🛠️ Mantenedor e Suporte Técnico
* **Autor:** Luis Carlos da Silva Dias
* **Contato:** silvadias.perfil@outlook.com