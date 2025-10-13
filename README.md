# Memo App

日々の考え、メモ、タスク、思いつきを管理できるクロスプラットフォームのメモアプリです。

## ✨ 主な機能

- 📝 **メモ・タスク管理**: メモの作成、編集、削除、タスクの完了管理
- 🏷️ **カテゴリ分類**: 買い物、仕事、プライベート、思い、アイデア、その他
- ☁️ **クラウドバックアップ**: Firebaseによるリアルタイム同期
- 🔐 **Google認証**: 安全なデータアクセス
- 📱 **マルチデバイス対応**: スマホ、PC、タブレットで同期
- 🎨 **モダンUI**: ダークテーマ、タブナビゲーション、直感的な操作

## 🛠️ 技術スタック

- **フロントエンド**: React + TypeScript + Vite
- **スタイリング**: Tailwind CSS + Lucide Icons
- **認証**: Firebase Authentication (Google)
- **データベース**: Firebase Firestore + LocalStorage
- **デプロイ**: GitHub Pages
- **CI/CD**: GitHub Actions

## 🚀 クイックスタート

### 1. アプリを使う（最速！）
**デプロイ済みアプリ**: https://toru830.github.io/memo-app/

1. 上記URLをスマホ/PCで開く
2. 「Cloud Sync」ボタンでGoogleログイン
3. すぐにメモ作成開始！

### 2. ローカル開発

#### 必要な環境
- Node.js 18以上
- Firebase プロジェクト（クラウド同期を使う場合）

#### インストール

```bash
# リポジトリをクローン
git clone https://github.com/toru830/memo-app.git
cd memo-app

# 依存関係をインストール
cd client
npm install

# 開発サーバーを起動
npm run dev
```

#### アクセス
- フロントエンド: http://localhost:5173/memo-app/

### 3. Firebase設定（クラウド同期を有効化）

**📖 詳細ガイド**: [client/quick-firebase-setup.md](client/quick-firebase-setup.md)

クイック手順（5分）:
1. Firebaseプロジェクト作成
2. Google認証を有効化
3. Firestore Databaseを作成
4. GitHub Secretsに設定情報を追加

詳しくは `client/FIREBASE_CHECKLIST.md` を参照してください。

## 📱 機能詳細

### 📝 メモ管理
- メモの作成・編集・削除
- カテゴリ分類（買い物、仕事、プライベート、思い、アイデア、その他）
- クイック作成ボタン
- 音声入力対応

### ✅ タスク管理
- タスク/メモの切り替え
- 完了状態の管理
- 優先度設定（高・中・低）
- タスク専用タブで一覧表示

### 🔍 検索・フィルター
- 全文検索（ホームタブ）
- カテゴリ別タブナビゲーション
- タスク完了状態フィルター

### 📊 統計情報
- 総メモ数（設定画面）
- タスク数・完了数（各タブ）
- 完了率の表示

### ☁️ クラウド同期
- Firebase Firestore による自動同期
- Google認証でセキュアなアクセス
- リアルタイム更新（マルチデバイス）
- LocalStorage によるオフライン対応
- データエクスポート/インポート（JSON）

## 📁 プロジェクト構造

```
memo-app/
├── client/                      # React フロントエンド
│   ├── src/
│   │   ├── components/          # UI コンポーネント
│   │   │   ├── MemoCard.tsx     # メモ表示カード
│   │   │   ├── MemoForm.tsx     # メモ作成/編集フォーム
│   │   │   ├── TabNavigation.tsx # タブナビゲーション
│   │   │   ├── ModernHeader.tsx  # ヘッダー
│   │   │   ├── AuthButton.tsx    # 認証ボタン
│   │   │   └── ...
│   │   ├── services/            # サービス層
│   │   │   ├── firebase.ts      # Firebase初期化
│   │   │   ├── authService.ts   # 認証サービス
│   │   │   ├── firestoreService.ts # Firestore操作
│   │   │   ├── syncService.ts   # データ同期
│   │   │   └── localStorage.ts  # ローカルストレージ
│   │   ├── hooks/               # カスタムフック
│   │   ├── pages/               # ページ
│   │   └── types/               # TypeScript型定義
│   ├── FIREBASE_SETUP.md        # Firebase詳細ガイド
│   ├── quick-firebase-setup.md  # Firebaseクイックガイド
│   └── FIREBASE_CHECKLIST.md    # 設定チェックリスト
├── .github/workflows/           # CI/CD
│   └── deploy.yml              # GitHub Pages デプロイ
└── README.md
```

## 🚢 デプロイ

### GitHub Pages（本番環境）
- **URL**: https://toru830.github.io/memo-app/
- **自動デプロイ**: main ブランチへのプッシュで自動デプロイ
- **CI/CD**: GitHub Actions

### ローカル開発
```bash
cd client
npm install
npm run dev
```

### ビルド
```bash
cd client
npm run build
```

## ライセンス

MIT License
