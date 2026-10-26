# Gabarito interno — Biblioteca API

> **DOCUMENTO INTERNO. NÃO ENTREGAR AO PROFISSIONAL AVALIADO.**
>
> Mapa dos defeitos inseridos propositalmente na API e no front-end da Biblioteca Digital. Material interno: não entregar ao profissional avaliado.

**Total de defeitos inseridos: 18**

**Acompanhamento:** 0 corrigidos · 0 encontrados · 0 parciais · 18 pendentes · **18 ainda plantados** de 18 avaliáveis

---

## Índice

| ID | Situação | Título | Área | Severidade | Dificuldade |
|---|---|---|---|---|---|
| BUG-001 | Pendente | Cadastro de livro aceita campos vazios e valores negativos | Validação | MÉDIA | Baixa |
| BUG-002 | Pendente | Empréstimo não verifica cópias disponíveis | Regra de negócio | ALTA | Média |
| BUG-003 | Pendente | IDOR: qualquer usuário devolve o empréstimo de outra pessoa | Autorização | ALTA | Média |
| BUG-004 | Pendente | Membro comum consegue excluir livros | Autorização | CRÍTICA | Baixa |
| BUG-005 | Pendente | Devolver o mesmo empréstimo duas vezes infla o estoque | Integridade de dados | ALTA | Média |
| BUG-006 | Pendente | Cadastro sem validação de e-mail/senha e erro 500 em duplicidade | Validação / Tratamento de erro | MÉDIA | Baixa |
| BUG-007 | Pendente | Paginação de livros sem limite máximo | Resource consumption | BAIXA | Baixa |
| BUG-008 | Pendente | Empréstimo já nasce vencido (due_date = loan_date) | Regra de negócio | MÉDIA | Baixa |
| BUG-009 | Pendente | Livro inexistente retorna 200 em vez de 404 | Tratamento de erro | MÉDIA | Baixa |
| BUG-010 | Pendente | Listagem de usuários expõe o password_hash | Exposição de dados sensíveis | ALTA | Baixa |
| BUG-011 | Pendente | Botão "Próxima" da paginação nunca desativa | UI/UX | BAIXA | Baixa |
| BUG-012 | Pendente | Botão "Pegar emprestado" desabilitado não explica o motivo | UI/UX | BAIXA | Baixa |
| BUG-013 | Pendente | Formulário de livro não tem botão de cancelar | Falta de botão | BAIXA | Baixa |
| BUG-014 | Pendente | Filtro do catálogo não tem botão para limpar | Falta de botão | BAIXA | Baixa |
| BUG-015 | Pendente | Cadastro aceita o campo "role" do corpo da requisição | Autorização | CRÍTICA | Média |
| BUG-016 | Pendente | Qualquer usuário autenticado lê o empréstimo de qualquer outra pessoa pelo id | Autorização | ALTA | Média |
| BUG-017 | Pendente | Edição de livro aceita available_copies maior que total_copies | Validação | MÉDIA | Baixa |
| BUG-018 | Pendente | Empréstimo de livro inexistente derruba erro 500 | Tratamento de erro | MÉDIA | Baixa |

### Distribuição por severidade

| Severidade | Total | Ainda plantados |
|---|---:|---:|
| CRÍTICA | 2 | 2 |
| ALTA | 5 | 5 |
| MÉDIA | 6 | 6 |
| BAIXA | 5 | 5 |

---

## BUG-001 — Cadastro de livro aceita campos vazios e valores negativos

**Situação:** Pendente · **Área:** Validação · **Severidade:** MÉDIA · **Dificuldade:** Baixa

**Por que acontece**

O handler monta o INSERT direto a partir de req.body: não checa se title/author vieram preenchidos nem se total_copies é um número válido (>= 0) antes de gravar.

**Onde está**

- `src/controllers/bookController.js → create()`

**Como reproduzir**

1. Logar como admin e obter o token.
2. POST /books com {"title":"","author":"","total_copies":-5}.

**Resultado esperado:** Erro 400 informando os campos obrigatórios e a faixa válida de total_copies.

**Resultado atual:** Livro é criado com título e autor vazios e total_copies negativo.

