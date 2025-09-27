# API ドキュメント

## ベースURL

- 開発環境: `http://localhost:3001/api`
- 本番環境: `https://your-domain.com/api`

## 認証

現在のAPIは認証なしでアクセス可能です。本番環境では適切な認証を実装することを推奨します。

## エンドポイント

### メモ関連

#### メモ一覧取得

```http
GET /api/memos
```

**クエリパラメータ:**
- `category` (string, optional): カテゴリでフィルタ
- `is_task` (boolean, optional): タスクかどうかでフィルタ
- `is_completed` (boolean, optional): 完了状態でフィルタ

**レスポンス:**
```json
[
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
```

#### メモ詳細取得

```http
GET /api/memos/{id}
```

**レスポンス:**
```json
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
```

#### メモ作成

```http
POST /api/memos
```

**リクエストボディ:**
```json
{
  "title": "新しいメモ",
  "content": "メモの詳細",
  "category": "work",
  "is_task": true,
  "priority": 2,
  "tags": ["重要", "プロジェクト"]
}
```

**レスポンス:**
```json
{
  "id": 2,
  "message": "Memo created successfully"
}
```

#### メモ更新

```http
PUT /api/memos/{id}
```

**リクエストボディ:**
```json
{
  "title": "更新されたメモ",
  "content": "更新された内容",
  "is_completed": true
}
```

**レスポンス:**
```json
{
  "message": "Memo updated successfully"
}
```

#### メモ削除

```http
DELETE /api/memos/{id}
```

**レスポンス:**
```json
{
  "message": "Memo deleted successfully"
}
```

#### カテゴリ一覧取得

```http
GET /api/memos/categories/list
```

**レスポンス:**
```json
["general", "work", "personal", "shopping"]
```

#### タグ一覧取得

```http
GET /api/memos/tags/list
```

**レスポンス:**
```json
["重要", "プロジェクト", "買い物", "勉強"]
```

### データ同期

#### データエクスポート

```http
GET /api/sync/export
```

**レスポンス:**
```json
{
  "exported_at": "2024-01-01T09:00:00.000Z",
  "total_memos": 10,
  "memos": [...]
}
```

#### データインポート

```http
POST /api/sync/import
```

**リクエストボディ:**
```json
{
  "memos": [
    {
      "title": "インポートするメモ",
      "content": "内容",
      "category": "general",
      "is_task": false,
      "is_completed": false,
      "priority": 1,
      "tags": [],
      "created_at": "2024-01-01T08:00:00.000Z",
      "updated_at": "2024-01-01T08:00:00.000Z"
    }
  ]
}
```

**レスポンス:**
```json
{
  "message": "Data imported successfully",
  "imported": 1,
  "errors": []
}
```

#### バックアップ作成

```http
POST /api/sync/backup
```

**レスポンス:**
```json
{
  "created_at": "2024-01-01T09:00:00.000Z",
  "version": "1.0",
  "total_memos": 10,
  "memos": [...]
}
```

### ヘルスチェック

#### アプリケーション状態確認

```http
GET /api/health
```

**レスポンス:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T09:00:00.000Z"
}
```

## エラーレスポンス

### 400 Bad Request
```json
{
  "error": "Title is required"
}
```

### 404 Not Found
```json
{
  "error": "Memo not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to fetch memos"
}
```

## データモデル

### Memo

| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | number | メモの一意識別子 |
| title | string | メモのタイトル（必須） |
| content | string | メモの内容 |
| category | string | カテゴリ（デフォルト: "general"） |
| is_task | boolean | タスクかどうか |
| is_completed | boolean | 完了状態 |
| priority | number | 優先度（1: 低, 2: 中, 3: 高） |
| tags | string[] | タグの配列 |
| created_at | string | 作成日時（ISO 8601） |
| updated_at | string | 更新日時（ISO 8601） |

## 使用例

### JavaScript/Fetch API

```javascript
// メモ一覧取得
const memos = await fetch('/api/memos').then(res => res.json());

// 新しいメモ作成
const newMemo = await fetch('/api/memos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: '新しいメモ',
    content: '内容',
    is_task: true,
    priority: 2
  })
}).then(res => res.json());

// メモ更新
await fetch('/api/memos/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    is_completed: true
  })
});

// メモ削除
await fetch('/api/memos/1', { method: 'DELETE' });
```

### cURL

```bash
# メモ一覧取得
curl http://localhost:3001/api/memos

# 新しいメモ作成
curl -X POST http://localhost:3001/api/memos \
  -H "Content-Type: application/json" \
  -d '{"title":"新しいメモ","content":"内容","is_task":true}'

# メモ更新
curl -X PUT http://localhost:3001/api/memos/1 \
  -H "Content-Type: application/json" \
  -d '{"is_completed":true}'

# メモ削除
curl -X DELETE http://localhost:3001/api/memos/1
```
