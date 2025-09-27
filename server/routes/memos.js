const express = require('express');
const { getDatabase } = require('../database/init');
const router = express.Router();

// メモ一覧取得
router.get('/', (req, res) => {
  const db = getDatabase();
  const { category, is_task, is_completed } = req.query;
  
  let query = 'SELECT * FROM memos WHERE 1=1';
  const params = [];
  
  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  
  if (is_task !== undefined) {
    query += ' AND is_task = ?';
    params.push(is_task === 'true' ? 1 : 0);
  }
  
  if (is_completed !== undefined) {
    query += ' AND is_completed = ?';
    params.push(is_completed === 'true' ? 1 : 0);
  }
  
  query += ' ORDER BY created_at DESC';
  
  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('❌ Error fetching memos:', err);
      res.status(500).json({ error: 'Failed to fetch memos' });
      return;
    }
    
    // タグを配列に変換
    const memos = rows.map(row => ({
      ...row,
      tags: row.tags ? row.tags.split(',').map(tag => tag.trim()) : [],
      is_task: Boolean(row.is_task),
      is_completed: Boolean(row.is_completed)
    }));
    
    res.json(memos);
  });
});

// メモ詳細取得
router.get('/:id', (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  
  db.get('SELECT * FROM memos WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('❌ Error fetching memo:', err);
      res.status(500).json({ error: 'Failed to fetch memo' });
      return;
    }
    
    if (!row) {
      res.status(404).json({ error: 'Memo not found' });
      return;
    }
    
    const memo = {
      ...row,
      tags: row.tags ? row.tags.split(',').map(tag => tag.trim()) : [],
      is_task: Boolean(row.is_task),
      is_completed: Boolean(row.is_completed)
    };
    
    res.json(memo);
  });
});

// メモ作成
router.post('/', (req, res) => {
  const db = getDatabase();
  const { title, content, category, is_task, priority, tags } = req.body;
  
  if (!title || title.trim() === '') {
    res.status(400).json({ error: 'Title is required' });
    return;
  }
  
  const tagsString = Array.isArray(tags) ? tags.join(',') : '';
  
  const query = `
    INSERT INTO memos (title, content, category, is_task, priority, tags)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  const params = [
    title.trim(),
    content || '',
    category || 'general',
    is_task ? 1 : 0,
    priority || 1,
    tagsString
  ];
  
  db.run(query, params, function(err) {
    if (err) {
      console.error('❌ Error creating memo:', err);
      res.status(500).json({ error: 'Failed to create memo' });
      return;
    }
    
    res.status(201).json({
      id: this.lastID,
      message: 'Memo created successfully'
    });
  });
});

// メモ更新
router.put('/:id', (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const { title, content, category, is_task, is_completed, priority, tags } = req.body;
  
  if (!title || title.trim() === '') {
    res.status(400).json({ error: 'Title is required' });
    return;
  }
  
  const tagsString = Array.isArray(tags) ? tags.join(',') : '';
  
  const query = `
    UPDATE memos 
    SET title = ?, content = ?, category = ?, is_task = ?, is_completed = ?, priority = ?, tags = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  const params = [
    title.trim(),
    content || '',
    category || 'general',
    is_task ? 1 : 0,
    is_completed ? 1 : 0,
    priority || 1,
    tagsString,
    id
  ];
  
  db.run(query, params, function(err) {
    if (err) {
      console.error('❌ Error updating memo:', err);
      res.status(500).json({ error: 'Failed to update memo' });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Memo not found' });
      return;
    }
    
    res.json({ message: 'Memo updated successfully' });
  });
});

// メモ削除
router.delete('/:id', (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  
  db.run('DELETE FROM memos WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('❌ Error deleting memo:', err);
      res.status(500).json({ error: 'Failed to delete memo' });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Memo not found' });
      return;
    }
    
    res.json({ message: 'Memo deleted successfully' });
  });
});

// カテゴリ一覧取得
router.get('/categories/list', (req, res) => {
  const db = getDatabase();
  
  db.all('SELECT DISTINCT category FROM memos ORDER BY category', (err, rows) => {
    if (err) {
      console.error('❌ Error fetching categories:', err);
      res.status(500).json({ error: 'Failed to fetch categories' });
      return;
    }
    
    const categories = rows.map(row => row.category);
    res.json(categories);
  });
});

// タグ一覧取得
router.get('/tags/list', (req, res) => {
  const db = getDatabase();
  
  db.all('SELECT DISTINCT tags FROM memos WHERE tags IS NOT NULL AND tags != ""', (err, rows) => {
    if (err) {
      console.error('❌ Error fetching tags:', err);
      res.status(500).json({ error: 'Failed to fetch tags' });
      return;
    }
    
    const allTags = new Set();
    rows.forEach(row => {
      if (row.tags) {
        row.tags.split(',').forEach(tag => {
          if (tag.trim()) {
            allTags.add(tag.trim());
          }
        });
      }
    });
    
    res.json(Array.from(allTags).sort());
  });
});

module.exports = router;
