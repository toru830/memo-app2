# GitHub Pages デプロイガイド

## 🚀 デプロイ手順

### 1. GitHub Secrets の設定

GitHubリポジトリで以下のSecretsを設定してください：

1. **GitHubリポジトリ** → **Settings** → **Secrets and variables** → **Actions**

2. **「New repository secret」** をクリックして、以下の6つのSecretsを追加：

| Secret名 | 値 |
|---------|-----|
| `VITE_FIREBASE_API_KEY` | `AIzaSyBhl1GkAnWHRxyza7X9-M8Y3sdWhHGRiC0` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `memo-app-7d6cf.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `memo-app-7d6cf` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `memo-app-7d6cf.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `935089831921` |
| `VITE_FIREBASE_APP_ID` | `1:935089831921:web:1ac161a36bc175c1090e50` |

### 2. Firebase Console で承認済みドメインを追加

1. **Firebase Console** → **Authentication** → **Settings** → **承認済みドメイン**

2. 以下のドメインを追加：
   - `localhost`（開発用）
   - `127.0.0.1`（開発用）
   - `あなたのGitHubユーザー名.github.io`（例：`toru830.github.io`）

### 3. GitHub Pages の有効化

1. **GitHubリポジトリ** → **Settings** → **Pages**

2. **Source** を **「GitHub Actions」** に設定

3. **Save** をクリック

### 4. デプロイの実行

1. コードをGitHubにプッシュ：
   ```bash
   git add .
   git commit -m "Add GitHub Pages deployment"
   git push origin main
   ```

2. **Actions** タブでデプロイの進行状況を確認

3. デプロイ完了後、`https://あなたのGitHubユーザー名.github.io/memo-app/` でアクセス可能

## ✅ 動作確認

1. **デプロイされたURL** にアクセス
2. **「クラウド同期」ボタン** をクリック
3. **Googleアカウントでログイン**
4. **「クラウド同期中」と表示されれば成功！**

## 🔧 トラブルシューティング

### ログインできない場合
- Firebase Consoleで承認済みドメインにGitHub Pagesのドメインが追加されているか確認
- GitHub Secretsが正しく設定されているか確認

### デプロイが失敗する場合
- GitHub Actionsのログを確認
- Secretsの値が正しいか確認
- ブランチ名が `main` または `master` か確認

## 📱 利用方法

デプロイ後は以下の機能が利用できます：

- 🔐 **Googleアカウントでログイン**
- ☁️ **クラウドにデータを自動保存**
- 📱 **スマホを変えてもデータが復元**
- 🗑️ **ブラウザのキャッシュを消してもデータが残る**
- 🔄 **複数デバイス間でリアルタイム同期**

どこからでもアクセスできるようになりました！
