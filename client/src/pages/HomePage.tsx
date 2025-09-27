import React, { useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import { Memo, CreateMemoData, UpdateMemoData, FilterOptions } from '../types';
import { useMemos } from '../hooks/useMemos';
import { useCategories } from '../hooks/useCategories';
import { useTags } from '../hooks/useTags';
import { MemoCard } from '../components/MemoCard';
import { MemoForm } from '../components/MemoForm';
import { FilterBar } from '../components/FilterBar';
import { StatsCard } from '../components/StatsCard';

export const HomePage: React.FC = () => {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [editingMemo, setEditingMemo] = useState<Memo | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { categories } = useCategories();
  const { tags } = useTags();
  const { memos, loading, error, createMemo, updateMemo, deleteMemo, toggleComplete } = useMemos(filters);

  // 検索フィルターを適用
  const filteredMemos = useMemo(() => {
    if (!searchTerm) return memos;
    
    const term = searchTerm.toLowerCase();
    return memos.filter(memo => 
      memo.title.toLowerCase().includes(term) ||
      memo.content.toLowerCase().includes(term) ||
      memo.tags.some(tag => tag.toLowerCase().includes(term))
    );
  }, [memos, searchTerm]);

  const handleCreateMemo = async (data: CreateMemoData) => {
    try {
      await createMemo(data);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create memo:', error);
    }
  };

  const handleUpdateMemo = async (data: UpdateMemoData) => {
    if (!editingMemo) return;
    
    try {
      await updateMemo(editingMemo.id, data);
      setEditingMemo(null);
    } catch (error) {
      console.error('Failed to update memo:', error);
    }
  };

  const handleDeleteMemo = async (id: number) => {
    if (window.confirm('このメモを削除しますか？')) {
      try {
        await deleteMemo(id);
      } catch (error) {
        console.error('Failed to delete memo:', error);
      }
    }
  };

  const handleToggleComplete = async (id: number, is_completed: boolean) => {
    try {
      await toggleComplete(id, is_completed);
    } catch (error) {
      console.error('Failed to toggle complete:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <p className="text-lg font-medium">エラーが発生しました</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">メモアプリ</h1>
            <p className="text-gray-600">日々の考え、メモ、タスクを管理しましょう</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary flex items-center gap-2 mt-4 md:mt-0"
          >
            <Plus size={20} />
            新しいメモ
          </button>
        </div>

        {/* 統計カード */}
        <StatsCard memos={memos} />

        {/* 検索バー */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
              placeholder="メモを検索..."
            />
          </div>
        </div>

        {/* フィルターバー */}
        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          categories={categories}
          tags={tags}
        />

        {/* メモ一覧 */}
        {filteredMemos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || Object.keys(filters).length > 0 
                ? '該当するメモがありません' 
                : 'まだメモがありません'
              }
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || Object.keys(filters).length > 0
                ? '検索条件を変更してみてください'
                : '最初のメモを作成しましょう'
              }
            </p>
            {(!searchTerm && Object.keys(filters).length === 0) && (
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary"
              >
                メモを作成
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMemos.map((memo) => (
              <MemoCard
                key={memo.id}
                memo={memo}
                onEdit={setEditingMemo}
                onDelete={handleDeleteMemo}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>
        )}

        {/* フォームモーダル */}
        {showForm && (
          <MemoForm
            onSave={handleCreateMemo}
            onCancel={() => setShowForm(false)}
          />
        )}

        {editingMemo && (
          <MemoForm
            memo={editingMemo}
            onSave={handleUpdateMemo}
            onCancel={() => setEditingMemo(null)}
          />
        )}
      </div>
    </div>
  );
};
