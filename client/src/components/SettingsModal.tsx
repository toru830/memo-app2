import React from 'react';
import { X, Download, Upload, Database } from 'lucide-react';
import { DataManager } from './DataManager';

interface SettingsModalProps {
  onClose: () => void;
  onDataChange: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onDataChange }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">設定</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Database size={20} className="text-blue-400" />
                <h3 className="text-lg font-semibold text-white">データ管理</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                メモのエクスポート、インポート、データのクリアを行えます。
              </p>
              <DataManager onDataChange={onDataChange} />
            </div>

            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Database size={20} className="text-green-400" />
                <h3 className="text-lg font-semibold text-white">アプリ情報</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                <p>バージョン: 1.0.0</p>
                <p>開発者: Memo App Team</p>
                <p>更新日: 2024年1月</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
