# Firebase設定情報取得ガイド

## プロジェクト情報
- **プロジェクトID**: `memo-app-7d6cf`
- **プロジェクトURL**: https://console.firebase.google.com/u/0/project/memo-app-7d6cf/overview

## 必要な設定情報

### 1. Webアプリの設定情報を取得
1. Firebase Console で **プロジェクトの設定** (歯車アイコン) をクリック
2. **「全般」** タブを開く
3. **「マイアプリ」** セクションで **「</>」** (Web) アイコンをクリック
4. **アプリのニックネーム**: `memo-web-app`
5. **「アプリを登録」** をクリック
6. 表示される設定情報をコピー

### 2. Authentication設定
1. 左メニュー **「Authentication」** → **「始める」**
2. **「Sign-in method」** タブ
3. **「Google」** をクリックして有効化
4. **プロジェクトの公開名**: `Memo App`
5. **サポートメール**: あなたのメールアドレス
6. **「保存」**

### 3. Firestore Database設定
1. 左メニュー **「Firestore Database」** → **「データベースを作成」**
2. **「本番環境モードで開始」** を選択
3. **ロケーション**: `asia-northeast1 (東京)`
4. **「有効にする」**

### 4. セキュリティルール設定
1. **「ルール」** タブを開く
2. 以下のルールに置き換え:

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

3. **「公開」** をクリック

### 5. 承認済みドメイン設定
1. **「Authentication」** → **「Settings」** → **「承認済みドメイン」**
2. 以下を追加:
   - `localhost`
   - `toru830.github.io`

## 設定完了後の確認事項
- [ ] Webアプリが登録されている
- [ ] Google認証が有効になっている
- [ ] Firestore Databaseが作成されている
- [ ] セキュリティルールが設定されている
- [ ] 承認済みドメインが追加されている
