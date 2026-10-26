const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbFile = process.env.DATABASE_FILE || './data/biblioteca.db';
const dbPath = path.resolve(process.cwd(), dbFile);

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

module.exports = db;
