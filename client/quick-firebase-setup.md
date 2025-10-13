# 🚀 Firebase 5分クイックセットアップ

## プロジェクト: memo-app-7d6cf

### 📍 ステップ1: Webアプリ登録（1分）

1. **このリンクを開く**: https://console.firebase.google.com/u/0/project/memo-app-7d6cf/settings/general
2. 下にスクロールして「マイアプリ」を探す
3. **「</>」アイコン** をクリック
4. アプリのニックネーム: **`memo-web-app`** と入力
5. 「Firebase Hostingの設定」は **チェックしない**
6. **「アプリを登録」** をクリック
7. 表示されるコードの **`firebaseConfig`** の部分をコピー 📋

```javascript
// この部分をコピーしてメモ帳に保存！
const firebaseConfig = {
  apiKey: "AIza...",                          // ← これ
  authDomain: "memo-app-7d6cf.firebaseapp.com", // ← これ
  projectId: "memo-app-7d6cf",                // ← これ
  storageBucket: "memo-app-7d6cf.appspot.com", // ← これ
  messagingSenderId: "...",                   // ← これ
  appId: "1:...:web:..."                      // ← これ
};
```

---

### 📍 ステップ2: Google認証設定（1分）

1. **このリンクを開く**: https://console.firebase.google.com/u/0/project/memo-app-7d6cf/authentication/providers
2. 「**始める**」をクリック（初回のみ）
3. 「**Sign-in method**」タブが開いていることを確認
4. リストから **「Google」** を見つけてクリック
5. 右上の **「有効にする」** トグルを **ON** にする
6. プロジェクトの公開名: **`Memo App`** と入力
7. サポートメール: **あなたのGmailアドレス** を選択
8. **「保存」** をクリック

---

### 📍 ステップ3: Firestore Database作成（1分）

1. **このリンクを開く**: https://console.firebase.google.com/u/0/project/memo-app-7d6cf/firestore
2. **「データベースを作成」** をクリック
3. **「本番環境モードで開始」** を選択 ✅
4. **「次へ」** をクリック
5. ロケーション: **「asia-northeast1 (Tokyo)」** を選択
6. **「有効にする」** をクリック
7. 作成完了まで待つ（30秒程度）

---

### 📍 ステップ4: セキュリティルール設定（1分）

1. **このリンクを開く**: https://console.firebase.google.com/u/0/project/memo-app-7d6cf/firestore/rules
2. エディタの **すべての内容を削除** する
3. 以下のルールを **コピー&ペースト** する:

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

4. **「公開」** ボタンをクリック
5. 確認ダイアログで **「公開」** をクリック

---

### 📍 ステップ5: 承認済みドメイン追加（1分）

1. **このリンクを開く**: https://console.firebase.google.com/u/0/project/memo-app-7d6cf/authentication/settings
2. 下にスクロールして **「承認済みドメイン」** セクションを探す
3. **「ドメインを追加」** をクリック
4. **`toru830.github.io`** と入力して **「追加」**

---

### 📍 ステップ6: GitHub Secrets設定（1分）

**前提**: ステップ1で保存した `firebaseConfig` の値を使用

1. **このリンクを開く**: https://github.com/toru830/memo-app/settings/secrets/actions
2. 以下の6つのSecretを追加:

#### 追加するSecret一覧:

**`VITE_FIREBASE_API_KEY`**
- 値: `firebaseConfig.apiKey` の値（例: `AIzaSyC...`）

**`VITE_FIREBASE_AUTH_DOMAIN`**
- 値: `memo-app-7d6cf.firebaseapp.com`

**`VITE_FIREBASE_PROJECT_ID`**
- 値: `memo-app-7d6cf`

**`VITE_FIREBASE_STORAGE_BUCKET`**
- 値: `memo-app-7d6cf.appspot.com`

**`VITE_FIREBASE_MESSAGING_SENDER_ID`**
- 値: `firebaseConfig.messagingSenderId` の値（例: `123456789`）

**`VITE_FIREBASE_APP_ID`**
- 値: `firebaseConfig.appId` の値（例: `1:123456789:web:xxxxx`）

#### 各Secretの追加方法:
1. **「New repository secret」** をクリック
2. **Name**: 上記のSecret名を入力
3. **Secret**: 対応する値を入力
4. **「Add secret」** をクリック
5. 次のSecretも同様に追加（合計6つ）

---

## ✅ 完了確認

### GitHub Actionsの実行
1. https://github.com/toru830/memo-app/actions を開く
2. 最新のワークフローが **緑色のチェックマーク** になるまで待つ（2-3分）

### アプリで動作確認
1. https://toru830.github.io/memo-app/ を開く
2. ヘッダーの **「Cloud Sync」** ボタンをクリック
3. Googleアカウントでログイン
4. **ユーザーアイコン** が表示されれば成功！🎉

---

## 🎯 これで完了！

- ✅ クラウドバックアップ機能が有効
- ✅ マルチデバイス同期が可能
- ✅ データは安全にFirestoreに保存

スマホでもPCでも、同じGoogleアカウントでログインすればデータが同期されます！
