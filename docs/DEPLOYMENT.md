# デプロイメントガイド

## 前提条件

- Node.js 18以上
- npm または yarn
- Docker（オプション）
- Git

## ローカル開発環境のセットアップ

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd memo-app
```

### 2. 依存関係のインストール

```bash
# すべての依存関係をインストール
npm run install:all
```

### 3. 開発サーバーの起動

```bash
# フロントエンドとバックエンドを同時に起動
npm run dev
```

- フロントエンド: http://localhost:5173
- バックエンドAPI: http://localhost:3001

## Docker を使用したデプロイ

### 1. Docker Compose を使用（推奨）

```bash
# 本番環境
docker-compose up -d

# 開発環境
docker-compose --profile dev up -d
```

### 2. Dockerfile を使用

```bash
# イメージのビルド
docker build -t memo-app .

# コンテナの実行
docker run -p 3001:3001 -v $(pwd)/data:/app/data memo-app
```

## 本番環境へのデプロイ

### 1. サーバー環境の準備

```bash
# 必要なソフトウェアのインストール
sudo apt update
sudo apt install nodejs npm nginx

# Node.js のバージョン確認
node --version
npm --version
```

### 2. アプリケーションのデプロイ

```bash
# リポジトリのクローン
git clone <repository-url>
cd memo-app

# 依存関係のインストール
npm run install:all

# 本番用ビルド
npm run build

# アプリケーションの起動
cd server
npm start
```

### 3. Nginx の設定

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. PM2 を使用したプロセス管理

```bash
# PM2 のインストール
npm install -g pm2

# アプリケーションの起動
pm2 start server/index.js --name "memo-app"

# 自動起動の設定
pm2 startup
pm2 save
```

## 環境変数

以下の環境変数を設定できます：

```bash
NODE_ENV=production
PORT=3001
DB_PATH=/path/to/database.db
```

## データベースの管理

### バックアップ

```bash
# データのエクスポート
curl -o backup.json http://localhost:3001/api/sync/export

# データベースファイルの直接バックアップ
cp server/database/memos.db backup-$(date +%Y%m%d).db
```

### 復元

```bash
# JSON からの復元
curl -X POST -H "Content-Type: application/json" \
  -d @backup.json http://localhost:3001/api/sync/import

# データベースファイルからの復元
cp backup-20240101.db server/database/memos.db
```

## 監視とログ

### ログの確認

```bash
# PM2 のログ
pm2 logs memo-app

# Docker のログ
docker-compose logs -f memo-app
```

### ヘルスチェック

```bash
# アプリケーションの状態確認
curl http://localhost:3001/api/health
```

## トラブルシューティング

### よくある問題

1. **ポートが使用中**
   ```bash
   # ポートの使用状況確認
   lsof -i :3001
   
   # プロセスの終了
   kill -9 <PID>
   ```

2. **データベースエラー**
   ```bash
   # データベースファイルの権限確認
   ls -la server/database/
   
   # 権限の修正
   chmod 664 server/database/memos.db
   ```

3. **依存関係の問題**
   ```bash
   # node_modules のクリア
   rm -rf node_modules */node_modules
   npm run install:all
   ```

## セキュリティ

- 本番環境では HTTPS を使用
- 環境変数で機密情報を管理
- 定期的なセキュリティアップデート
- ファイアウォールの設定
- データベースのアクセス権限設定
