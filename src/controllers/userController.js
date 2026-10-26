const db = require('../db/init');

function list(req, res) {
  const users = db.prepare('SELECT * FROM users ORDER BY id').all();
  res.json(users);
}

module.exports = { list };
