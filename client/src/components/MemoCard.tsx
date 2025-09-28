import React, { useState } from 'react';
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
  // FileText,
  Mic,
  Volume2
} from 'lucide-react';
import { Memo } from '../types';
import { clsx } from 'clsx';
import { VoicePlayer } from './VoicePlayer';
import { AudioRecorder } from './AudioRecorder';
import { audioService, AudioRecording } from '../services/audioService';

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
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const [audioRecordings, setAudioRecordings] = useState<AudioRecording[]>([]);

  const handleToggleComplete = () => {
    onToggleComplete(memo.id, !memo.is_completed);
  };

  // Load audio recordings for this memo
  React.useEffect(() => {
    const recordings = audioService.getAudioRecordingsByMemoId(memo.id);
    setAudioRecordings(recordings);
  }, [memo.id]);

  const handleRecordingSaved = (recording: AudioRecording) => {
    setAudioRecordings(prev => [...prev, recording]);
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

  // カテゴリ別の色設定
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'メモ': 'bg-blue-50 border-blue-200 text-blue-800',
      'タスク': 'bg-green-50 border-green-200 text-green-800',
      'アイデア': 'bg-yellow-50 border-yellow-200 text-yellow-800',
      '重要': 'bg-red-50 border-red-200 text-red-800',
      'プロジェクト': 'bg-purple-50 border-purple-200 text-purple-800',
      'その他': 'bg-gray-50 border-gray-200 text-gray-800'
    };
    return colors[category] || colors['その他'];
  };

  return (
    <div className={clsx(
      'bg-white rounded-xl shadow-sm border-2 p-6 transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer',
      memo.is_completed && 'opacity-60 bg-gray-50',
      !memo.is_completed && 'hover:border-blue-300'
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
          <span className={clsx(
            'px-2 py-1 rounded-full text-xs font-medium border',
            getCategoryColor(memo.category)
          )}>
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
          {/* Audio recordings indicator */}
          {audioRecordings.length > 0 && (
            <div className="flex items-center gap-1 mr-2">
              <Volume2 size={12} className="text-blue-500" />
              <span className="text-xs text-blue-500">{audioRecordings.length}</span>
            </div>
          )}
          
          <button
            onClick={() => onEdit(memo)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="編集"
          >
            <Edit size={14} />
          </button>
          
          <button
            onClick={() => setShowAudioRecorder(true)}
            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
            title="音声録音"
          >
            <Mic size={14} />
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

      {/* Audio recordings list */}
      {audioRecordings.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Volume2 size={14} className="text-blue-500" />
            <span className="text-sm font-medium text-gray-700">音声録音</span>
          </div>
          <div className="space-y-2">
            {audioRecordings.map((recording) => (
              <div key={recording.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <VoicePlayer text={memo.title} size="sm" />
                  <span className="text-xs text-gray-600">
                    {format(new Date(recording.createdAt), 'HH:mm')} 
                    ({Math.round(recording.duration)}s)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audio Recorder Modal */}
      {showAudioRecorder && (
        <AudioRecorder
          memoId={memo.id}
          onRecordingSaved={handleRecordingSaved}
          onClose={() => setShowAudioRecorder(false)}
        />
      )}
    </div>
  );
};
