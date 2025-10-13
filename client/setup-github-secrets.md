# GitHub Secrets設定手順

## 1. Firebase Consoleで設定情報を取得

### Webアプリの設定情報を取得
1. https://console.firebase.google.com/u/0/project/memo-app-7d6cf/overview にアクセス
2. **プロジェクトの設定** (歯車アイコン) → **「全般」** タブ
3. **「マイアプリ」** セクションで **「</>」** (Web) アイコンをクリック
4. **アプリのニックネーム**: `memo-web-app`
5. **「アプリを登録」** をクリック
6. 表示される設定情報をコピー

例:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "memo-app-7d6cf.firebaseapp.com",
  projectId: "memo-app-7d6cf",
  storageBucket: "memo-app-7d6cf.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxx"
};
```

## 2. GitHub Secretsに追加

1. https://github.com/toru830/memo-app にアクセス
2. **Settings** → **Secrets and variables** → **Actions**
3. **「New repository secret」** で以下を追加:

### 必要なSecrets:
- `VITE_FIREBASE_API_KEY` = `AIzaSyC...` (上記のapiKeyの値)
- `VITE_FIREBASE_AUTH_DOMAIN` = `memo-app-7d6cf.firebaseapp.com`
- `VITE_FIREBASE_PROJECT_ID` = `memo-app-7d6cf`
- `VITE_FIREBASE_STORAGE_BUCKET` = `memo-app-7d6cf.appspot.com`
- `VITE_FIREBASE_MESSAGING_SENDER_ID` = `123456789` (上記のmessagingSenderIdの値)
- `VITE_FIREBASE_APP_ID` = `1:123456789:web:xxxxx` (上記のappIdの値)

## 3. 設定完了後の確認

GitHub Secretsを設定後:
1. 任意のコミットをプッシュしてGitHub Actionsを実行
2. https://toru830.github.io/memo-app/ でクラウド同期ボタンをテスト
3. Googleアカウントでログインできることを確認
