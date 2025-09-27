const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../database/memos.db');
const EXPORT_PATH = path.join(__dirname, '../../data');

// エクスポートディレクトリを作成
if (!fs.existsSync(EXPORT_PATH)) {
  fs.mkdirSync(EXPORT_PATH, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  }
  console.log('✅ Connected to SQLite database for export');
});

// データをJSONにエクスポート
db.all('SELECT * FROM memos ORDER BY created_at DESC', (err, rows) => {
  if (err) {
    console.error('❌ Error fetching data:', err);
    process.exit(1);
  }

  // タグを配列に変換
  const memos = rows.map(row => ({
    ...row,
    tags: row.tags ? row.tags.split(',').map(tag => tag.trim()) : [],
    is_task: Boolean(row.is_task),
    is_completed: Boolean(row.is_completed)
  }));

  const exportData = {
    exported_at: new Date().toISOString(),
    total_memos: memos.length,
    memos: memos
  };

  const jsonData = JSON.stringify(exportData, null, 2);
  const filePath = path.join(EXPORT_PATH, 'memos.json');

  fs.writeFile(filePath, jsonData, (err) => {
    if (err) {
      console.error('❌ Error writing export file:', err);
      process.exit(1);
    }
    console.log(`✅ Data exported to ${filePath}`);
    console.log(`📊 Exported ${memos.length} memos`);
    
    db.close();
  });
});
