import React, { useState } from 'react';
import { Download, Upload, Database, AlertCircle } from 'lucide-react';
import { localStorageService } from '../services/localStorage';

interface DataManagerProps {
  onDataChange: () => void;
}

export const DataManager: React.FC<DataManagerProps> = ({ onDataChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExport = async () => {
    try {
      setLoading(true);
      const data = await localStorageService.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `memo-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setMessage({ type: 'success', text: 'データをエクスポートしました' });
    } catch (error) {
      setMessage({ type: 'error', text: 'エクスポートに失敗しました' });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!importFile) return;

    try {
      setLoading(true);
      const text = await importFile.text();
      const data = JSON.parse(text);
      
      const result = await localStorageService.importData(data);
      
      setMessage({ 
        type: 'success', 
        text: `${result.imported}件のデータをインポートしました${result.errors.length > 0 ? ` (エラー: ${result.errors.length}件)` : ''}` 
      });
      
      onDataChange();
      setImportFile(null);
      setShowModal(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'インポートに失敗しました。ファイル形式を確認してください。' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/json') {
      setImportFile(file);
    } else {
      setMessage({ type: 'error', text: 'JSONファイルを選択してください' });
    }
  };

  const clearData = () => {
    if (window.confirm('すべてのデータを削除しますか？この操作は取り消せません。')) {
      localStorage.removeItem('memo-app-data');
      onDataChange();
      setMessage({ type: 'success', text: 'データをクリアしました' });
    }
  };

  return (
    <>
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleExport}
          disabled={loading}
          className="flex items-center justify-center w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          title="エクスポート"
        >
          <Download size={16} className="text-white" />
        </button>
        
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          title="インポート"
        >
          <Upload size={16} className="text-white" />
        </button>
        
        <button
          onClick={clearData}
          className="flex items-center justify-center w-10 h-10 bg-red-700 hover:bg-red-600 rounded-lg transition-colors"
          title="データクリア"
        >
          <Database size={16} className="text-white" />
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-900/50 text-green-400 border border-green-700/50' 
            : 'bg-red-900/50 text-red-400 border border-red-700/50'
        }`}>
          <AlertCircle size={16} />
          {message.text}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">データインポート</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  JSONファイルを選択
                </label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-600 file:text-white hover:file:bg-gray-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleImport}
                  disabled={!importFile || loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {loading ? 'インポート中...' : 'インポート'}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
