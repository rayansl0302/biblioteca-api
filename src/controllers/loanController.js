const db = require('../db/init');

function list(req, res) {
  const { status } = req.query;
  const isAdmin = req.user.role === 'admin';

  let query = `
    SELECT loans.*, books.title as book_title, users.name as user_name
    FROM loans
    JOIN books ON books.id = loans.book_id
    JOIN users ON users.id = loans.user_id
    WHERE 1=1
  `;
  const params = [];

  if (!isAdmin) {
    query += ' AND loans.user_id = ?';
    params.push(req.user.id);
  }

  if (status) {
    query += ' AND loans.status = ?';
    params.push(status);
  }

  query += ' ORDER BY loans.id DESC';

  const loans = db.prepare(query).all(...params);
  res.json(loans);
}

function getById(req, res) {
  const loan = db.prepare('SELECT * FROM loans WHERE id = ?').get(req.params.id);
  res.json(loan);
}

function create(req, res) {
  const { bookId } = req.body;
  const book = db.prepare('SELECT * FROM books WHERE id = ?').get(bookId);

  const loanDate = new Date();
  const dueDate = new Date(loanDate);

  const result = db
    .prepare('INSERT INTO loans (book_id, user_id, loan_date, due_date, status) VALUES (?, ?, ?, ?, ?)')
    .run(book.id, req.user.id, loanDate.toISOString(), dueDate.toISOString(), 'active');

  db.prepare('UPDATE books SET available_copies = available_copies - 1 WHERE id = ?').run(book.id);

  const loan = db.prepare('SELECT * FROM loans WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(loan);
}

function returnLoan(req, res) {
  const loan = db.prepare('SELECT * FROM loans WHERE id = ?').get(req.params.id);

  db.prepare("UPDATE loans SET status = 'returned', return_date = ? WHERE id = ?").run(
    new Date().toISOString(),
    loan.id
  );

  db.prepare('UPDATE books SET available_copies = available_copies + 1 WHERE id = ?').run(loan.book_id);

  const updated = db.prepare('SELECT * FROM loans WHERE id = ?').get(loan.id);
  res.json(updated);
}

module.exports = { list, getById, create, returnLoan };
