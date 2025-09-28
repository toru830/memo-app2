import React, { useState, useMemo } from 'react';
import { Plus, Search, Mic } from 'lucide-react';
import { Memo, CreateMemoData, UpdateMemoData, FilterOptions } from '../types';
import { useMemos } from '../hooks/useMemos';
import { useCategories } from '../hooks/useCategories';
import { useTags } from '../hooks/useTags';
import { MemoCard } from '../components/MemoCard';
import { MemoForm } from '../components/MemoForm';
import { FilterBar } from '../components/FilterBar';
import { StatsCard } from '../components/StatsCard';
import { DataManager } from '../components/DataManager';
import { VoiceInput } from '../components/VoiceInput';

export const HomePage: React.FC = () => {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [editingMemo, setEditingMemo] = useState<Memo | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { categories } = useCategories();
  const { tags } = useTags();
  const { memos, loading, error, createMemo, updateMemo, deleteMemo, toggleComplete, refetch } = useMemos(filters);

  // 検索フィルターを適用
  const filteredMemos = useMemo(() => {
    if (!searchTerm) return memos;
    
    const term = searchTerm.toLowerCase();
    return memos.filter(memo => 
      memo.content.toLowerCase().includes(term) ||
      memo.category.toLowerCase().includes(term) ||
      memo.tags.some(tag => tag.toLowerCase().includes(term))
    );
  }, [memos, searchTerm]);

  const handleCreateMemo = async (data: CreateMemoData | UpdateMemoData) => {
    try {
      if ('id' in data) {
        // Update memo
        await updateMemo(data.id as number, data);
      } else {
        // Create memo
        await createMemo(data as CreateMemoData);
      }
      setShowForm(false);
    } catch (error) {
      console.error('Failed to save memo:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                ✨ メモアプリ
              </h1>
              <p className="text-gray-600 text-lg">日々の考え、メモ、タスクを管理しましょう</p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <button
                onClick={() => setShowVoiceInput(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Mic size={20} />
                🎤 音声入力
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Plus size={20} />
                ✏️ 新しいメモ
              </button>
            </div>
          </div>

          {/* クイックアクション */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <button
              onClick={() => handleCreateMemo({ content: '', category: '買い物', tags: [], is_task: false, is_completed: false })}
              className="bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl p-4 text-center transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
            >
              <div className="text-2xl mb-2">🛒</div>
              <div className="text-sm font-medium text-orange-800">買い物</div>
            </button>
            <button
              onClick={() => handleCreateMemo({ content: '', category: '仕事', tags: [], is_task: true, is_completed: false })}
              className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl p-4 text-center transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
            >
              <div className="text-2xl mb-2">💼</div>
              <div className="text-sm font-medium text-blue-800">仕事</div>
            </button>
            <button
              onClick={() => handleCreateMemo({ content: '', category: 'プライベート', tags: [], is_task: false, is_completed: false })}
              className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl p-4 text-center transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
            >
              <div className="text-2xl mb-2">🏠</div>
              <div className="text-sm font-medium text-green-800">プライベート</div>
            </button>
            <button
              onClick={() => handleCreateMemo({ content: '', category: '思い', tags: [], is_task: false, is_completed: false })}
              className="bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-xl p-4 text-center transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
            >
              <div className="text-2xl mb-2">💭</div>
              <div className="text-sm font-medium text-pink-800">思い</div>
            </button>
            <button
              onClick={() => setShowVoiceInput(true)}
              className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl p-4 text-center transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
            >
              <div className="text-2xl mb-2">🎤</div>
              <div className="text-sm font-medium text-purple-800">音声入力</div>
            </button>
          </div>
        </div>

        {/* 統計カード */}
        <StatsCard memos={memos} />

        {/* データ管理 */}
        <DataManager onDataChange={refetch} />

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

        {/* Voice Input Modal */}
        {showVoiceInput && (
          <VoiceInput
            onMemoCreate={handleCreateMemo}
            onClose={() => setShowVoiceInput(false)}
          />
        )}

        {/* フローティングアクションボタン（モバイル用） */}
        <div className="fixed bottom-6 right-6 md:hidden">
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setShowVoiceInput(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-110"
            >
              <Mic size={24} />
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-110"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
