import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { FilterOptions } from '../types';

interface FilterBarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  categories: string[];
  tags: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFiltersChange,
  categories,
  // tags,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const updateFilter = (key: keyof FilterOptions, value: string | boolean | undefined) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== ''
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-600" />
          <h3 className="font-medium text-gray-900">フィルター</h3>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <X size={14} />
              クリア
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            {isExpanded ? '折りたたむ' : '展開'}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {/* 検索 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            検索
          </label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => updateFilter('search', e.target.value || undefined)}
              className="input pl-10"
              placeholder="タイトルや内容で検索"
            />
          </div>
        </div>

        {isExpanded && (
          <>
            {/* カテゴリ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                カテゴリ
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) => updateFilter('category', e.target.value || undefined)}
                className="input"
              >
                <option value="">すべてのカテゴリ</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* タスクフィルター */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                種類
              </label>
              <select
                value={filters.is_task === undefined ? '' : filters.is_task.toString()}
                onChange={(e) => {
                  const value = e.target.value;
                  updateFilter('is_task', value === '' ? undefined : value === 'true');
                }}
                className="input"
              >
                <option value="">すべて</option>
                <option value="true">タスクのみ</option>
                <option value="false">メモのみ</option>
              </select>
            </div>

            {/* 完了状態 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                完了状態
              </label>
              <select
                value={filters.is_completed === undefined ? '' : filters.is_completed.toString()}
                onChange={(e) => {
                  const value = e.target.value;
                  updateFilter('is_completed', value === '' ? undefined : value === 'true');
                }}
                className="input"
              >
                <option value="">すべて</option>
                <option value="false">未完了</option>
                <option value="true">完了済み</option>
              </select>
            </div>
          </>
        )}
      </div>

      {/* アクティブフィルター表示 */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="badge badge-secondary">
                検索: {filters.search}
              </span>
            )}
            {filters.category && (
              <span className="badge badge-secondary">
                カテゴリ: {filters.category}
              </span>
            )}
            {filters.is_task !== undefined && (
              <span className="badge badge-secondary">
                {filters.is_task ? 'タスク' : 'メモ'}
              </span>
            )}
            {filters.is_completed !== undefined && (
              <span className="badge badge-secondary">
                {filters.is_completed ? '完了済み' : '未完了'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
