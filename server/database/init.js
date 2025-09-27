const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'memos.db');

let db = null;

const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('❌ Database connection error:', err);
        reject(err);
        return;
      }
      console.log('✅ Connected to SQLite database');
      
      // テーブル作成
      createTables()
        .then(() => {
          console.log('✅ Database tables created successfully');
          resolve();
        })
        .catch(reject);
    });
  });
};

const createTables = () => {
  return new Promise((resolve, reject) => {
    const createMemosTable = `
      CREATE TABLE IF NOT EXISTS memos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        category TEXT DEFAULT 'general',
        is_task BOOLEAN DEFAULT 0,
        is_completed BOOLEAN DEFAULT 0,
        priority INTEGER DEFAULT 1,
        tags TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    db.run(createMemosTable, (err) => {
      if (err) {
        console.error('❌ Error creating memos table:', err);
        reject(err);
        return;
      }
      resolve();
    });
  });
};

const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

const closeDatabase = () => {
  return new Promise((resolve) => {
    if (db) {
      db.close((err) => {
        if (err) {
          console.error('❌ Error closing database:', err);
        } else {
          console.log('✅ Database connection closed');
        }
        resolve();
      });
    } else {
      resolve();
    }
  });
};

// プロセス終了時のクリーンアップ
process.on('SIGINT', closeDatabase);
process.on('SIGTERM', closeDatabase);

module.exports = {
  initDatabase,
  getDatabase,
  closeDatabase
};
