# GitHubリポジトリ作成手順

## 🚀 GitHubリポジトリの作成

### 1. GitHubでリポジトリを作成

1. [GitHub](https://github.com) にログイン
2. 右上の「+」ボタンから「New repository」を選択
3. 以下の設定でリポジトリを作成：
   - **Repository name**: `memo-app`
   - **Description**: `日々の考え、メモ、タスク、思いつきを管理できるクロスプラットフォームのメモアプリ`
   - **Visibility**: `Public` (GitHub Pagesを使用するため)
   - **Initialize**: チェックを外す（既存のコードをプッシュするため）
4. 「Create repository」をクリック

### 2. ローカルからリモートリポジトリにプッシュ

```bash
# リモートリポジトリを追加（your-usernameを実際のユーザー名に置き換え）
git remote add origin https://github.com/your-username/memo-app.git

# メインブランチにプッシュ
git branch -M main
git push -u origin main
```

### 3. GitHub Pagesの設定

1. GitHubリポジトリの「Settings」タブに移動
2. 左サイドバーの「Pages」をクリック
3. 「Source」で「GitHub Actions」を選択
4. 設定が完了すると、GitHub Actionsワークフローが自動実行されます

### 4. アクセスURL

デプロイ完了後（通常5-10分）、以下のURLでアクセス可能：

```
https://your-username.github.io/memo-app
```

## 🔧 自動デプロイ設定

GitHub Actionsが自動的に以下を実行します：

1. **ビルド**: React アプリケーションのビルド
2. **デプロイ**: GitHub Pagesへの自動デプロイ
3. **更新**: コードをプッシュするたびに自動更新

## 📱 機能確認

デプロイ後、以下の機能が動作することを確認：

- ✅ メモの作成・編集・削除
- ✅ タスク管理
- ✅ 音声認識・音声入力
- ✅ 音声録音・再生
- ✅ 検索・フィルター
- ✅ データエクスポート・インポート
- ✅ レスポンシブデザイン

## 🚨 注意事項

1. **データ保存**: GitHub Pages版ではLocalStorageを使用
2. **音声機能**: HTTPS環境でのみ動作（GitHub Pagesは自動的にHTTPS）
3. **ブラウザサポート**: モダンブラウザが必要
4. **データバックアップ**: 定期的にエクスポート機能を使用

## 🔄 更新方法

コードを更新した場合：

```bash
git add .
git commit -m "Update description"
git push origin main
```

GitHub Actionsが自動的にビルド・デプロイを実行します。

## 📞 トラブルシューティング

### デプロイが失敗する場合

1. GitHub Actionsのログを確認
2. ビルドエラーがないかチェック
3. 依存関係の問題がないか確認

### サイトが表示されない場合

1. GitHub Pagesの設定を確認
2. ブランチとソースが正しく設定されているか確認
3. 数分待ってから再度アクセス

---

**次のステップ**: 上記の手順に従ってリポジトリを作成し、URLを教えてください！
