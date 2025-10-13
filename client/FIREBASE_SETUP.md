# Firebase セットアップガイド

このアプリでは、Firebaseを使ってクラウドバックアップとマルチデバイス同期を実現しています。

## 🚀 セットアップ手順

### 1. Firebaseプロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力（例: `memo-app`）
4. Google Analyticsは任意で設定
5. 「プロジェクトを作成」をクリック

### 2. Webアプリの登録

1. Firebase Consoleでプロジェクトを開く
2. プロジェクトの設定（歯車アイコン）> 「全般」タブを開く
3. 「マイアプリ」セクションで「</>」（Web）アイコンをクリック
4. アプリのニックネームを入力（例: `memo-web-app`）
5. 「アプリを登録」をクリック
6. Firebase SDKの設定情報が表示されるので、**コピーしてメモしておく**

### 3. Authentication（認証）の設定

1. Firebase Console左メニューから「Authentication」を選択
2. 「始める」をクリック
3. 「Sign-in method」タブを開く
4. 「Google」を選択して有効化
5. プロジェクトの公開名を入力
6. サポートメールを選択
7. 「保存」をクリック

### 4. Firestore Database の設定

1. Firebase Console左メニューから「Firestore Database」を選択
2. 「データベースを作成」をクリック
3. ロケーションを選択（例: `asia-northeast1`（東京））
4. セキュリティルールは「本番環境モード」を選択
5. 「有効にする」をクリック
6. 「ルール」タブを開き、以下のルールに変更：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザー自身のデータのみアクセス可能
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // ユーザーのメモコレクション
      match /memos/{memoId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

7. 「公開」をクリック

### 5. 環境変数の設定

#### ローカル開発の場合：

1. `client/.env` ファイルを作成
2. 以下の内容を貼り付け、Firebase SDKの設定情報で置き換える：

```bash
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### GitHub Pages / Vercel の場合：

**GitHub Secrets に追加：**
1. GitHubリポジトリ > Settings > Secrets and variables > Actions
2. 「New repository secret」をクリック
3. 以下の変数を追加：
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

**Vercel 環境変数：**
1. Vercel Dashboard > プロジェクト > Settings > Environment Variables
2. 上記と同じ変数を追加

### 6. 認証済みドメインの追加

1. Firebase Console > Authentication > Settings タブ
2. 「承認済みドメイン」セクションで「ドメインを追加」
3. 以下のドメインを追加：
   - `localhost`（開発用）
   - `127.0.0.1`（開発用）
   - あなたのGitHub Pagesドメイン（例: `username.github.io`）
   - あなたのVercelドメイン（例: `your-app.vercel.app`）

## ✅ 動作確認

1. アプリを起動: `npm run dev`
2. ブラウザで `http://localhost:5173` を開く
3. ヘッダーの「クラウド同期」ボタンをクリック
4. Googleアカウントでログイン
5. 「クラウド同期中」と表示されれば成功！

## 🔧 トラブルシューティング

### ログインできない場合

- Firebase Consoleで認証が有効になっているか確認
- 承認済みドメインにlocalhostが追加されているか確認
- ブラウザのコンソールでエラーを確認

### 同期が動作しない場合

- Firestoreのセキュリティルールが正しく設定されているか確認
- ブラウザのコンソールでエラーを確認
- Firebase Consoleでログイン状態を確認

### 環境変数が読み込まれない場合

- `.env`ファイルが`client/`ディレクトリ直下にあるか確認
- 変数名が`VITE_`で始まっているか確認
- 開発サーバーを再起動

## 📱 使い方

### クラウドバックアップ

1. ヘッダーの「クラウド同期」ボタンでログイン
2. 自動的にローカルとクラウドのデータが同期されます
3. 複数のデバイスで同じアカウントでログインすると、データが同期されます

### マルチデバイス対応

- 同じGoogleアカウントでログインすれば、すべてのデバイスでデータが同期されます
- リアルタイム同期：他のデバイスでの変更が自動的に反映されます

### ログアウト

- ヘッダーのログアウトボタンをクリック
- ローカルデータはそのまま残ります

## 🔒 セキュリティ

- すべてのデータは認証されたユーザーのみアクセス可能
- Firestoreのセキュリティルールで保護されています
- 他のユーザーはあなたのデータを見ることができません

## 💰 料金

- Firebaseの無料枠（Spark プラン）で十分使えます
- 無料枠の制限：
  - Firestore: 1GBのストレージ、50,000回の読み取り/日
  - Authentication: 無制限
  - 個人使用なら十分な容量です

