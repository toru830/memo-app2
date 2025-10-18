# Google認証設定ガイド

## 1. Google Cloud Consoleでプロジェクトを作成

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成（例: `memo-app-auth`）
3. プロジェクトを選択

## 2. OAuth 2.0クライアントIDを作成

1. **APIとサービス** → **認証情報** に移動
2. **認証情報を作成** → **OAuth 2.0クライアントID** を選択
3. **アプリケーションの種類**: **ウェブアプリケーション** を選択
4. **名前**: `Memo App Web Client` を入力
5. **承認済みのJavaScriptオリジン** に以下を追加:
   - `https://toru830.github.io`
   - `http://localhost:5173` (開発用)
6. **承認済みのリダイレクトURI** に以下を追加:
   - `https://toru830.github.io/memo-app/`
   - `http://localhost:5173/` (開発用)

## 3. クライアントIDを取得

1. 作成されたOAuth 2.0クライアントIDをコピー
2. `client/src/services/google-auth.ts` の `CLIENT_ID` を更新:

```typescript
private readonly CLIENT_ID = 'YOUR_ACTUAL_CLIENT_ID_HERE';
```

## 4. デプロイ

1. 変更をコミット・プッシュ
2. GitHub Pagesでデプロイ完了を確認
3. https://toru830.github.io/memo-app/ で「Googleでログイン」ボタンをテスト

## 注意事項

- Google認証は開発環境では動作しません（localhost:5173では制限あり）
- 本番環境（GitHub Pages）でのみ完全に動作します
- 初回認証時はGoogleアカウントの許可が必要です