**Como se chega nele:** Teste de campo obrigatório vazio e de valor negativo em campo numérico.

---

## BUG-002 — Empréstimo não verifica cópias disponíveis

**Situação:** Pendente · **Área:** Regra de negócio · **Severidade:** ALTA · **Dificuldade:** Média

**Por que acontece**

O handler cria o empréstimo e decrementa available_copies sem antes checar se o valor é maior que zero, então o estoque pode ficar negativo.

**Onde está**

- `src/controllers/loanController.js → create()`

**Como reproduzir**

1. Identificar (ou forçar via PUT /books/:id) um livro com available_copies = 0.
2. Logar como membro e POST /loans com esse bookId.
3. Repetir a chamada mais de uma vez.

**Resultado esperado:** Erro 409/400 quando não há cópias disponíveis.

**Resultado atual:** O empréstimo é criado normalmente e available_copies vai a zero e depois a valores negativos.

**Como se chega nele:** Tentar emprestar um livro sem estoque disponível.

---

## BUG-003 — IDOR: qualquer usuário devolve o empréstimo de outra pessoa

**Situação:** Pendente · **Área:** Autorização · **Severidade:** ALTA · **Dificuldade:** Média

**Por que acontece**

A rota PUT /loans/:id/return só passa pelo middleware authenticate. O controller nunca compara o user_id do empréstimo com o usuário do token, então qualquer conta logada pode devolver o empréstimo de qualquer outra.

**Onde está**

- `src/controllers/loanController.js → returnLoan()`
- `src/routes/loanRoutes.js`

**Como reproduzir**

1. Logar como usuário A e pegar um livro emprestado — anotar o id do empréstimo retornado.
2. Logar como usuário B.
3. Com o token de B, chamar PUT /loans/<id-do-emprestimo-de-A>/return.

**Resultado esperado:** 403 — só o dono do empréstimo (ou um admin) pode devolvê-lo.

**Resultado atual:** A devolução é processada normalmente, mesmo sendo de outro usuário.

**Como se chega nele:** Trocar o id do empréstimo entre contas diferentes (comparar com o comportamento de /tasks/:id em outros projetos).

---

## BUG-004 — Membro comum consegue excluir livros

**Situação:** Pendente · **Área:** Autorização · **Severidade:** CRÍTICA · **Dificuldade:** Baixa

**Por que acontece**

POST /books e PUT /books/:id aplicam authenticate + requireAdmin corretamente, mas a rota DELETE /books/:id só recebeu authenticate — o middleware requireAdmin foi esquecido nela.

**Onde está**

- `src/routes/bookRoutes.js`

**Como reproduzir**

1. Logar com uma conta de papel member.
2. Chamar DELETE /books/:id para qualquer livro existente.

**Resultado esperado:** 403 — exclusão restrita a administradores.

**Resultado atual:** O livro é excluído com sucesso (204 No Content), mesmo com uma conta não-admin.

**Como se chega nele:** Testar cada rota de /books com token de membro comum, não só com admin.

---

## BUG-005 — Devolver o mesmo empréstimo duas vezes infla o estoque

**Situação:** Pendente · **Área:** Integridade de dados · **Severidade:** ALTA · **Dificuldade:** Média

**Por que acontece**

O handler não verifica se o empréstimo já está com status 'returned' antes de processar — cada chamada incrementa available_copies e grava um novo return_date.

**Onde está**

- `src/controllers/loanController.js → returnLoan()`

**Como reproduzir**

1. Pegar um livro emprestado.
2. Chamar PUT /loans/:id/return.
3. Chamar PUT /loans/:id/return de novo, com o mesmo id.
4. Comparar available_copies do livro com total_copies.

**Resultado esperado:** A segunda chamada deve falhar (empréstimo já devolvido) e available_copies nunca deve ultrapassar total_copies.

**Resultado atual:** A segunda devolução é aceita e available_copies fica maior que total_copies.

**Como se chega nele:** Repetir a mesma ação de devolução mais de uma vez.

---

## BUG-006 — Cadastro sem validação de e-mail/senha e erro 500 em duplicidade

