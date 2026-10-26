# Biblioteca Digital — Guia de testes exploratórios

Material de apoio para o profissional de QA. Pode ser entregue junto com o briefing.

> Este guia não lista defeitos. Ele descreve **técnicas** e **perguntas** que costumam
> revelar problemas em qualquer API — use como roteiro de investigação, seja pela
> interface web, seja direto na API (Postman/Insomnia/curl).

---

## A ideia central

A maior parte dos defeitos não aparece na primeira chamada. Aparece quando você **insiste**:
repete a ação, troca de usuário, chama a rota sem token, inspeciona a resposta crua em vez
de confiar só no que a tela mostra.

Uma chamada que termina em "200 OK" não é prova de que está correta. Depois de cada
resposta de sucesso, faça mais uma pergunta: *o corpo da resposta é mesmo o que deveria ser?*

---

## 1. As técnicas que mais rendem numa API

### 1.1 Compare o que a tela mostra com o que a API devolveu

A interface filtra e formata; a resposta crua, não. Abra a aba **Network** do navegador (ou
use Postman/Insomnia direto) e confira:

- campos que a tela não exibe aparecem no JSON?
- o valor exibido bate exatamente com o valor retornado?
- erros tratados pela tela escondem um status code ou mensagem diferente do que a API mandou?

### 1.2 Teste cada rota com três níveis de acesso

Para cada endpoint, repita a chamada: **sem token**, **com token de membro**, **com token de
admin**. Pergunte:

- o que deveria ser bloqueado e não é?
- o que deveria ser permitido e foi bloqueado por engano?
- o status code do bloqueio é o correto (401 sem token, 403 sem permissão)?

### 1.3 Troque o ID no final da rota (IDOR)

Pegue um ID que pertence a outro usuário (um empréstimo, por exemplo) e tente acessá-lo ou
alterá-lo autenticado como uma conta diferente. Isso vale para toda rota com `:id`.

### 1.4 Repita a mesma ação duas vezes

- chame o mesmo `POST`/`PUT` duas vezes seguidas, rapidamente;
- devolva o mesmo item duas vezes;
- cadastre o mesmo registro (e-mail, livro) de novo.

Sistemas que não verificam estado antes de agir costumam aceitar a segunda chamada como se
fosse a primeira.

### 1.5 Valores de fronteira

Para cada campo, percorra a escada: **vazio → negativo → zero → o mínimo → o máximo → acima
do máximo**. E depois os casos sujos:

- só espaços em branco;
- texto onde se espera número, e vice-versa;
- IDs que não existem (`/books/99999`);
- parâmetros de paginação estranhos (`page=0`, `page=-1`, `limit=999999`).

### 1.6 Leia a mensagem de erro com atenção

- o status code bate com o tipo de erro (400 vs. 401 vs. 403 vs. 404 vs. 409 vs. 500)?
- a mensagem expõe detalhes internos (stack trace, nome de tabela, biblioteca)?
- um erro de validação devolve 500 em vez de 400?

### 1.7 Compare duas rotas que fazem "a mesma coisa"

Quando duas rotas protegem o mesmo tipo de recurso (ex.: `POST /books` e `DELETE /books/:id`),
verifique se as duas aplicam exatamente as mesmas regras de autorização. Inconsistência entre
rotas parecidas é um padrão comum de falha.

### 1.8 Datas e cálculos

- confira se `due_date`, `loan_date` e `return_date` fazem sentido entre si;
- um empréstimo criado agora já deveria estar "vencido"?
- o estoque (`available_copies`/`total_copies`) bate depois de uma sequência de operações?

---

## 2. Roteiros por área

### Autenticação e cadastro

- O que acontece com e-mail/senha vazios, um de cada vez?
- E-mail duplicado — qual o status code? A mensagem é clara?
- A senha tem alguma regra mínima de tamanho/complexidade?
- O token expira? O que acontece ao usar um token expirado ou adulterado?

### Catálogo de livros

- Busca e filtro funcionam com acentos, maiúsculas, espaços nas pontas?
- Paginação: o que acontece com `page=0`, página além do total, `limit` muito grande?
- Um livro inexistente retorna o status correto?
- Os campos de estoque (`total_copies`/`available_copies`) podem ficar inconsistentes?

### Controle de acesso

- Teste cada rota de `/books`, `/loans` e `/users` com os três níveis de acesso (seção 1.2).
- Um membro comum consegue alcançar uma ação de admin trocando o payload ou a URL?
- As permissões do front-end (menus escondidos) realmente refletem o que a API permite?

### Fluxo de empréstimo e devolução

- Emprestar um livro sem cópias disponíveis — o que acontece?
- Devolver o mesmo empréstimo duas vezes.
- Devolver o empréstimo de outro usuário.
- O estoque depois de várias idas e vindas continua coerente com `total_copies`?

### Exposição de dados

- Inspecione o payload de cada resposta, não só o que a tela renderiza.
- Algum campo sensível (senha, hash, token de outro usuário) aparece onde não devia?

---

## 3. Antes de fechar o ciclo

Sete perguntas para revisar o que ficou de fora:

1. Testei cada rota com os três níveis de acesso (sem token / membro / admin)?
2. Troquei algum ID entre contas diferentes?
3. Repeti alguma ação duas vezes seguidas?
4. Testei os limites de cada campo — vazio, negativo, acima do máximo?
5. Inspecionei o payload cru de pelo menos algumas respostas, não só a tela?
6. Comparei duas rotas parecidas (ex.: editar vs. excluir) quanto às regras de acesso?
7. Para cada coisa que "funcionou", perguntei *e se eu chamar de novo, ou com outro usuário?*

---

## 4. Lembre do relatório

Um defeito bem descrito vale mais que três mal descritos. Para cada achado, garanta que
outra pessoa consiga reproduzir sem falar com você: método + rota, payload usado, headers
relevantes (token/perfil), resposta obtida, resposta esperada e uma evidência (print da
resposta ou da aba Network).
