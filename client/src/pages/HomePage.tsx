import React, { useState, useMemo } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { Memo, CreateMemoData, UpdateMemoData, FilterOptions } from '../types';
import { useMemos } from '../hooks/useMemos';
// import { useCategories } from '../hooks/useCategories';
// import { useTags } from '../hooks/useTags';
import { MemoCard } from '../components/MemoCard';
import { MemoForm } from '../components/MemoForm';
// import { FilterBar } from '../components/FilterBar';
import { StatsCard } from '../components/StatsCard';
import { DataManager } from '../components/DataManager';
import { VoiceInput } from '../components/VoiceInput';
import { TabNavigation, TabType } from '../components/TabNavigation';
import { ModernHeader } from '../components/ModernHeader';

export const HomePage: React.FC = () => {
  const [filters] = useState<FilterOptions>({});
  const [editingMemo, setEditingMemo] = useState<Memo | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');

  // const { categories } = useCategories();
  // const { tags } = useTags();
  const { memos, loading, error, createMemo, updateMemo, deleteMemo, toggleComplete, refetch } = useMemos(filters);

  // タブと検索フィルターを適用
  const filteredMemos = useMemo(() => {
    let filtered = memos;

    // タブによるフィルタリング
    switch (activeTab) {
      case 'tasks':
        filtered = filtered.filter(memo => memo.is_task);
        break;
      case 'ideas':
        filtered = filtered.filter(memo => memo.category === 'アイデア');
        break;
      case 'shopping':
        filtered = filtered.filter(memo => memo.category === '買い物');
        break;
      case 'thoughts':
        filtered = filtered.filter(memo => memo.category === '思い');
        break;
      case 'all':
      default:
        // すべて表示
        break;
    }

    // 検索フィルター
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(memo => 
        memo.content.toLowerCase().includes(term) ||
        memo.category.toLowerCase().includes(term) ||
        memo.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    return filtered;
  }, [memos, searchTerm, activeTab]);

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

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'add') {
      setShowForm(true);
    } else if (tab === 'voice') {
      setShowVoiceInput(true);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      {/* ヘッダー */}
      <ModernHeader onSearch={setSearchTerm} searchTerm={searchTerm} />
      
      <div className="pb-24">
        {/* 統計カード */}
        <div className="px-4 py-6">
          <StatsCard memos={memos} />
        </div>

        {/* クイックアクション */}
        <div className="px-4 mb-6">
          <div className="bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/20 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles size={20} className="text-purple-400" />
              <h2 className="text-lg font-semibold text-white">クイック作成</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => handleCreateMemo({ content: '', category: '買い物', tags: [], is_task: false, is_completed: false })}
                className="bg-gradient-to-br from-orange-600/20 to-orange-700/20 hover:from-orange-600/30 hover:to-orange-700/30 rounded-2xl p-4 text-center transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md border border-orange-500/20"
              >
                <div className="text-2xl mb-2">🛒</div>
                <div className="text-sm font-medium text-orange-400">買い物</div>
              </button>
              <button
                onClick={() => handleCreateMemo({ content: '', category: '仕事', tags: [], is_task: true, is_completed: false })}
                className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 hover:from-blue-600/30 hover:to-blue-700/30 rounded-2xl p-4 text-center transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md border border-blue-500/20"
              >
                <div className="text-2xl mb-2">💼</div>
                <div className="text-sm font-medium text-blue-400">仕事</div>
              </button>
              <button
                onClick={() => handleCreateMemo({ content: '', category: 'プライベート', tags: [], is_task: false, is_completed: false })}
                className="bg-gradient-to-br from-green-600/20 to-green-700/20 hover:from-green-600/30 hover:to-green-700/30 rounded-2xl p-4 text-center transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md border border-green-500/20"
              >
                <div className="text-2xl mb-2">🏠</div>
                <div className="text-sm font-medium text-green-400">プライベート</div>
              </button>
              <button
                onClick={() => handleCreateMemo({ content: '', category: '思い', tags: [], is_task: false, is_completed: false })}
                className="bg-gradient-to-br from-pink-600/20 to-pink-700/20 hover:from-pink-600/30 hover:to-pink-700/30 rounded-2xl p-4 text-center transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md border border-pink-500/20"
              >
                <div className="text-2xl mb-2">💭</div>
                <div className="text-sm font-medium text-pink-400">思い</div>
              </button>
            </div>
          </div>
        </div>

        {/* データ管理 */}
        <div className="px-4 mb-6">
          <DataManager onDataChange={refetch} />
        </div>

        {/* メモ一覧 */}
        <div className="px-4">
          {filteredMemos.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-sm">
                <div className="text-gray-400 mb-4">
                  <Plus size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || activeTab !== 'all'
                    ? '該当するメモがありません' 
                    : 'まだメモがありません'
                  }
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || activeTab !== 'all'
                    ? '検索条件を変更してみてください'
                    : '最初のメモを作成しましょう'
                  }
                </p>
                {(!searchTerm && activeTab === 'all') && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    メモを作成
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
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
        </div>

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
      </div>

      {/* タブナビゲーション */}
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};
