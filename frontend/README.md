# Biblioteca Digital — Frontend

Interface web (React + TypeScript + Vite) que consome a [Biblioteca API](../README.md).

## Como rodar

```bash
npm install
cp .env.example .env
npm run dev
```

Sobe em `http://localhost:5174`. Requer a API rodando em `http://localhost:3333` (veja o README na raiz do projeto).

## Papéis
- Visitante: navega o catálogo sem login.
- `member`: faz login, pega e devolve livros emprestados.
- `admin`: além disso, cadastra/edita/exclui livros e lista usuários.
