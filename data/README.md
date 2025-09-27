# Data Directory

このディレクトリには、メモアプリのデータエクスポートが保存されます。

## ファイル説明

- `memos.json` - メモデータのJSONエクスポートファイル
  - GitHub Actionsによって自動的に更新されます
  - 手動でのデータ同期やバックアップに使用できます

## データ形式

```json
{
  "exported_at": "2024-01-01T09:00:00.000Z",
  "total_memos": 10,
  "memos": [
    {
      "id": 1,
      "title": "メモのタイトル",
      "content": "メモの内容",
      "category": "general",
      "is_task": false,
      "is_completed": false,
      "priority": 1,
      "tags": ["タグ1", "タグ2"],
      "created_at": "2024-01-01T08:00:00.000Z",
      "updated_at": "2024-01-01T08:00:00.000Z"
    }
  ]
}
```

## 使用方法

1. **データのエクスポート**: アプリから `/api/sync/export` エンドポイントにアクセス
2. **データのインポート**: アプリから `/api/sync/import` エンドポイントにPOST
3. **バックアップ**: アプリから `/api/sync/backup` エンドポイントにアクセス

## 注意事項

- このディレクトリのファイルはGitHubにコミットされます
- 機密情報は含めないでください
- 定期的なバックアップを推奨します
