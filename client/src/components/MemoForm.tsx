import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { Memo, CreateMemoData, UpdateMemoData } from '../types';
// import { useCategories } from '../hooks/useCategories';

interface MemoFormProps {
  memo?: Memo;
  onSave: (data: CreateMemoData | UpdateMemoData) => Promise<void>;
  onCancel: () => void;
  initialCategory?: string | null;
}

export const MemoForm: React.FC<MemoFormProps> = ({ memo, onSave, onCancel, initialCategory }) => {
  // const { categories } = useCategories();
  const [formData, setFormData] = useState({
    content: '',
    category: initialCategory || 'general',
    is_task: false,
    priority: 1,
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (memo) {
      setFormData({
        content: memo.content,
        category: memo.category,
        is_task: memo.is_task,
        priority: memo.priority,
        tags: memo.tags,
      });
    } else if (initialCategory) {
      setFormData(prev => ({
        ...prev,
        category: initialCategory,
        is_task: initialCategory === '仕事',
      }));
    }
  }, [memo, initialCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) return;

    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Failed to save memo:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {memo ? 'メモを編集' : '新しいメモ'}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                内容
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="メモの詳細を入力"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  カテゴリ
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="買い物">🛒 買い物</option>
                  <option value="仕事">💼 仕事</option>
                  <option value="プライベート">🏠 プライベート</option>
                  <option value="思い">💭 思い</option>
                  <option value="アイデア">💡 アイデア</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  優先度
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value={1}>低</option>
                  <option value={2}>中</option>
                  <option value={3}>高</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_task}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_task: e.target.checked }))}
                  className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-300">タスクとして管理する</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                タグ
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagInputKeyPress}
                  className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="タグを入力してEnterキーを押す"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-xl transition-all duration-200"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-400"
                    >
                      <Minus size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading || !formData.content.trim()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? '保存中...' : memo ? '更新' : '作成'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-xl transition-all duration-200"
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
