const db = require('../db/init');

function list(req, res) {
  const { search, category, page, limit } = req.query;

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const offset = (pageNum - 1) * limitNum;

  let query = 'SELECT * FROM books WHERE 1=1';
  const params = [];

  if (search) {
    query += ' AND (title LIKE ? OR author LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  query += ' ORDER BY id LIMIT ? OFFSET ?';
  params.push(limitNum, offset);

  const books = db.prepare(query).all(...params);
  res.json(books);
}

function getById(req, res) {
  const book = db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id);
  res.json(book);
}

function create(req, res) {
  const { title, author, isbn, category, total_copies } = req.body;

  const result = db
    .prepare('INSERT INTO books (title, author, isbn, category, total_copies, available_copies) VALUES (?, ?, ?, ?, ?, ?)')
    .run(title, author, isbn, category, total_copies, total_copies);

  const book = db.prepare('SELECT * FROM books WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(book);
}

function update(req, res) {
  const { title, author, isbn, category, total_copies, available_copies } = req.body;

  db.prepare(
    'UPDATE books SET title = ?, author = ?, isbn = ?, category = ?, total_copies = ?, available_copies = ? WHERE id = ?'
  ).run(title, author, isbn, category, total_copies, available_copies, req.params.id);

  const book = db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id);
  res.json(book);
}

function remove(req, res) {
  db.prepare('DELETE FROM books WHERE id = ?').run(req.params.id);
  res.status(204).send();
}

module.exports = { list, getById, create, update, remove };
