# 🏆 Documento de Especificação de Domínio (DDD) e Cenários de Negócio (BDD)
## Projeto: Mentor/Treinador de IA para Aprendizagem Coletiva e Memorização Ativa

---

## 🏛️ 1. Visão Geral do Produto e Estratégia de Negócio
O produto é um SaaS (Software as a Service) focado em aprendizagem acelerada por meio de memorização ativa e inteligência artificial por voz. O modelo comercial adota a estratégia de PLG (Product-Led Growth): o sistema gera valor imediato no primeiro segundo de uso, sem atrito de barreiras cadastrais.

O software adota um modelo de Hub Dinâmico de Trilha Única Acumulável em uma interface de tela única estilo "VS Code" (Single Page Application), ultra-leve e reativa.

O sistema atende a três grandes mercados de educação de forma automatizada:
1. **Concursos Públicos:** Foco em alta performance, bizus, destruição de editais e técnicas para gabaritar bancas.
2. **Reforço Escolar / Acadêmico:** Explicações sucintas, didáticas e diretas para colégio, vestibulares ou faculdade.
3. **Capacitação Profissional de Mercado:** Treinamentos práticos e de qualificação rápida (ex: Eletricista predial, programador focado em Clean Code).

---

## 🧱 2. Arquitetura Lógica de Conteúdo e APIs (Subdomínios DDD)
Para manter o sistema ultra-leve, adota-se um modelo desacoplado de gerenciamento de dados:
* **Biblioteca Global Desacoplada:** O conteúdo é cadastrado uma única vez em uma estrutura de árvore (Matéria ➔ Módulo ➔ Tópicos Pais ➔ Tópicos Filhos). O nó folha armazena o texto base de resumo (que alimenta o prompt), player do YouTube e o chat. A IA já possui o conhecimento intrínseco sobre a matéria; as chaves JSON locais funcionam apenas como moldes de prompt (templates) para direcionar a persona e o foco da IA.
* **A Sacola por IDs (O Carrinho):** A trilha de estudos do aluno é apenas uma lista de IDs que apontam para a Biblioteca Global. Quando um concurso surge, o sistema faz uma operação de intersecção de conjuntos e adiciona na "sacola" do aluno apenas as matérias inéditas, acumulando o progresso das matérias de base.

---

## 🖥️ 3. Design de Interface (UX Estilo "VS Code")
* **A Barra Lateral Esquerda Retrátil (O Explorador):** Histórico das últimas 3 aulas visitadas no topo e listagem em cascata das disciplinas e classificações ativas na sacola.
* **O Centro da Tela (As Abas Dinâmicas):** Cada tema clicado abre uma aba no topo. O aluno navega entre elas sem recarregar. A aba ativa divide-se em:
  * *Coluna Esquerda:* Texto base de resumo do edital e player do YouTube carregado via Lazy Loading.
  * *Coluna Direita (Área de Ação):** Caderno de resumos, notas de áudio do aluno e bloco de notas visual para mapas mentais.
* **A Janela Direita ou Inferior (O Painel do Mentor):** Chat vertical persistente inteligente por áudio, texto e legenda para tirar dúvidas ou rodar a Sala Virtual.
* **O Painel de Status de Vendas (Topo Direito):** Nome do plano e status do pagamento (`[ATIVO]`, `[ATRAZADO]`, `[BLOQUEADO]`), gerando gatilho de urgência para upgrades.
* **A Gaveta de Configurações (Menu Oculto):** Desliza sobre a tela isolando suporte, dados da conta e Loja de Recompensas.

---

# 🗺️ 4. Cenários de Comportamento do Usuário (Especificação BDD)

## 🚀 FASE 1: Introdução Instantânea e Acessibilidade (Degustação Anônima)

### Regras de Negócio e Comportamento:
1. **Identificação Silenciosa:** O front-end gera um `Device Fingerprint` único. Se inédito, o Express cria um registro com `status: "ANONYMOUS"` e gera um JWT temporário. Se recorrente, recupera a sacola e o histórico da máquina.
2. **Consentimento de Áudio:** Navegadores bloqueiam autoplay de áudio. A tela exibe um botão "Ativar Treinador IA". O fluxo só começa após o clique.
3. **Tratamento de Permissão Negada:** Se o microfone/áudio for negado, o front envia `audioPermitido: false`. O Gemini adapta a resposta para modo puramente textual e avisa na tela que ele pode mudar isso na Gaveta de Configurações.
4. **Reconhecimento de Retorno:** No segundo acesso da máquina anônima, o Express altera o contador. O Mentor se mostra feliz pelo retorno profissionalmente, avisa honestamente sobre a falta de cadastro completo (máquina compartilhada) e abre o chat livre. A tela carrega com 3 abas padrão pré-abertas no topo.

