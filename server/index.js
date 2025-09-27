const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const memoRoutes = require('./routes/memos');
const syncRoutes = require('./routes/sync');
const { initDatabase } = require('./database/init');

const app = express();
const PORT = process.env.PORT || 3001;

// セキュリティミドルウェア
app.use(helmet());

// レート制限
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100 // リクエスト制限
});
app.use(limiter);

// CORS設定
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// ボディパーサー
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静的ファイル配信
app.use(express.static(path.join(__dirname, '../client/dist')));

// API ルート
app.use('/api/memos', memoRoutes);
app.use('/api/sync', syncRoutes);

// ヘルスチェック
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// SPA対応（すべてのルートをindex.htmlにリダイレクト）
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// データベース初期化とサーバー起動
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
  });
}).catch((error) => {
  console.error('❌ Failed to initialize database:', error);
  process.exit(1);
});

module.exports = app;
