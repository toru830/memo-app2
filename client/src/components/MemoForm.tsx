import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { Memo, CreateMemoData, UpdateMemoData } from '../types';
import { useCategories } from '../hooks/useCategories';

interface MemoFormProps {
  memo?: Memo;
  onSave: (data: CreateMemoData | UpdateMemoData) => Promise<void>;
  onCancel: () => void;
}

export const MemoForm: React.FC<MemoFormProps> = ({ memo, onSave, onCancel }) => {
  const { categories } = useCategories();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    is_task: false,
    priority: 1,
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (memo) {
      setFormData({
        title: memo.title,
        content: memo.content,
        category: memo.category,
        is_task: memo.is_task,
        priority: memo.priority,
        tags: memo.tags,
      });
    }
  }, [memo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              {memo ? 'メモを編集' : '新しいメモ'}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                タイトル *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="input"
                placeholder="メモのタイトルを入力"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                内容
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="textarea h-32"
                placeholder="メモの詳細を入力"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  カテゴリ
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="input"
                >
                  <option value="general">一般</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  優先度
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                  className="input"
                >
                  <option value={1}>低</option>
                  <option value={2}>中</option>
                  <option value={3}>高</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                タスクとして扱う
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_task}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_task: e.target.checked }))}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">タスクとして管理する</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                タグ
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagInputKeyPress}
                  className="input flex-1"
                  placeholder="タグを入力してEnterキーを押す"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="btn btn-secondary px-3"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="badge badge-primary flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-600"
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
                disabled={loading || !formData.title.trim()}
                className="btn btn-primary flex-1"
              >
                {loading ? '保存中...' : memo ? '更新' : '作成'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-secondary px-6"
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
