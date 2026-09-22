# 🎯 Prompt de Contexto Mestre - SaaS de Aprendizagem Coletiva e Memorização Ativa

Por favor, leia atentamente as instruções abaixo para assumir o desenvolvimento do nosso software. Não escreva nenhum código ainda. O seu papel agora é analisar o modelo de negócios, validar a experiência do usuário (UX) e garantir que não existam lacunas nos cenários antes de passarmos para a engenharia de software.

## 🎯 1. O Que Estamos Desenvolvendo
Estamos criando um SaaS de Aprendizagem Coletiva e Memorização Ativa Híbrida (IA + Humanos) focado em alta performance. O sistema adota a filosofia de PLG (Product-Led Growth) com uma interface em tela única estilo "VS Code" (Single Page Application), ultra-leve, reativa e sem telas de navegação institucionais. Ele atende a três grandes nichos de forma flexível: Concursos Públicos (ex: EBSERH), Reforço Escolar/Acadêmico e Capacitação Profissional (ex: Eletricista, programador Clean Code).

## 🧱 2. Metodologia de Trabalho (Regra Estrita)
Estamos utilizando estritamente o DDD (Domain-Driven Design) e o BDD (Behavior-Driven Development) para mapear o comportamento humano e as regras de negócio ANTES de escrever qualquer linha de código.
* **Regra de Ouro:** Você deve avançar estritamente parte a parte. Não gere códigos, Dockerfiles ou Schemas de banco de dados sem que a etapa anterior de comportamento esteja validada e sem que eu autorize explicitamente.

## ⚙️ 3. Restrições e Decisões de Arquitetura Técnica
* **Tecnologias Básicas:** Node.js, Express, SDK Oficial da Google (`@google/genai` utilizando modelos `gemini-2.5-flash` ou `gemini-2.5-pro`).
* **Estrutura de Dados Desacoplada (Sem DB Relacional de Conteúdo):** O conhecimento teórico e as disciplinas residem nativamente na IA. O sistema local gerencia apenas um arquivo enxuto `templates.json` que atua como **Moldagem de Prompt (Prompt Engineering)**. Os caminhos/rotas do front-end são baseados em IDs estáticos (ex: `portugues_crase`).
* **Abordagem de Desenvolvimento:** Metodologia estrita baseada em **DDD**, **BDD** e código guiado por testes (**TDD**). Não se deve gerar código prematuro sem validação comportamental prévia.

## 📋 4. Escopo Consolidado das Fases e Cenários de Negócio (Histórico do Projeto)

### 🚀 FASE 1: Introdução Instantânea e Acessibilidade (Degustação Anônima)
* **Cenário 1 (Entrada sem Atrito):** Identificação silenciosa via `Device Fingerprint` no Express, gerando um usuário com status `"ANONYMOUS"`. Exibe botão inicial de ativação do Mentor IA devido às travas de autoplay de áudio dos navegadores.
* **Cenário 2 (Permissão de Áudio Negada):** Se o microfone/áudio for negado, o front-end envia um sinal ao Express. O Mentor adapta o prompt para o modo puramente escrito e avisa ao usuário como reverter isso no painel de configurações.
* **Cenário 3 (Reconhecimento de Retorno):** No segundo acesso da mesma máquina anônima, o sistema incrementa o contador. O Mentor saúda amigavelmente reconhecendo o retorno de forma profissional e sincera, e abre a tela estilo VS Code com 3 abas de matérias de degustação já abertas por padrão.

### 🧱 FASE 2: Motor de Treinamento Adaptativo (Nós Folha)
* **Comportamento do Treinador Hardcore:** A IA atua de forma estritamente profissional e sincera (sem gentileza excessiva). Avalia as respostas discursivas fornecidas de forma livre pelo aluno.
* **Saída Estruturada:** O Gemini é forçado via `responseSchema` a responder estritamente in formato JSON contendo as chaves `feedback` (curto e sincero sobre os erros) e `proxima_pergunta`.
* **Retenção Espaçada:** O sistema adota a **Curva de Esquecimento de Ebbinghaus** (revisões cíclicas baseadas em horas, dias, semanas, meses, de 6 em 6 meses) avaliando a evolução técnica do usuário pelo histórico.
* **Trava de Foco:** Se o usuário tentar fugir do assunto da aba ativada, a IA emite uma advertência rígida e exige que o assunto seja esgotado antes de mudar o tópico. Ao atingir a proficiência, a IA dispara gatilhos para que o usuário crie resumos próprios ou avance para a Sala Virtual.

### 🎭 FASE 3: Arena de Palestras Híbrida e Inteligência Coletiva
* **Mecânica Coletiva Síncrona:** O palestrante agenda uma apresentação (imediata ou com horário marcado) sobre um assunto. O Express identifica quem possui essa matéria na sua "Sacola de Estudos" e dispara notificações via WebSockets para outros alunos entrarem como oponentes provocadores.
* **Composição da Arena:** A sala simula assentos físicos ocupados por humanos. Caso falte quórum, o Express preenche as cadeiras restantes com **Bots de IA com personas distintas** (um ouvinte cético/leigo e um examinador técnico agressivo que faz interrupções cirúrgicas).
* **Supervisão do Mediador de IA:** Um agente autônomo escuta e analisa todo o fluxo. Atua em tempo real como moderador comportamental, bloqueando tons arrogantes ou ofensivos de humanos ou bots. Ao final, gera um **Relatório Sincero** fatiado in JSON com: `vicios_linguagem`, `tom_e_postura` e `precisao_conceitual`.

---

## 🚀 Suas Instruções para Iniciar esta Conversa:
Agora que você absorveu todo o escopo do projeto, faça o seguinte:
1. Analise criticamente todas as fases do funil, as dinâmicas de voz da IA, a gamificação por pontos e o funcionamento da Sala Virtual (com os bots de perfis diferentes e o Mediador de IA).
2. Questione-me ou aponte se você enxerga alguma lacuna oculta na experiência do usuário (UX), alguma regra de negócio cinzenta ou algo que possa ser melhorado no papel antes de começarmos a engenharia.
3. Apresente suas observações de forma sucinta e direta, e pergunte por qual cenário ou detalhe específico devemos dar prosseguimento.