### Especificação BDD (Gherkin):
```gherkin
# language: pt
Funcionalidade: Degustação Anônima, Acessibilidade e Retorno do Usuário

  Cenário: Primeiro acesso de um usuário anônimo à plataforma com saudação ativa
    Dado que o usuário é novo e acessa a URL principal da plataforma
    Quando a Single Page Application é carregada completamente
    Então o sistema deve gerar um Device Fingerprint único para este navegador
    E deve criar uma conta temporária com status "ANONYMOUS" no sistema
    E deve exibir na tela o botão de inicialização "Ativar Treinador IA"

  Cenário: Primeiro acesso com permissão de áudio ou microfone negada pelo usuário
    Dado que o usuário anônimo acessou a plataforma pela primeira vez
    Quando o navegador bloquear ou o usuário recusar o acesso ao microfone/áudio
    Então o sistema deve desativar o motor de voz do Mentor IA
    E deve renderizar o texto de boas-vindas puramente por escrito na tela
    E o Mentor deve incluir na mensagem: "Notei que seu áudio está desativado. Você pode ativar o modo por voz quando quiser no seu painel de configurações."

  Cenário: Usuário anônimo retorna à plataforma pela segunda vez na mesma máquina
    Dado que o usuário possui um Device Fingerprint já registrado como "ANONYMOUS"
    Quando a Single Page Application é carregada pela segunda vez
    Então o sistema deve abrir a interface estilo "VS Code" com 3 abas de estudo padrão pré-carregadas no topo
    E o Mentor IA deve iniciar uma saudação de retorno dizendo: "Que bom te ver de volta! Como você não tem um cadastro completo, não tenho 100% de certeza se é você mesma nesta máquina, mas estou pronto. O que quer estudar hoje ou qual sua dúvida direta?"
    E deve manter o campo de chat aberto para qualquer pergunta livre do usuário
```

---

## 📈 FASE 2: O Motor de Treinamento Adaptativo nos Nós Folha

### Regras de Negócio e Comportamento:
1. **Ativação por Aba:** Ao selecionar uma aba (ex: Crase), o Express recebe o ID do nó folha (`portugues_crase`), lê o arquivo leve de template/molde do prompt e o injeta na `systemInstruction` da API do Gemini para disparar a primeira pergunta discursiva.
2. **Fluxo Discursivo e Memória:** Não há múltipla escolha (A, B, C). O aluno responde livremente. O Express envia o `historicoChat` completo a cada iteração para manter a memória de curto prazo e evitar redundâncias. O Gemini retorna as chaves estruturadas `feedback` e `proximaPergunta` via `responseSchema`.
3. **Treinador Rígido e Sincero:** O Mentor avalia o desempenho de forma profissional e técnica, calculando o "Nível de Domínio" (Iniciante, Intermediário, Avançado, Mestre). Se o aluno errar ou falhar, a IA é sincera sobre o que ele não dominou.
4. **Trava de Foco:** Se o aluno tentar desviar do assunto da aba ativa (ex: falar de exaustão ou mudar de matéria), o Mentor dá uma advertência de foco, recusa-se a responder ao desvio e exige a resposta da pergunta técnica original.
5. **Repetição Espaçada:** O sistema agenda revisões de retorno espaçado e repetitivo baseados no gráfico da Curva de Esquecimento de Ebbinghaus (intervalos de 6 horas, 24 horas, 7 dias, 30 dias e revisões de 6 em 6 meses), exigindo treinos diários.
6. **Gatilhos do Ecossistema:** 
   * *Se travado:* Sugere assistir a vídeos específicos, mnemônicos, resumos ou músicas engraçadas de outros alunos da comunidade.
   * *Se dominante (3 acertos complexos seguidos):* Computa pontos e sugere criar notas/resumos próprios ou avançar para dar uma palestra focada na Sala Virtual.

### Especificação BDD (Gherkin):
```gherkin
# language: pt
Funcionalidade: Motor de Treinamento Adaptativo, Foco e Revisão Espaçada nos Nós Folha

  Cenário: Aluno tenta desviar do assunto da aba ativa e recebe advertência de foco
    Dado que o Mentor IA fez uma pergunta sobre "Uso da Crase"
    Quando o usuário responde "Estou cansado, quero falar sobre física"
    Então o sistema deve processar a fuga de escopo
    E o Mentor IA deve responder de forma estritamente profissional: "Foco é fundamental para a memorização. Precisamos esgotar este tópico antes de avançar. Responda à questão anterior sobre Crase."
    E deve reapresentar a mesma pergunta de treino

  Cenário: Avaliação sincera de desempenho e cálculo do nível de domínio
    Dado que o aluno respondeu de forma incompleta ou incorreta a um conceito crítico
    Quando a IA analisa a resposta no histórico da sessão
    Então o sistema deve atualizar o nível de domínio do aluno no banco/JSON para aquele tópico
    E o Mentor IA deve emitir um feedback sincero e técnico: "Sua resposta foi fraca no quesito de regência verbal. Você ainda não dominou a fusão da preposição. Seu nível atual neste tópico caiu para Iniciante."
    E deve sugerir: "Recomendo fortemente que você crie suas próprias notas no caderno lateral ou assista ao resumo engraçado criado pela comunidade antes de tentarmos a próxima."

  Cenário: Aluno atinge proficiência após revisões espaçadas e o Treinador sugere o próximo nível
    Dado que o aluno atingiu o nível avançado no tópico após revisões espaçadas de horas e dias
    Quando a IA valida a última rodada de respostas perfeitas
    Então o Mentor IA deve parabenizar profissionalmente o aluno
    E deve sugerir o gatilho de transição: "Você demonstrou domínio teórico. Que tal testar isso na prática agora? Sugiro dar uma palestra focada neste tema. Você pode agendar um horário na Sala Virtual com pessoas reais ou iniciar uma simulação com meus bots agora mesmo."
```