**Situação:** Pendente · **Área:** Validação / Tratamento de erro · **Severidade:** MÉDIA · **Dificuldade:** Baixa

**Por que acontece**

Não há checagem de formato de e-mail nem de tamanho mínimo de senha antes do INSERT. Como a coluna email é UNIQUE, um cadastro duplicado lança uma exceção do SQLite que sobe sem tratamento específico até o error handler genérico, virando 500 em vez de um 409 tratado.

**Onde está**

- `src/controllers/authController.js → register()`

**Como reproduzir**

1. POST /auth/register com um e-mail já cadastrado (ex.: maria@exemplo.com).
2. POST /auth/register com e-mail 'nao-e-email' e senha '1'.

**Resultado esperado:** 409 Conflict para e-mail duplicado; 400 Bad Request para formato de e-mail ou senha inválidos.

**Resultado atual:** 500 Internal Server Error no cadastro duplicado; e-mail e senha fracos são aceitos sem aviso.

**Como se chega nele:** Cadastro duplicado e teste de formato/força de senha.

---

## BUG-007 — Paginação de livros sem limite máximo

**Situação:** Pendente · **Área:** Resource consumption · **Severidade:** BAIXA · **Dificuldade:** Baixa

**Por que acontece**

O valor de limit vem direto de req.query sem nenhum teto — um client pode pedir um número arbitrariamente grande e receber a tabela inteira de uma vez.

**Onde está**

- `src/controllers/bookController.js → list()`

**Como reproduzir**

1. GET /books?limit=999999.
2. Comparar a quantidade de itens retornados com o total de livros cadastrados.

**Resultado esperado:** O backend aplica um limite máximo (ex.: 50 ou 100 itens por página), ignorando valores acima disso.

**Resultado atual:** Todos os registros voltam de uma vez, sem paginação real.

**Como se chega nele:** Testar valores de fronteira no parâmetro limit.

---

## BUG-008 — Empréstimo já nasce vencido (due_date = loan_date)

**Situação:** Pendente · **Área:** Regra de negócio · **Severidade:** MÉDIA · **Dificuldade:** Baixa

**Por que acontece**

dueDate é instanciado como new Date(loanDate) e gravado assim, sem somar os dias de prazo de empréstimo.

**Onde está**

- `src/controllers/loanController.js → create()`

**Como reproduzir**

1. Logar como membro e criar um empréstimo (POST /loans).
2. Comparar os campos loan_date e due_date na resposta — também visível na tabela de 'Meus Empréstimos' no front-end.

**Resultado esperado:** due_date deve ser loan_date mais um prazo (ex.: 7 dias).

**Resultado atual:** due_date é idêntico a loan_date, segundo a segundo.

**Como se chega nele:** Comparar as duas datas retornadas por um empréstimo recém-criado.

---

## BUG-009 — Livro inexistente retorna 200 em vez de 404

**Situação:** Pendente · **Área:** Tratamento de erro · **Severidade:** MÉDIA · **Dificuldade:** Baixa

**Por que acontece**

O resultado de db.prepare(...).get(id) pode ser undefined quando o id não existe, mas o handler responde res.json(book) sem checar isso antes.

**Onde está**

- `src/controllers/bookController.js → getById()`

**Como reproduzir**

1. GET /books/99999 (id que não existe).

**Resultado esperado:** 404 Not Found com uma mensagem de erro.

**Resultado atual:** 200 OK com corpo vazio/nulo.

**Como se chega nele:** Consultar um id que não existe na base.

---

## BUG-010 — Listagem de usuários expõe o password_hash

**Situação:** Pendente · **Área:** Exposição de dados sensíveis · **Severidade:** ALTA · **Dificuldade:** Baixa

**Por que acontece**

A consulta usa SELECT * FROM users e devolve o registro inteiro no JSON, sem excluir o campo password_hash. A tela de usuários do front-end não exibe o campo, mas ele continua trafegando na resposta da API.

**Onde está**

- `src/controllers/userController.js → list()`

**Como reproduzir**

1. Logar como admin.
2. GET /users.
3. Inspecionar o corpo da resposta (aba Network do navegador, ou diretamente no Postman/Insomnia).

