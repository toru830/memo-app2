import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';
import { GoogleAuth } from './GoogleAuth';

interface ModernHeaderProps {
  onSearch: (term: string) => void;
  searchTerm: string;
  onSettingsClick?: () => void;
  activeTab?: string;
  onAuthChange?: (user: any) => void;
}

export const ModernHeader: React.FC<ModernHeaderProps> = ({ onSearch, searchTerm, onSettingsClick, activeTab, onAuthChange }) => {
  return (
    <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-gray-800/50">
      <div className="px-4 py-4">
        {/* 上部バー */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              📝 メモ
            </h1>
          </div>
          
                  <div className="flex items-center gap-3">
                    <GoogleAuth onAuthChange={onAuthChange} />
                    <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                      <Bell size={20} className="text-gray-400" />
                    </button>
                    <button 
                      onClick={onSettingsClick}
                      className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                    >
                      <Settings size={20} className="text-gray-400" />
                    </button>
                  </div>
        </div>

        {/* 検索バー - ホームタブのみ表示 */}
        {activeTab === 'all' && (
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 rounded-2xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-gray-700 transition-all duration-200 text-white placeholder-gray-400"
              placeholder="メモを検索..."
            />
          </div>
        )}
      </div>
    </div>
  );
};
