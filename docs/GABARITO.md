# Gabarito de Defeitos Intencionais — Biblioteca API

> Uso interno do responsável pelo treinamento. Não compartilhar com o QA antes dos ciclos de teste — o objetivo é que os defeitos sejam encontrados por meio de testes exploratórios e automatizados na API (Postman/Insomnia, Newman, scripts HTTP, etc.), não lidos aqui.

| # | Área | Defeito | Severidade | Como reproduzir |
|---|------|---------|------------|------------------|
| 1 | Validação | `POST /books` não valida campos obrigatórios nem valores numéricos — aceita título/autor vazios e `total_copies` negativo ou zero. | Média | Enviar `{"title":"","author":"","total_copies":-5}` como admin autenticado. |
| 2 | Regra de negócio | `POST /loans` não verifica `available_copies` antes de criar o empréstimo — permite emprestar um livro sem cópias disponíveis, levando o estoque a ficar negativo. | Alta | Pegue um livro com `available_copies = 0` (ou force via updates) e crie empréstimos repetidos. |
| 3 | Controle de acesso (IDOR) | `PUT /loans/:id/return` não verifica se o empréstimo pertence ao usuário autenticado — qualquer membro logado pode devolver o empréstimo de outra pessoa. | Alta | Logar como usuário A, pegar o `id` de um empréstimo do usuário B e chamar `return` com o token de A. |
| 4 | Controle de acesso (Broken Access Control) | `DELETE /books/:id` exige apenas `authenticate`, mas esqueceu o middleware `requireAdmin` — qualquer usuário autenticado (não só admin) pode excluir livros. | Crítica | Logar como membro comum e chamar `DELETE /books/:id`. |
| 5 | Integridade de dados | `PUT /loans/:id/return` não verifica se o empréstimo já estava com status `returned` — chamar a rota duas vezes incrementa `available_copies` duas vezes, inflando o estoque além do `total_copies`. | Alta | Devolver o mesmo empréstimo duas vezes seguidas e comparar `available_copies` com `total_copies`. |
| 6 | Validação / tratamento de erro | `POST /auth/register` não valida formato de e-mail nem tamanho mínimo de senha, e o cadastro de e-mail duplicado quebra com `500 Internal Server Error` em vez de `409 Conflict`. | Média | Cadastrar duas vezes o mesmo e-mail; cadastrar com e-mail inválido ou senha de 1 caractere. |
| 7 | Resource consumption | `GET /books` não limita o valor máximo de `limit` na paginação — um client pode pedir `?limit=999999` e obter a tabela inteira de uma vez, ignorando a paginação. | Baixa/Média | Chamar `GET /books?limit=999999` e verificar que todos os registros voltam de uma vez. |
| 8 | Regra de negócio | `POST /loans` calcula `due_date` igual a `loan_date` (não soma o prazo de devolução) — todo empréstimo já nasce "vencido" no mesmo instante. | Média | Criar um empréstimo e comparar `loan_date` com `due_date` na resposta — são idênticos. |
| 9 | Tratamento de erro | `GET /books/:id` com um `id` inexistente retorna `200 OK` com corpo vazio/nulo em vez de `404 Not Found`. | Média | Chamar `GET /books/99999`. |
| 10 | Exposição de dados sensíveis | `GET /users` (admin) retorna o campo `password_hash` de todos os usuários no JSON. | Alta | Logar como admin e chamar `GET /users`, inspecionar o payload. |

## Credenciais de seed
- Admin: `admin@biblioteca.com` / `admin123`
- Membro: `maria@exemplo.com` / `maria123`
- Membro: `joao@exemplo.com` / `joao123`
