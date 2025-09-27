import React from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { 
  Calendar, 
  Tag, 
  CheckCircle, 
  Circle, 
  Edit, 
  Trash2, 
  Star,
  FileText
} from 'lucide-react';
import { Memo } from '../types';
import { clsx } from 'clsx';

interface MemoCardProps {
  memo: Memo;
  onEdit: (memo: Memo) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number, is_completed: boolean) => void;
}

export const MemoCard: React.FC<MemoCardProps> = ({
  memo,
  onEdit,
  onDelete,
  onToggleComplete,
}) => {
  const handleToggleComplete = () => {
    onToggleComplete(memo.id, !memo.is_completed);
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 3: return 'text-red-500';
      case 2: return 'text-yellow-500';
      case 1: return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getPriorityText = (priority: number) => {
    switch (priority) {
      case 3: return '高';
      case 2: return '中';
      case 1: return '低';
      default: return 'なし';
    }
  };

  return (
    <div className={clsx(
      'card transition-all duration-200 hover:shadow-md',
      memo.is_completed && 'opacity-75'
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1">
          <button
            onClick={handleToggleComplete}
            className={clsx(
              'flex-shrink-0 p-1 rounded-full transition-colors',
              memo.is_completed 
                ? 'text-green-600 hover:text-green-700' 
                : 'text-gray-400 hover:text-gray-600'
            )}
          >
            {memo.is_completed ? (
              <CheckCircle size={20} className="fill-current" />
            ) : (
              <Circle size={20} />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <h3 className={clsx(
              'font-semibold text-lg truncate',
              memo.is_completed && 'line-through text-gray-500'
            )}>
              {memo.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1 ml-2">
          {memo.is_task && (
            <span className="badge badge-primary text-xs">
              タスク
            </span>
          )}
          
          <div className="flex items-center gap-1">
            <Star 
              size={14} 
              className={getPriorityColor(memo.priority)} 
            />
            <span className="text-xs text-gray-500">
              {getPriorityText(memo.priority)}
            </span>
          </div>
        </div>
      </div>

      {memo.content && (
        <div className="mb-3">
          <p className="text-gray-700 text-sm line-clamp-3">
            {memo.content}
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 mb-3">
        {memo.category && memo.category !== 'general' && (
          <span className="badge badge-secondary text-xs">
            {memo.category}
          </span>
        )}
        
        {memo.tags.map((tag, index) => (
          <span key={index} className="badge badge-primary text-xs">
            <Tag size={10} className="mr-1" />
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          <span>
            作成: {format(new Date(memo.created_at), 'yyyy/MM/dd HH:mm', { locale: ja })}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(memo)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="編集"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={() => onDelete(memo.id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="削除"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
