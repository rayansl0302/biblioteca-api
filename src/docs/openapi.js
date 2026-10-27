const PORT = process.env.PORT || 3333;

const Book = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    title: { type: 'string' },
    author: { type: 'string' },
    isbn: { type: 'string' },
    category: { type: 'string' },
    total_copies: { type: 'integer' },
    available_copies: { type: 'integer' },
  },
};

const BookInput = {
  type: 'object',
  required: ['title', 'author', 'isbn', 'category', 'total_copies'],
  properties: {
    title: { type: 'string' },
    author: { type: 'string' },
    isbn: { type: 'string' },
    category: { type: 'string' },
    total_copies: { type: 'integer' },
  },
};

const User = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    role: { type: 'string', enum: ['member', 'admin'] },
    created_at: { type: 'string', format: 'date-time' },
  },
};

const UserInput = {
  type: 'object',
  required: ['name', 'email', 'password'],
  properties: {
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', format: 'password' },
    role: { type: 'string', enum: ['member', 'admin'], default: 'member' },
  },
};

const Loan = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    book_id: { type: 'integer' },
    user_id: { type: 'integer' },
    loan_date: { type: 'string', format: 'date-time' },
    due_date: { type: 'string', format: 'date-time' },
    return_date: { type: 'string', format: 'date-time', nullable: true },
    status: { type: 'string', enum: ['active', 'returned'] },
  },
};

const Error = {
  type: 'object',
  properties: {
    error: { type: 'string' },
  },
};

const bearerAuth = [{ bearerAuth: [] }];

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'Biblioteca Digital API',
    version: '1.0.0',
    description:
      'API REST de uma biblioteca digital: catalogo de livros, emprestimos/devolucoes e gestao de usuarios. ' +
      'Projeto usado para treino de QA — esta documentacao descreve o comportamento esperado da API.',
  },
  servers: [
    { url: `http://localhost:${PORT}`, description: 'Ambiente local' },
    { url: 'https://biblioteca-api-tiaw.onrender.com', description: 'Producao (Render)' },
  ],
  tags: [
    { name: 'Auth', description: 'Cadastro e login' },
    { name: 'Books', description: 'Catalogo de livros' },
    { name: 'Loans', description: 'Emprestimos e devolucoes' },
    { name: 'Users', description: 'Gestao de usuarios (admin)' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token obtido em POST /auth/login, enviado como "Authorization: Bearer <token>"',
      },
    },
    schemas: { Book, BookInput, User, UserInput, Loan, Error },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Verifica se a API esta no ar',
        responses: { 200: { description: 'API saudavel' } },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Cria uma nova conta',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: UserInput } },
        },
        responses: {
          201: {
            description: 'Usuario criado',
            content: { 'application/json': { schema: User } },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Autentica e retorna um token JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', format: 'password' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login efetuado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { token: { type: 'string' }, user: User },
                },
              },
            },
          },
          401: {
            description: 'Credenciais invalidas',
            content: { 'application/json': { schema: Error } },
          },
        },
      },
    },
    '/books': {
      get: {
        tags: ['Books'],
        summary: 'Lista livros do catalogo',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Busca por titulo ou autor' },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: {
          200: {
            description: 'Lista de livros',
            content: { 'application/json': { schema: { type: 'array', items: Book } } },
          },
        },
      },
      post: {
        tags: ['Books'],
        summary: 'Cadastra um novo livro (admin)',
        security: bearerAuth,
        requestBody: { required: true, content: { 'application/json': { schema: BookInput } } },
        responses: {
          201: { description: 'Livro criado', content: { 'application/json': { schema: Book } } },
          401: { description: 'Nao autenticado' },
          403: { description: 'Requer papel admin' },
        },
      },
    },
    '/books/{id}': {
      get: {
        tags: ['Books'],
        summary: 'Busca um livro pelo id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Livro encontrado', content: { 'application/json': { schema: Book } } },
          404: { description: 'Livro nao encontrado' },
        },
      },
      put: {
        tags: ['Books'],
        summary: 'Atualiza um livro (admin)',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: { required: true, content: { 'application/json': { schema: BookInput } } },
        responses: {
          200: { description: 'Livro atualizado', content: { 'application/json': { schema: Book } } },
          401: { description: 'Nao autenticado' },
          403: { description: 'Requer papel admin' },
        },
      },
      delete: {
        tags: ['Books'],
        summary: 'Remove um livro',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          204: { description: 'Livro removido' },
          401: { description: 'Nao autenticado' },
        },
      },
    },
    '/loans': {
      get: {
        tags: ['Loans'],
        summary: 'Lista emprestimos (do proprio usuario, ou de todos se admin)',
        security: bearerAuth,
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['active', 'returned'] } },
        ],
        responses: {
          200: { description: 'Lista de emprestimos', content: { 'application/json': { schema: { type: 'array', items: Loan } } } },
          401: { description: 'Nao autenticado' },
        },
      },
      post: {
        tags: ['Loans'],
        summary: 'Registra um novo emprestimo',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object', required: ['bookId'], properties: { bookId: { type: 'integer' } } },
            },
          },
        },
        responses: {
          201: { description: 'Emprestimo criado', content: { 'application/json': { schema: Loan } } },
          401: { description: 'Nao autenticado' },
        },
      },
    },
    '/loans/{id}': {
      get: {
        tags: ['Loans'],
        summary: 'Busca um emprestimo pelo id',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Emprestimo encontrado', content: { 'application/json': { schema: Loan } } },
          401: { description: 'Nao autenticado' },
        },
      },
    },
    '/loans/{id}/return': {
      put: {
        tags: ['Loans'],
        summary: 'Registra a devolucao de um emprestimo',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Devolucao registrada', content: { 'application/json': { schema: Loan } } },
          401: { description: 'Nao autenticado' },
        },
      },
    },
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'Lista usuarios cadastrados (admin)',
        security: bearerAuth,
        responses: {
          200: { description: 'Lista de usuarios', content: { 'application/json': { schema: { type: 'array', items: User } } } },
          401: { description: 'Nao autenticado' },
          403: { description: 'Requer papel admin' },
        },
      },
      post: {
        tags: ['Users'],
        summary: 'Cria um usuario (admin)',
        security: bearerAuth,
        requestBody: { required: true, content: { 'application/json': { schema: UserInput } } },
        responses: {
          201: { description: 'Usuario criado', content: { 'application/json': { schema: User } } },
          401: { description: 'Nao autenticado' },
          403: { description: 'Requer papel admin' },
        },
      },
    },
    '/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Busca um usuario pelo id (admin)',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Usuario encontrado', content: { 'application/json': { schema: User } } },
          401: { description: 'Nao autenticado' },
          403: { description: 'Requer papel admin' },
        },
      },
      put: {
        tags: ['Users'],
        summary: 'Atualiza um usuario (admin)',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  role: { type: 'string', enum: ['member', 'admin'] },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Usuario atualizado', content: { 'application/json': { schema: User } } },
          401: { description: 'Nao autenticado' },
          403: { description: 'Requer papel admin' },
        },
      },
      delete: {
        tags: ['Users'],
        summary: 'Remove um usuario (admin)',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          204: { description: 'Usuario removido' },
          401: { description: 'Nao autenticado' },
          403: { description: 'Requer papel admin' },
        },
      },
    },
  },
};
