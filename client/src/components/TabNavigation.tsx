import React from 'react';
import { 
  Home, 
  CheckSquare, 
  Lightbulb, 
  ShoppingCart, 
  Heart,
  Plus
} from 'lucide-react';

export type TabType = 'all' | 'tasks' | 'ideas' | 'shopping' | 'thoughts' | 'add';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'all' as TabType,
      label: 'すべて',
      icon: Home,
      color: 'text-gray-400',
      activeColor: 'text-blue-400',
      bgColor: 'bg-blue-600/20',
    },
    {
      id: 'tasks' as TabType,
      label: 'タスク',
      icon: CheckSquare,
      color: 'text-gray-400',
      activeColor: 'text-green-400',
      bgColor: 'bg-green-600/20',
    },
    {
      id: 'ideas' as TabType,
      label: 'アイデア',
      icon: Lightbulb,
      color: 'text-gray-400',
      activeColor: 'text-yellow-400',
      bgColor: 'bg-yellow-600/20',
    },
    {
      id: 'shopping' as TabType,
      label: '買い物',
      icon: ShoppingCart,
      color: 'text-gray-400',
      activeColor: 'text-orange-400',
      bgColor: 'bg-orange-600/20',
    },
    {
      id: 'thoughts' as TabType,
      label: '思い',
      icon: Heart,
      color: 'text-gray-400',
      activeColor: 'text-pink-400',
      bgColor: 'bg-pink-600/20',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-gray-800/50 z-50">
      <div className="px-4 py-3 max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center justify-center aspect-square rounded-2xl transition-all duration-200 ${
                  isActive
                    ? `${tab.bgColor} ${tab.activeColor} scale-[1.02]`
                    : `${tab.color} hover:bg-gray-800`
                }`}
              >
                <Icon size={18} />
              </button>
            );
          })}
          
          {/* 追加ボタン */}
          <button
            onClick={() => onTabChange('add')}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
              activeTab === 'add'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white scale-105 shadow-lg'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:scale-105 shadow-md'
            }`}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
