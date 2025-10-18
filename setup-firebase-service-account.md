# Firebase Service Account 設定手順

## 🔐 Firebase Service Account キーの生成

### 1. Firebase Console にアクセス
**URL**: https://console.firebase.google.com/u/0/project/memo-app-7d6cf/settings/serviceaccounts/adminsdk

### 2. 新しい秘密鍵を生成
1. **「新しい秘密鍵を生成」** ボタンをクリック
2. **「キーを生成」** をクリック
3. **JSONファイルがダウンロード**されるので、内容をコピー

## 🔧 GitHub Secrets の設定

### 1. GitHub Secrets にアクセス
**URL**: https://github.com/toru830/memo-app/settings/secrets/actions

### 2. 新しいSecretを追加
- **Name**: `FIREBASE_SERVICE_ACCOUNT_MEMO_APP_7D6CF`
- **Secret**: ダウンロードしたJSONファイルの内容をそのまま貼り付け

## 🚀 デプロイの確認

### 1. GitHub Actions の実行
- コードをプッシュすると自動的にFirebase Hostingにデプロイされます
- **Actions** タブでデプロイの進行状況を確認

### 2. アクセスURL
- **Firebase Hosting**: https://memo-app-7d6cf.web.app/
- **GitHub Pages**: https://toru830.github.io/memo-app/

## ✅ 完了！

これで、GitHub ActionsからFirebase Hostingへの自動デプロイが可能になります！

### 設定済みの機能：
- ✅ Firebase環境変数
- ✅ Service Account認証
- ✅ 自動デプロイ
- ✅ セキュリティルール
- ✅ 承認済みドメイン