---

## 👥 FASE 3: A Arena de Palestras Híbrida e Inteligência Coletiva

### Regras de Negócio e Comportamento:
1. **Agendamento e Efeito de Rede:** O palestrante determina o assunto (`portugues_crase`) e agenda uma palestra (imediata ou com horário marcado). O Express cruza as "Sacolas de Estudo" e dispara notificações via WebSocket/Push para todos os alunos que tenham interesse na matéria ou disciplinas pai: *"Aluno X vai palestrar sobre Crase. Entre e desafie o conhecimento dele!"*.
2. **Composição de Plateia Mista (Múltiplos Atores):** A interface SPA simula uma arena de cadeiras virtuais. Se houver poucos humanos online, o Express injeta instâncias da API do Gemini com `systemInstruction` de Personas desafiadoras (o Ouvinte Cético/Leigo e o Examinador Técnico/Agressivo) para ocupar os assentos e garantir o quórum de pressão técnica.
3. **Provocações e Moderação Ativa por IA:** Pessoas reais na plateia e os bots de IA usam voz e áudio para provocar e desafiar o nível de conhecimento do palestrante. O fluxo de áudio multicanal é processado em tempo real pelo Express. Se um humano ou bot agir com arrogância, grosseria ou desvio de conduta, o Bot Mediador/Professor intervém imediatamente, atenuando ou cortando o áudio do agressor e emitindo uma advertência por voz de prioridade máxima.
4. **Relatório Sincero e Recompensa:** Ao final do tempo limite, o Bot Mediador processa toda a linha temporal fonética/textual e entrega um Relatório de Performance Sincero estruturado em JSON contendo as chaves: `vicios_linguagem` (ex: contagem de "né", "tipo"), `tom_e_postura` (segurança fonética capturada pelo Gemini) e `precisao_conceitual` (erros de conteúdo diante da doutrina). Ambos os lados (palestrante e oponentes que provocaram de forma saudável) ganham pontos na Loja de Recompensas.

### Especificação BDD (Gherkin):
```gherkin
# language: pt
Funcionalidade: Arena de Palestras Híbrida com Notificação Coletiva e Moderação por IA

  Cenário: Agendamento de palestra e disparo automatizado de interesse para a comunidade
    Dado que o palestrante agenda uma palestra imediata sobre o tópico "portugues_crase"
    Quando o sistema processa o agendamento da sala
    Então o Express deve buscar todos os usuários que possuem "Língua Portuguesa" ativas em suas "Sacolas de Estudo"
    E deve disparar um alerta de convite para estes interessados entrarem como provocadores na sala virtual
    E deve abrir a interface de sala alocando assentos virtuais para humanos e injetando bots de IA para compor a banca

  Cenário: Dinâmica de provocações cruzadas e intervenção do Mediador de IA por arrogância
    Dado que a palestra está acontecendo com uma plateia mista de humanos e bots
    Quando um provocador real abre o microfone e usa termos ofensivos ou tom arrogante para desestabilizar o palestrante
    Então o Bot Mediador de IA deve detectar o desvio de conduta comportamental em segundo plano
    E o sistema deve atenuar ou cortar temporariamente o áudio do agressor
    E o Mediador de IA deve intervir por áudio na sala dizendo: "Atenção. O objetivo aqui é o desafio intelectual saudável. Mantenha o profissionalismo ou será removido da cadeira."

  Cenário: Encerramento coletivo e distribuição de relatórios pelo Mediador
    Dado que o tempo da palestra esgotou e o Mediador coletou todas as falas da arena
    Quando a sala é finalizada pelo sistema
    Então o Mediador de IA deve gerar o Relatório Sincero avaliando a oratória do palestrante, a precisão das respostas dadas e o nível das provocações aceitas
    E o sistema deve atualizar os pontos de gamificação tanto do palestrante quanto dos ouvintes reais que participaram ativamente das provocações
```