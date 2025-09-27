# Memo App

日々の考え、メモ、タスク、思いつきを管理できるクロスプラットフォームのメモアプリです。

## 機能

- 📝 メモの作成・編集・削除
- ✅ タスクの完了管理
- 🏷️ カテゴリ分類
- 📱 レスポンシブデザイン（スマホ・PC対応）
- 🔄 GitHub連携によるデータ同期
- 💾 ローカルデータベース（SQLite）

## 技術スタック

- **フロントエンド**: React + TypeScript + Vite
- **バックエンド**: Node.js + Express
- **データベース**: SQLite
- **スタイリング**: Tailwind CSS

## セットアップ

### 必要な環境
- Node.js 18以上
- npm または yarn

### インストール

```bash
# 依存関係をインストール
npm run install:all

# 開発サーバーを起動
npm run dev
```

### アクセス
- フロントエンド: http://localhost:5173
- バックエンドAPI: http://localhost:3001

## 機能詳細

### 📝 メモ管理
- メモの作成・編集・削除
- リッチテキスト対応
- カテゴリ分類
- タグ付け機能

### ✅ タスク管理
- タスクとしての管理
- 完了状態の切り替え
- 優先度設定（高・中・低）
- 進捗の視覚化

### 🔍 検索・フィルター
- 全文検索
- カテゴリ別フィルター
- タスク/メモ別フィルター
- 完了状態別フィルター
- タグ別フィルター

### 📊 統計情報
- 総メモ数
- タスク数・完了数
- 完了率
- 優先度別統計

### 🔄 データ同期
- GitHub連携
- 自動バックアップ
- データエクスポート/インポート
- クロスプラットフォーム対応

## プロジェクト構造

```
memo-app/
├── client/                 # React フロントエンド
│   ├── src/
│   │   ├── components/     # React コンポーネント
│   │   ├── hooks/         # カスタムフック
│   │   ├── pages/         # ページコンポーネント
│   │   ├── services/      # API サービス
│   │   └── types/         # TypeScript 型定義
│   └── public/            # 静的ファイル
├── server/                # Node.js バックエンド
│   ├── routes/            # API ルート
│   ├── database/          # データベース関連
│   └── scripts/           # ユーティリティスクリプト
├── data/                  # データエクスポート
├── docs/                  # ドキュメント
├── .github/               # GitHub Actions
├── docker-compose.yml     # Docker 設定
└── README.md
```

## デプロイ

### ローカル開発
```bash
npm run dev
```

### Docker
```bash
docker-compose up -d
```

### 本番環境
詳細は [デプロイメントガイド](docs/DEPLOYMENT.md) を参照してください。

## API

APIの詳細は [APIドキュメント](docs/API.md) を参照してください。

## ライセンス

MIT License
