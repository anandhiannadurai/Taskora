const path = require('path');
const fs = require('fs');

let dbDriver = 'sqlite';
let pool = null;
let sqliteDb = null;

// Environment setup
const dbUrl = process.env.DATABASE_URL;
const usePostgres = process.env.DB_TYPE === 'postgres' || Boolean(dbUrl);

if (usePostgres) {
  try {
    const { Pool } = require('pg');
    pool = new Pool({
      connectionString: dbUrl || 'postgresql://postgres:postgres@localhost:5432/taskora',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    dbDriver = 'postgres';
    console.log('[Taskora DB] Initialized PostgreSQL connection pool');
  } catch (err) {
    console.warn('[Taskora DB] Failed to load PostgreSQL pool, falling back to SQLite:', err.message);
  }
}

if (dbDriver === 'sqlite') {
  const sqlite3 = require('sqlite3').verbose();
  const dbPath = path.join(__dirname, '../../data/taskora.db');
  const dataDir = path.dirname(dbPath);

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  sqliteDb = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('[Taskora DB] SQLite Connection error:', err.message);
    } else {
      console.log(`[Taskora DB] Connected to local SQLite database at ${dbPath}`);
    }
  });
}

// Unified query wrapper supporting both async SQLite and PG
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    if (dbDriver === 'postgres' && pool) {
      // Convert ? to $1, $2 for Postgres if needed
      let paramIdx = 1;
      const pgSql = sql.replace(/\?/g, () => `$${paramIdx++}`);
      pool.query(pgSql, params, (err, res) => {
        if (err) return reject(err);
        resolve(res.rows);
      });
    } else {
      // SQLite execution
      const trimmedSql = sql.trim().toUpperCase();
      if (trimmedSql.startsWith('SELECT') || trimmedSql.startsWith('PRAGMA') || trimmedSql.startsWith('WITH')) {
        sqliteDb.all(sql, params, (err, rows) => {
          if (err) return reject(err);
          resolve(rows || []);
        });
      } else {
        sqliteDb.run(sql, params, function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID, changes: this.changes });
        });
      }
    }
  });
};

const execute = (sql, params = []) => query(sql, params);

module.exports = {
  query,
  execute,
  dbDriver
};
