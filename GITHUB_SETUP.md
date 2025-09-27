# GitHub上でのメモアプリ実装手順

## 🚀 GitHubリポジトリの作成とデプロイ

### 1. GitHubリポジトリの作成

1. [GitHub](https://github.com) にログイン
2. 右上の「+」ボタンから「New repository」を選択
3. リポジトリ名を `memo-app` に設定
4. 「Public」を選択（GitHub Pagesを使用するため）
5. 「Create repository」をクリック

### 2. リモートリポジトリの追加とプッシュ

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

### 4. カスタムドメインの設定（オプション）

1. リポジトリの「Settings」→「Pages」
2. 「Custom domain」にドメインを入力
3. DNS設定でCNAMEレコードを追加

## 📱 アクセス方法

デプロイ完了後、以下のURLでアクセス可能：

```
https://your-username.github.io/memo-app
```

## 🔧 設定のカスタマイズ

### 1. リポジトリ名を変更する場合

`client/vite.config.ts` の `base` パスを更新：
```typescript
base: '/your-new-repo-name/',
```

### 2. カスタムドメインを使用する場合

`client/vite.config.ts` の `base` を削除または変更：
```typescript
base: '/',
```

## 📊 機能確認

デプロイ後、以下の機能が動作することを確認：

- ✅ メモの作成・編集・削除
- ✅ タスク管理
- ✅ 検索・フィルター
- ✅ データエクスポート・インポート
- ✅ レスポンシブデザイン
- ✅ ローカルストレージでのデータ保存

## 🚨 注意事項

1. **データ保存**: GitHub Pages版ではLocalStorageを使用
2. **オフライン対応**: インターネット接続なしでも使用可能
3. **ブラウザサポート**: モダンブラウザが必要
4. **データバックアップ**: 定期的にエクスポート機能を使用

## 🔄 更新のデプロイ

コードを更新した場合：

```bash
git add .
git commit -m "Update memo app"
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

## 🎉 完成！

これで、GitHub上でメモアプリが完全に動作するようになりました！

- **ローカル開発**: `npm run dev`
- **GitHub Pages**: `https://your-username.github.io/memo-app`
- **データ管理**: エクスポート・インポート機能付き
- **クロスプラットフォーム**: スマホ・PC対応
