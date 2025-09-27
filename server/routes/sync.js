const express = require('express');
const { getDatabase } = require('../database/init');
const router = express.Router();

// データエクスポート
router.get('/export', (req, res) => {
  const db = getDatabase();
  
  db.all('SELECT * FROM memos ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      console.error('❌ Error fetching data for export:', err);
      res.status(500).json({ error: 'Failed to export data' });
      return;
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

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="memos-${Date.now()}.json"`);
    res.json(exportData);
  });
});

// データインポート（JSON形式）
router.post('/import', (req, res) => {
  const db = getDatabase();
  const { memos } = req.body;

  if (!Array.isArray(memos)) {
    res.status(400).json({ error: 'Invalid data format' });
    return;
  }

  // トランザクション開始
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    const stmt = db.prepare(`
      INSERT INTO memos (title, content, category, is_task, is_completed, priority, tags, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let imported = 0;
    let errors = [];

    memos.forEach((memo, index) => {
      const tagsString = Array.isArray(memo.tags) ? memo.tags.join(',') : memo.tags || '';
      
      stmt.run([
        memo.title || '',
        memo.content || '',
        memo.category || 'general',
        memo.is_task ? 1 : 0,
        memo.is_completed ? 1 : 0,
        memo.priority || 1,
        tagsString,
        memo.created_at || new Date().toISOString(),
        memo.updated_at || new Date().toISOString()
      ], function(err) {
        if (err) {
          errors.push({ index, error: err.message });
        } else {
          imported++;
        }
      });
    });

    stmt.finalize((err) => {
      if (err) {
        db.run('ROLLBACK');
        res.status(500).json({ error: 'Failed to import data' });
        return;
      }

      db.run('COMMIT', (err) => {
        if (err) {
          db.run('ROLLBACK');
          res.status(500).json({ error: 'Failed to commit transaction' });
          return;
        }

        res.json({
          message: 'Data imported successfully',
          imported,
          errors: errors.length > 0 ? errors : undefined
        });
      });
    });
  });
});

// データベースのバックアップ作成
router.post('/backup', (req, res) => {
  const db = getDatabase();
  
  db.all('SELECT * FROM memos ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      console.error('❌ Error creating backup:', err);
      res.status(500).json({ error: 'Failed to create backup' });
      return;
    }

    const backup = {
      created_at: new Date().toISOString(),
      version: '1.0',
      total_memos: rows.length,
      memos: rows.map(row => ({
        ...row,
        tags: row.tags ? row.tags.split(',').map(tag => tag.trim()) : [],
        is_task: Boolean(row.is_task),
        is_completed: Boolean(row.is_completed)
      }))
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="backup-${Date.now()}.json"`);
    res.json(backup);
  });
});

module.exports = router;
