const bcrypt = require('bcryptjs');
const db = require('../db/init');

function list(req, res) {
  const users = db.prepare('SELECT * FROM users ORDER BY id').all();
  res.json(users);
}

function getById(req, res) {
  const user = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(req.params.id);
  res.json(user);
}

function create(req, res) {
  const { name, email, password, role } = req.body;

  const hash = bcrypt.hashSync(password, 10);
  const result = db
    .prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)')
    .run(name, email, hash, role || 'member');

  const user = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(user);
}

function update(req, res) {
  const { name, email, role } = req.body;

  db.prepare('UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?').run(
    name,
    email,
    role,
    req.params.id
  );

  const user = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(req.params.id);
  res.json(user);
}

function remove(req, res) {
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.status(204).send();
}

module.exports = { list, getById, create, update, remove };
