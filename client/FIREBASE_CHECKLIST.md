# Firebase設定チェックリスト

## プロジェクト情報
- **プロジェクトID**: `memo-app-7d6cf`
- **Firebase Console**: https://console.firebase.google.com/u/0/project/memo-app-7d6cf/overview

---

## 🔥 設定タスク

### ✅ 完了済み
- [x] Firebaseプロジェクト作成 (`memo-app-7d6cf`)

### 📝 実施中のタスク

#### 1. Webアプリの登録
URL: https://console.firebase.google.com/u/0/project/memo-app-7d6cf/settings/general

手順:
1. 「マイアプリ」セクションで「</>」アイコンをクリック
2. アプリのニックネーム: `memo-web-app` と入力
3. 「Firebase Hostingの設定」はスキップ
4. 「アプリを登録」をクリック
5. 表示されるFirebase SDK設定をコピー:

```javascript
// この形式の情報が表示されます
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "memo-app-7d6cf.firebaseapp.com",
  projectId: "memo-app-7d6cf",
  storageBucket: "memo-app-7d6cf.appspot.com",
  messagingSenderId: "...",
  appId: "1:...:web:..."
};
```

**👉 この情報を次のステップで使います！**

---

#### 2. Authentication（Google認証）の設定
URL: https://console.firebase.google.com/u/0/project/memo-app-7d6cf/authentication/providers

手順:
1. 「始める」をクリック（初回のみ）
2. 「Sign-in method」タブを開く
3. 「Google」を見つけてクリック
4. 右上の「有効にする」トグルをON
5. プロジェクトの公開名: `Memo App`
6. プロジェクトのサポートメール: あなたのGmailアドレスを選択
7. 「保存」をクリック

---

#### 3. Firestore Database の作成
URL: https://console.firebase.google.com/u/0/project/memo-app-7d6cf/firestore

手順:
1. 「データベースを作成」をクリック
2. **「本番環境モードで開始」** を選択（重要！）
3. 「次へ」をクリック
4. ロケーション: **「asia-northeast1 (Tokyo)」** を選択
5. 「有効にする」をクリック
6. 作成完了を待つ（数十秒）

---

#### 4. Firestore セキュリティルールの設定
URL: https://console.firebase.google.com/u/0/project/memo-app-7d6cf/firestore/rules

手順:
1. データベース作成後、「ルール」タブを開く
2. エディタに以下のルールをコピー&ペースト:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /memos/{memoId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

3. 「公開」ボタンをクリック
4. 確認ダイアログで「公開」をクリック

---

#### 5. 承認済みドメインの追加
URL: https://console.firebase.google.com/u/0/project/memo-app-7d6cf/authentication/settings

手順:
1. 「Settings」タブを開く
2. 下にスクロールして「承認済みドメイン」セクションを探す
3. 「ドメインを追加」をクリック
4. 以下のドメインを1つずつ追加:
   - `localhost`
   - `toru830.github.io`

---

## 🔑 GitHub Secrets の設定

**前提**: ステップ1で取得したFirebase SDK設定情報を使用

URL: https://github.com/toru830/memo-app/settings/secrets/actions

手順:
1. 「New repository secret」をクリック
2. 以下の6つのSecretを1つずつ追加:

| Secret名 | 値の例 | 説明 |
|---------|--------|------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyC...` | Firebase SDK設定の `apiKey` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `memo-app-7d6cf.firebaseapp.com` | Firebase SDK設定の `authDomain` |
| `VITE_FIREBASE_PROJECT_ID` | `memo-app-7d6cf` | Firebase SDK設定の `projectId` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `memo-app-7d6cf.appspot.com` | Firebase SDK設定の `storageBucket` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789` | Firebase SDK設定の `messagingSenderId` |
| `VITE_FIREBASE_APP_ID` | `1:123456789:web:xxxxx` | Firebase SDK設定の `appId` |

**重要**: 各値は `firebaseConfig` から正確にコピーしてください！

---

## ✅ 設定完了後の確認

### GitHub Actions の実行
1. 任意のコミットをプッシュ（または Actions タブから手動実行）
2. GitHub Actionsが成功することを確認
3. 数分後、GitHub Pagesを開く: https://toru830.github.io/memo-app/

### アプリでのテスト
1. https://toru830.github.io/memo-app/ を開く
2. ヘッダーの「Cloud Sync」ボタンをクリック
3. Googleアカウントでログイン
4. 「Syncing...」と表示された後、ユーザーアイコンが表示されれば成功！

---

## 🆘 トラブルシューティング

### 「Firebase設定が必要です」と表示される
→ GitHub Secretsが正しく設定されていません。上記の手順を再確認してください。

### ログインできない
→ 承認済みドメインに `toru830.github.io` が追加されているか確認してください。

### データが同期されない
→ Firestoreのセキュリティルールが正しく設定されているか確認してください。

---

## 📞 次のステップ

すべて完了したら:
1. スマートフォンで https://toru830.github.io/memo-app/ を開く
2. Googleアカウントでログイン
3. メモを作成してクラウドに保存
4. 別のデバイスでログインして同期を確認
