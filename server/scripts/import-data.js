const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../database/memos.db');
const IMPORT_PATH = path.join(__dirname, '../../data/memos.json');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  }
  console.log('✅ Connected to SQLite database for import');
});

// JSONファイルからデータをインポート
if (!fs.existsSync(IMPORT_PATH)) {
  console.error('❌ Import file not found:', IMPORT_PATH);
  process.exit(1);
}

const importData = JSON.parse(fs.readFileSync(IMPORT_PATH, 'utf8'));
console.log(`📥 Importing ${importData.memos.length} memos from ${importData.exported_at}`);

// 既存のデータをクリア
db.run('DELETE FROM memos', (err) => {
  if (err) {
    console.error('❌ Error clearing existing data:', err);
    process.exit(1);
  }
  console.log('🗑️ Cleared existing data');

  // 新しいデータを挿入
  const stmt = db.prepare(`
    INSERT INTO memos (title, content, category, is_task, is_completed, priority, tags, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let imported = 0;
  importData.memos.forEach((memo, index) => {
    const tagsString = Array.isArray(memo.tags) ? memo.tags.join(',') : memo.tags || '';
    
    stmt.run([
      memo.title,
      memo.content || '',
      memo.category || 'general',
      memo.is_task ? 1 : 0,
      memo.is_completed ? 1 : 0,
      memo.priority || 1,
      tagsString,
      memo.created_at,
      memo.updated_at
    ], (err) => {
      if (err) {
        console.error(`❌ Error importing memo ${index + 1}:`, err);
      } else {
        imported++;
      }
      
      if (index === importData.memos.length - 1) {
        stmt.finalize((err) => {
          if (err) {
            console.error('❌ Error finalizing statement:', err);
          } else {
            console.log(`✅ Successfully imported ${imported} memos`);
            db.close();
          }
        });
      }
    });
  });
});