**Resultado esperado:** A resposta não deve incluir password_hash nem qualquer outro dado sensível de autenticação.

**Resultado atual:** O hash bcrypt da senha de todos os usuários aparece no payload da resposta.

**Como se chega nele:** Inspecionar o payload de resposta, não só o que a tela renderiza.

---

## BUG-011 — Botão "Próxima" da paginação nunca desativa

**Situação:** Pendente · **Área:** UI/UX · **Severidade:** BAIXA · **Dificuldade:** Baixa

**Por que acontece**

A API não devolve o total de registros nem indica se há próxima página, e o botão "Proxima" só incrementa o state `page` sem checar `books.length`. O front não tem como saber quando parar.

**Onde está**

- `frontend/src/pages/BooksPage.tsx`

**Como reproduzir**

1. Abrir o catálogo com poucos livros cadastrados (ex.: 5, com limite de 8 por página).
2. Clicar em "Proxima" repetidas vezes.

**Resultado esperado:** O botão "Proxima" desativa (ou soma nada) quando a página atual já não tem mais livros.

**Resultado atual:** O botão continua clicável indefinidamente, levando a páginas vazias sem nenhum aviso de que acabaram os resultados.

**Como se chega nele:** Navegar a paginação do catálogo além do número real de páginas.

---

## BUG-012 — Botão "Pegar emprestado" desabilitado não explica o motivo

**Situação:** Pendente · **Área:** UI/UX · **Severidade:** BAIXA · **Dificuldade:** Baixa

**Por que acontece**

O botão recebe `disabled={book.available_copies <= 0}` mas mantém o mesmo texto "Pegar emprestado", sem tooltip, título ou mensagem explicando que o livro está sem cópias disponíveis.

**Onde está**

- `frontend/src/pages/BooksPage.tsx`

**Como reproduzir**

1. Abrir o catálogo e localizar um livro com "0 / N disponíveis".
2. Observar o botão "Pegar emprestado" desse livro.

**Resultado esperado:** Algum indício visível (texto, tooltip ou troca de rótulo) explicando por que a ação está bloqueada.

**Resultado atual:** O botão só aparece acinzentado, indistinguível de uma falha de carregamento para quem não reparar nos números de cópias.

**Como se chega nele:** Comparar o comportamento visual de um livro esgotado com o de um livro disponível.

---

## BUG-013 — Formulário de livro não tem botão de cancelar

**Situação:** Pendente · **Área:** Falta de botão · **Severidade:** BAIXA · **Dificuldade:** Baixa

**Por que acontece**

O formulário de criar/editar livro só tem o botão "Salvar". Não existe link nem botão "Cancelar" para voltar ao catálogo sem submeter.

**Onde está**

- `frontend/src/pages/BookFormPage.tsx`

**Como reproduzir**

1. Logar como admin.
2. Abrir "Novo Livro" ou "Editar" em qualquer livro.
3. Procurar uma forma de sair do formulário sem preencher e salvar.

**Resultado esperado:** Um botão ou link "Cancelar" que volte ao catálogo sem alterar nada.

**Resultado atual:** A única saída é o link "Catálogo" da barra de navegação ou o botão voltar do navegador — nenhum controle dentro do próprio formulário.

**Como se chega nele:** Tentar sair de um formulário de edição aberto por engano.

---

## BUG-014 — Filtro do catálogo não tem botão para limpar

**Situação:** Pendente · **Área:** Falta de botão · **Severidade:** BAIXA · **Dificuldade:** Baixa

**Por que acontece**

O formulário de filtro só tem o botão "Filtrar". Depois de buscar por título/categoria, não há botão "Limpar" — é preciso apagar o texto manualmente dos dois campos.

**Onde está**

- `frontend/src/pages/BooksPage.tsx`

**Como reproduzir**

1. Preencher "Buscar por título ou autor" e "Categoria" no catálogo.
2. Clicar em "Filtrar".
3. Tentar voltar a ver todos os livros sem apagar os campos manualmente.

**Resultado esperado:** Um botão "Limpar filtros" que reseta busca e categoria de uma vez.

**Resultado atual:** Não existe esse botão; o usuário precisa apagar cada campo manualmente e filtrar de novo.

