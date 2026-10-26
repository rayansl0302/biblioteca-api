# Briefing QA — Biblioteca API

## Contexto
Esta é uma API REST de uma biblioteca digital: livros têm cópias disponíveis, usuários podem pegar livros emprestados e devolvê-los. O objetivo deste ciclo é testar a API diretamente (via Postman, Insomnia, Thunder Client, curl ou scripts automatizados), sem depender de uma interface visual.

## Ambiente
- Base URL: `http://localhost:3333`
- Autenticação: `POST /auth/login` retorna um `token` JWT. Envie-o em `Authorization: Bearer <token>` nas rotas que exigem login.
- Usuários de teste: veja o [README](../README.md).

## Papéis
- **admin**: pode cadastrar, editar e (em teoria) excluir livros, e listar todos os usuários.
- **member**: pode listar livros, pegar e devolver empréstimos.

## O que explorar
1. **Fluxo de cadastro e login** — campos obrigatórios, formatos de e-mail, senhas fracas, e-mails duplicados.
2. **Catálogo de livros** — busca (`search`), filtro por categoria, paginação (`page`, `limit`), livro inexistente.
3. **Controle de acesso** — teste cada rota com: sem token, token de membro, token de admin. O que deveria ser bloqueado e não é?
4. **Fluxo de empréstimo** — pegar um livro emprestado, verificar se o estoque (`available_copies`) é atualizado, tentar emprestar um livro sem cópias disponíveis.
5. **Fluxo de devolução** — devolver um empréstimo, devolver o mesmo empréstimo de novo, tentar devolver o empréstimo de outra pessoa.
6. **Datas** — compare `loan_date` e `due_date` retornados num empréstimo novo. Faz sentido?
7. **Exposição de dados** — inspecione os payloads de resposta. Algum campo sensível aparece onde não devia?

## Como registrar os achados
Para cada defeito encontrado, registre: rota/método, payload usado, resposta obtida, resposta esperada, e severidade sugerida. Use o mesmo formato de roteiro que já usamos nos ciclos do TaskFlow.
