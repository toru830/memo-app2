# マルチステージビルド
FROM node:18-alpine AS builder

# 作業ディレクトリを設定
WORKDIR /app

# 依存関係をコピーしてインストール
COPY package*.json ./
RUN npm ci

# クライアントの依存関係をインストール
COPY client/package*.json ./client/
RUN cd client && npm ci

# サーバーの依存関係をインストール
COPY server/package*.json ./server/
RUN cd server && npm ci

# ソースコードをコピー
COPY . .

# クライアントをビルド
RUN cd client && npm run build

# 本番用イメージ
FROM node:18-alpine AS production

WORKDIR /app

# 本番用の依存関係のみをインストール
COPY package*.json ./
RUN npm ci --only=production

COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

# ビルドされたクライアントとサーバーコードをコピー
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/server ./server

# データベースディレクトリを作成
RUN mkdir -p server/database

# ポートを公開
EXPOSE 3001

# 環境変数を設定
ENV NODE_ENV=production
ENV PORT=3001

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# アプリケーションを起動
CMD ["cd", "server", "&&", "npm", "start"]
