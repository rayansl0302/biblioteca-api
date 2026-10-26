require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./init');

const users = [
  { name: 'Admin Biblioteca', email: 'admin@biblioteca.com', password: 'admin123', role: 'admin' },
  { name: 'Maria Souza', email: 'maria@exemplo.com', password: 'maria123', role: 'member' },
  { name: 'Joao Pereira', email: 'joao@exemplo.com', password: 'joao123', role: 'member' },
];

const books = [
  { title: 'O Senhor dos Aneis', author: 'J.R.R. Tolkien', isbn: '9788533613379', category: 'Fantasia', total_copies: 3, available_copies: 3 },
  { title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884', category: 'Tecnologia', total_copies: 2, available_copies: 2 },
  { title: '1984', author: 'George Orwell', isbn: '9780451524935', category: 'Ficcao', total_copies: 4, available_copies: 4 },
  { title: 'A Revolucao dos Bichos', author: 'George Orwell', isbn: '9780451526342', category: 'Ficcao', total_copies: 2, available_copies: 2 },
  { title: 'Introducao aos Algoritmos', author: 'Thomas H. Cormen', isbn: '9788535236996', category: 'Tecnologia', total_copies: 1, available_copies: 1 },
];

const insertUser = db.prepare(
  'INSERT OR IGNORE INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)'
);
const insertBook = db.prepare(
  'INSERT INTO books (title, author, isbn, category, total_copies, available_copies) VALUES (?, ?, ?, ?, ?, ?)'
);

const bookCount = db.prepare('SELECT COUNT(*) as count FROM books').get().count;

for (const user of users) {
  const hash = bcrypt.hashSync(user.password, 10);
  insertUser.run(user.name, user.email, hash, user.role);
}

if (bookCount === 0) {
  for (const book of books) {
    insertBook.run(book.title, book.author, book.isbn, book.category, book.total_copies, book.available_copies);
  }
}

console.log('Seed concluido: usuarios e livros de exemplo cadastrados.');
console.log('Login admin: admin@biblioteca.com / admin123');
console.log('Login membro: maria@exemplo.com / maria123');
