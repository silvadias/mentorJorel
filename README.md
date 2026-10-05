# TypeScript API Boilerplate — Hexagonal Pluggable Adapter Engine

Este projeto serve como um template (boilerplate) arquitetural de altíssimo nível, focado em **portabilidade absoluta** e **resiliência**. A engenharia do sistema rompe com o acoplamento tradicional a frameworks de mercado e adota o padrão **Adapter (Ports & Adapters)** combinado com **Feature-by-Package**, isolando 100% as regras de negócio e o ecossistema de erros contra tecnologias descartáveis de transporte de rede (Express, Fastify, Next.js ou motores PHP/Fantasy).

---

## 🏗️ Macro-Arquitetura e Engenharia do Sistema

A estrutura de diretórios prioriza o Princípio da Inversão de Dependências (**DIP**). O coração da aplicação (regras de domínio e controladores) manipula dados purificados em tempo de design, enquanto as ferramentas de terceiros e infraestruturas físicas ficam trancadas e isoladas em adaptadores periféricos.

### Estrutura do Escopo Técnico

```text
src/
├── api/                       # Camada de Negócio Pura (Feature-by-Package)
│   ├── errors/                # Ecossistema Inteligente de Falhas Granulares
│   │   ├── domain/            # Dicionários litéricos de erros por domínio (home, users)
│   │   ├── catalog.ts         # Agregador estático unificado (`as const`) para autocomplete
│   │   └── registry.ts        # Centralizador de módulos de erro expostos
│   ├── home/                  # Domínio de Diagnóstico (Testes de Resiliência de Erros)
│   │   ├── controller.ts      # Controlador agnóstico com rotas de simulação de falhas
│   │   └── routes.ts          # Registrador autônomo de rotas no motor abstrato
│   └── users/                 # Domínio de Usuários
│       ├── controller.ts      # Controlador puro livre de assinaturas HTTP nativas
│       ├── model.ts           # Entidade e persistência mockada isolada
│       └── routes.ts          # Inicializador agnóstico do pacote de usuários
├── config/                    # Configurações mundiais fortemente tipadas (env.ts)
├── database/                  # Detalhes tecnológicos de persistência relacional/física
└── infrastructure/            # Camada de Infraestrutura Isolada (O Coração do Adapter)
    └── httpTraffic/           # Contexto delimitado de tráfego de rede
        ├── drivers/           # Motores tecnológicos descartáveis e substituíveis
        │   └── expressHttpDriver.ts  # Detalhe do Express: implementa o motor e intercepta erros
        └── engine/            # Regras lógicas e contratos imutáveis da aplicação
            ├── context.ts     # Especificação tipada do fluxo (Payload, Request, Response)
            ├── errors.ts      # A classe de exceção pura 'DomainException' e contratos de payloads
            └── failureFormatter.ts  # Interceptador inteligente agnóstico de falhas brutas
├── apiRouter.ts               # Orquestrador agnóstico central de módulos da raiz
└── server.ts                  # Raiz de Composição (Composition Root): ativa o driver e inicia o processo
```

---

## ⚙️ Padrões de Desenvolvimento & Convenções Estritas

Para preservar a imunidade arquitetural do template à medida que o sistema expande, siga rigorosamente as diretrizes estabelecidas pela banca examinadora:

### 1. Padrão de Exportação e Importação (Imports)
Todos os arquivos devem utilizar exportações nomeadas corporativas. O padrão de importação de contratos abstratos deve usar explicitamente a palavra-chave `import type` para otimizar a transpilação e evitar vazamento de dependências executáveis em tempo de execução:

```typescript
// Correto: Inversão de Dependência com Type Safety
import type { HttpTrafficRequest } from '../../infrastructure/httpTraffic/engine/context';
```

### 2. Isolamento de Frameworks (Tolerância Zero)
Os controladores e rotas de domínio **são terminantemente proibidos** de importar assinaturas do Express (como `Request`, `Response` ou objetos `Router`). Eles recebem estruturas limpas (`HttpTrafficRequest`) e respondem devolvendo estruturas de dados puras (`HttpTrafficResponse`). O framework HTTP é apenas um detalhe invisível de infraestrutura.

### 3. Engenharia de Erros com Propósito Revelado
A aplicação possui um **Adapter de Erros Inteligente**. Não utilize middlewares interceptadores específicos de ferramentas terceiras. Quando uma falha de negócio ocorre, dispara-se a exceção pura de domínio informando a chave literal do catálogo para autocomplete:

```typescript
throw new DomainException("STUDENT_NOT_FOUND");
```
O próprio driver ativo se encarrega de capturar a exceção e usar o `ApplicationFailureFormatter` de forma automatizada para desenhar a saída e injetar o código de status correto no cabeçalho HTTP, eliminando completamente blocos `try/catch` genéricos de controle de fluxo nos controladores.

---

## 🚀 Como Usar este Boilerplate para Iniciar Novos Projetos

Este molde foi desenhado para escalabilidade e reaproveitamento imediato em qualquer ecossistema de microsserviços.

1. Duplique o arquivo `example.env` para `.env` e configure suas variáveis locais.
2. Duplique o arquivo `example.gitignore` para `.gitignore` para proteger seu repositório contra binários locais.
3. Crie suas novas pastas de domínio autocontidas dentro de `src/api/` (ex: `src/api/products/`).
4. Desenvolva o controlador e utilize a função de inicialização agnóstica para plugar as novas rotas no motor abstrato.
5. Registre a função de inicialização do seu novo pacote no orquestrador central da raiz (`src/apiRouter.ts`).

---
### 🛠️ Mantenedor e Suporte Técnico
* **Autor:** Luis Carlos da Silva Dias
* **Contato ** silvadias.perfil@outlook.com

