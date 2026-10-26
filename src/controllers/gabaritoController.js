const { readFileSync } = require('node:fs');
const path = require('node:path');

function get(req, res) {
  const caminho = path.join(__dirname, '..', '..', 'docs', 'gabarito.json');
  const data = JSON.parse(readFileSync(caminho, 'utf8'));
  res.json(data);
}

module.exports = { get };
