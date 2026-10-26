# Biblioteca API

API REST de uma biblioteca digital (catálogo de livros, usuários e empréstimos), criada como ambiente de treino de QA focado em testes de **API real** — diferente do [TaskFlow](../TaskFlow), que usava Firebase como backend.

## Stack
- Backend: Node.js + Express + SQLite (`better-sqlite3`) + JWT
- Frontend: React + TypeScript (Vite) + React Router + Axios

## Como rodar

### Backend (API)
```bash
npm install
cp .env.example .env
npm run seed    # popula usuários e livros de exemplo
npm run dev     # ou: npm start
```
A API sobe em `http://localhost:3333`.

### Frontend (web)
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
O front sobe em `http://localhost:5174` e já aponta para a API local.

## Recursos

| Recurso | Rotas |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login` |
| Livros | `GET /books`, `GET /books/:id`, `POST /books` (admin), `PUT /books/:id` (admin), `DELETE /books/:id` |
| Empréstimos | `GET /loans`, `GET /loans/:id`, `POST /loans`, `PUT /loans/:id/return` |
| Usuários | `GET /users` (admin) |

Todas as rotas de empréstimo exigem token JWT (`Authorization: Bearer <token>`).

## Credenciais de teste (seed)
- Admin: `admin@biblioteca.com` / `admin123`
- Membro: `maria@exemplo.com` / `maria123`
- Membro: `joao@exemplo.com` / `joao123`

## Estrutura
```
BibliotecaAPI/
├── src/        # backend (Express + SQLite)
├── frontend/   # web app (React + Vite) que consome a API
├── docs/       # briefing, guia exploratorio e gabarito (fonte: docs/gabarito.json)
└── scripts/    # gerador do QA_GABARITO.md a partir do gabarito.json
```

## Para o QA
- [docs/BRIEFING_QA.md](docs/BRIEFING_QA.md) — contexto, ambiente e o que explorar neste ciclo.
- [docs/GUIA_EXPLORATORIO_QA.md](docs/GUIA_EXPLORATORIO_QA.md) — técnicas gerais de teste exploratório em API.

**Não leia `docs/gabarito.json` nem `QA_GABARITO.md`** antes de testar — são o material interno do responsável pelo treinamento, com o mapa de todos os defeitos inseridos propositalmente. Depois de registrar um ciclo de testes, regenere o markdown com:
```bash
node scripts/gerar-gabarito-md.mjs
```
