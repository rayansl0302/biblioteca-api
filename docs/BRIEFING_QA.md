# Briefing QA — Biblioteca API

## Contexto
Esta é uma biblioteca digital: livros têm cópias disponíveis, usuários podem pegar livros emprestados e devolvê-los. Existe um front-end web (React), mas o foco deste ciclo é testar a API REST que o sustenta — direto via Postman, Insomnia, Thunder Client, curl ou scripts automatizados, sem depender só da interface visual. Use o front para montar cenários rapidamente, mas confirme sempre a resposta real da API (aba Network do navegador) antes de considerar um comportamento correto.

## Ambiente
- API: `http://localhost:3333`
- Front-end web: `http://localhost:5174`
- Autenticação: `POST /auth/login` retorna um `token` JWT. Envie-o em `Authorization: Bearer <token>` nas rotas que exigem login (o front já faz isso sozinho).
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
8. **Interface (UI/UX)** — além da API, repare na tela: botões desabilitados sem explicação, ações sem confirmação ou sem jeito de cancelar, paginação que não sabe quando parar, campos de autocadastro que aceitam mais do que deveriam.

## Como registrar os achados
Para cada defeito encontrado, registre: rota/método, payload usado, resposta obtida, resposta esperada, e severidade sugerida. Use o mesmo formato de roteiro que já usamos nos ciclos do TaskFlow.

Veja também o [Guia de testes exploratórios](GUIA_EXPLORATORIO_QA.md) para técnicas e perguntas que ajudam a ir além do óbvio.