**Como se chega nele:** Aplicar um filtro no catálogo e tentar removê-lo.

---

## BUG-015 — Cadastro aceita o campo "role" do corpo da requisição

**Situação:** Pendente · **Área:** Autorização · **Severidade:** CRÍTICA · **Dificuldade:** Média

**Por que acontece**

O handler desestrutura `role` de req.body e usa `role || 'member'` no INSERT, em vez de sempre gravar 'member'. Qualquer pessoa que descubra o campo consegue se autopromover a admin no próprio cadastro.

**Onde está**

- `src/controllers/authController.js → register()`

**Como reproduzir**

1. POST /auth/register com {"name":"Invasor","email":"invasor@exemplo.com","password":"123456","role":"admin"}.
2. Logar com essa conta e chamar uma rota restrita a admin (ex.: GET /users ou DELETE /books/:id).

**Resultado esperado:** O campo role do corpo deve ser ignorado — todo cadastro público nasce como 'member'.

**Resultado atual:** A conta é criada com role 'admin' e tem acesso total às rotas administrativas.

**Como se chega nele:** Enviar campos extras e inesperados no corpo de um cadastro público, não só os campos do formulário.

---

## BUG-016 — Qualquer usuário autenticado lê o empréstimo de qualquer outra pessoa pelo id

**Situação:** Pendente · **Área:** Autorização · **Severidade:** ALTA · **Dificuldade:** Média

**Por que acontece**

getById() busca o empréstimo só pelo id e devolve direto, sem comparar loan.user_id com req.user.id nem checar se req.user é admin — o mesmo tipo de falha do BUG-003, mas na leitura em vez da devolução.

**Onde está**

- `src/controllers/loanController.js → getById()`

**Como reproduzir**

1. Logar como usuário A e criar um empréstimo — anotar o id retornado.
2. Logar como usuário B.
3. Com o token de B, chamar GET /loans/<id-do-emprestimo-de-A>.

**Resultado esperado:** 403 — só o dono do empréstimo (ou um admin) pode consultá-lo.

**Resultado atual:** Os dados completos do empréstimo de A (incluindo book_id e datas) são retornados para B normalmente.

**Como se chega nele:** Trocar o id na rota de detalhe de empréstimo entre contas diferentes, não só testar a listagem.

---

## BUG-017 — Edição de livro aceita available_copies maior que total_copies

**Situação:** Pendente · **Área:** Validação · **Severidade:** MÉDIA · **Dificuldade:** Baixa

**Por que acontece**

O UPDATE grava os dois campos direto do corpo da requisição sem comparar os valores entre si nem com o estoque já emprestado — dá para inflar available_copies por PUT, sem precisar devolver nenhum empréstimo.

**Onde está**

- `src/controllers/bookController.js → update()`

**Como reproduzir**

1. Logar como admin.
2. PUT /books/:id de um livro com total_copies=2, enviando {"available_copies":50,...}.

**Resultado esperado:** Erro 400 — available_copies nunca pode ultrapassar total_copies.

**Resultado atual:** O livro passa a mostrar 50 cópias disponíveis de um total de 2.

**Como se chega nele:** Comparar os dois campos de estoque depois de editar um livro diretamente, não só depois de um empréstimo/devolução.

---

## BUG-018 — Empréstimo de livro inexistente derruba erro 500

**Situação:** Pendente · **Área:** Tratamento de erro · **Severidade:** MÉDIA · **Dificuldade:** Baixa

**Por que acontece**

O handler busca o livro e usa `book.id` direto, sem checar se a consulta devolveu undefined quando o bookId não existe — mesmo padrão de omissão do BUG-009, mas aqui gera uma exceção não tratada em vez de um corpo vazio.

**Onde está**

- `src/controllers/loanController.js → create()`

**Como reproduzir**

1. Logar como membro.
2. POST /loans com {"bookId":99999} (id que não existe).

**Resultado esperado:** 404 Not Found informando que o livro não existe.

**Resultado atual:** 500 Internal Server Error, sem nenhuma mensagem útil para quem está integrando com a API.

**Como se chega nele:** Tentar emprestar um livro usando um id inventado.

---
