[NÍVEL 1: INFRA BASE] -> Servidor, Docker, Roteamento, Erros Globais (CONCLUÍDO)
       ↓
[NÍVEL 2: GOVERNANÇA] -> Autenticação (JWT) e Controle de Acesso / Hierarquias (RBAC) (FALTA)
       ↓
[NÍVEL 3: ESTRATÉGIA DE DADOS] -> Decisão de Contrato (Interfaces) vs ORM (FALTA)
       ↓
[NÍVEL 4: DOMÍNIOS]    -> Usuários, Escolas, Empresas, Menus Específicos

### [OBJETIVO E CASO DE ESTUDO ATUAL]
O projeto deve iniciar a estruturação do **[NÍVEL 2: GOVERNANÇA]**, focando especificamente na fundação de **Autenticação (JWT) e Controle de Acesso Hierárquico Delegado**. 

**O que será desenvolvido primeiro:**
A especificação técnica e o desenho das interfaces TypeScript puras dos contratos de Identidade, Avaliação de Privilégios e Cascateamento Hierárquico. Nenhum código de domínio ou banco de dados será gerado ainda; o foco inicial é o esqueleto abstrato de segurança e os middlewares de interceptação do Express.

**O que o sistema deve pensar por trás (Premissas de Crescimento):**
1. **Hierarquia Reversa e Cascateamento Multitenant:** O motor de autorização deve nascer sabendo que o poder de concessão é delegado em cadeia (Programador/Root ➔ Diretor/Empresa ➔ Líder/Professor ➔ Usuário Final/Aluno). Se um nível superior revogar um recurso, todos os níveis abaixo perdem o acesso automaticamente.
2. **Flag de Estado Visual ("Meio Apagado"):** O backend não decide o design, mas deve prever nos seus contratos de resposta metadados explícitos de restrição (Ex: `isAvailable: false`, `disabledBy: "Diretor"`). Isso permitirá ao frontend renderizar interfaces declarativas (como botões ou menus cinzas/bloqueados).
3. **Não-Repúdio e Auditoria Nativa (Logs):** Toda e qualquer alteração de estado ou concessão de privilégio deve obrigatoriamente passar por um contrato de Log imutável, registrando quem alterou, o que foi alterado, para quem e o contexto, impedindo que qualquer ator negue a ação realizada.
4. **Isolamento de Responsabilidade (SRP/OCP):** O validador de tokens (Quem é você) deve ser totalmente independente do avaliador de capacidades (O que você pode fazer), garantindo nomes que revelem seu propósito (Tim Ottinger) e código fechado para modificação.
