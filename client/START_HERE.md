# 🚀 Firebase設定 - ここから始めてください

## プロジェクト情報
- **Firebase Project ID**: `memo-app-7d6cf`
- **GitHub Repository**: https://github.com/toru830/memo-app
- **Live App**: https://toru830.github.io/memo-app/

---

## ⚡ 5分で完了！設定手順

### 📍 ステップ1: Webアプリ登録
🔗 https://console.firebase.google.com/u/0/project/memo-app-7d6cf/settings/general

1. 「マイアプリ」セクションで **`</>`** アイコンをクリック
2. アプリのニックネーム: **`memo-web-app`**
3. 「アプリを登録」をクリック
4. **`firebaseConfig`** をコピーして保存 📋

---

### 📍 ステップ2: Google認証
🔗 https://console.firebase.google.com/u/0/project/memo-app-7d6cf/authentication/providers

1. 「始める」→「Sign-in method」タブ
2. 「Google」を有効化
3. プロジェクト名: **`Memo App`**
4. サポートメール: あなたのGmail
5. 「保存」

---

### 📍 ステップ3: Firestore Database
🔗 https://console.firebase.google.com/u/0/project/memo-app-7d6cf/firestore

1. 「データベースを作成」
2. **「本番環境モード」** を選択
3. ロケーション: **`asia-northeast1 (Tokyo)`**
4. 「有効にする」

---

### 📍 ステップ4: セキュリティルール
🔗 https://console.firebase.google.com/u/0/project/memo-app-7d6cf/firestore/rules

以下をコピー&ペースト:

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

「公開」をクリック

---

### 📍 ステップ5: 承認済みドメイン
🔗 https://console.firebase.google.com/u/0/project/memo-app-7d6cf/authentication/settings

「承認済みドメイン」セクションで **`toru830.github.io`** を追加

---

### 📍 ステップ6: GitHub Secrets
🔗 https://github.com/toru830/memo-app/settings/secrets/actions

ステップ1で保存した `firebaseConfig` の値を使って、以下の6つのSecretを追加:

| Secret名 | 値 |
|---------|-----|
| `VITE_FIREBASE_API_KEY` | `firebaseConfig.apiKey` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `memo-app-7d6cf.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `memo-app-7d6cf` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `memo-app-7d6cf.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `firebaseConfig.messagingSenderId` |
| `VITE_FIREBASE_APP_ID` | `firebaseConfig.appId` |

---

## ✅ 完了確認

1. **GitHub Actions**: https://github.com/toru830/memo-app/actions
   - 最新のワークフローが緑色のチェックマークになるまで待つ（2-3分）

2. **アプリテスト**: https://toru830.github.io/memo-app/
   - 「Cloud Sync」ボタンをクリック
   - Googleアカウントでログイン
   - ユーザーアイコンが表示されれば成功！🎉

---

## 📚 詳細ドキュメント

- **クイックガイド**: [quick-firebase-setup.md](quick-firebase-setup.md)
- **詳細手順**: [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
- **チェックリスト**: [FIREBASE_CHECKLIST.md](FIREBASE_CHECKLIST.md)

---

## 🆘 トラブルシューティング

### 「Firebase設定が必要です」と表示される
→ GitHub Secretsが正しく設定されているか確認

### ログインできない
→ 承認済みドメインに `toru830.github.io` が追加されているか確認

### データが同期されない
→ Firestoreセキュリティルールが正しく設定されているか確認

---

## 🎯 次のステップ

設定完了後:
1. スマホで https://toru830.github.io/memo-app/ を開く
2. Googleアカウントでログイン
3. メモを作成してクラウドに保存
4. 別のデバイスでログインして同期を確認

**これで完了です！楽しいメモライフを！** 📝✨
