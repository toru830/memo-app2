import React from 'react';
import { FileText, CheckCircle, Clock, Star } from 'lucide-react';
import { Memo } from '../types';

interface StatsCardProps {
  memos: Memo[];
}

export const StatsCard: React.FC<StatsCardProps> = ({ memos }) => {
  const stats = React.useMemo(() => {
    const total = memos.length;
    const tasks = memos.filter(memo => memo.is_task);
    const completed = tasks.filter(memo => memo.is_completed);
    const pending = tasks.filter(memo => !memo.is_completed);
    const highPriority = memos.filter(memo => memo.priority === 3);
    
    const completionRate = tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0;
    
    return {
      total,
      tasks: tasks.length,
      completed: completed.length,
      pending: pending.length,
      highPriority: highPriority.length,
      completionRate,
    };
  }, [memos]);

  const statItems = [
    {
      label: '総メモ数',
      value: stats.total,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'タスク数',
      value: stats.tasks,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: '完了済み',
      value: stats.completed,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: '未完了',
      value: stats.pending,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      label: '高優先度',
      value: stats.highPriority,
      icon: Star,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      label: '完了率',
      value: `${stats.completionRate}%`,
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {statItems.map((item, index) => (
        <div key={index} className="card">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${item.bgColor}`}>
              <item.icon size={20} className={item.color} />
            </div>
            <div className="ml-3">
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              <p className="text-sm text-gray-500">{item.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
