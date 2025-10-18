import React, { useState, useEffect } from 'react';
import { Github, Cloud, CloudOff, RefreshCcw, CheckCircle, AlertCircle } from 'lucide-react';
import { gistSyncService } from '../services/gist-sync';

interface GitHubSyncProps {
  onSyncComplete?: () => void;
}

export const GitHubSync: React.FC<GitHubSyncProps> = ({ onSyncComplete }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [gistId, setGistId] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    // ローカルストレージから認証情報を復元
    gistSyncService.loadAuth();
    setIsAuthenticated(gistSyncService.isAuthenticated());
  }, []);

  const showStatus = (type: 'success' | 'error', message: string) => {
    setStatus(type);
    setStatusMessage(message);
    setTimeout(() => {
      setStatus('idle');
      setStatusMessage('');
    }, 3000);
  };

  const handleLogin = async () => {
    if (!accessToken.trim()) {
      showStatus('error', 'GitHub Personal Access Token を入力してください');
      return;
    }

    setIsLoading(true);
    try {
      gistSyncService.setAccessToken(accessToken);
      
      // 認証テスト
      const isValid = await gistSyncService.testAuth();
      if (!isValid) {
        throw new Error('Invalid access token');
      }

      if (gistId.trim()) {
        // 既存のGistを使用
        gistSyncService.setGistId(gistId);
        // Gistの存在確認
        await gistSyncService.getData();
      } else {
        // 新しいGistを作成
        const newGistId = await gistSyncService.createGist({
          memos: [],
          lastSync: new Date().toISOString()
        });
        setGistId(newGistId);
      }

      setIsAuthenticated(true);
      setShowTokenInput(false);
      showStatus('success', 'GitHub認証が完了しました');
      
      if (onSyncComplete) {
        onSyncComplete();
      }
    } catch (error) {
      console.error('GitHub認証エラー:', error);
      showStatus('error', `認証エラー: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    gistSyncService.logout();
    setAccessToken('');
    setGistId('');
    setIsAuthenticated(false);
    setShowTokenInput(false);
    showStatus('success', 'ログアウトしました');
  };

  const handleSync = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      await gistSyncService.syncToGist();
      showStatus('success', 'データを同期しました');
      if (onSyncComplete) {
        onSyncComplete();
      }
    } catch (error) {
      console.error('同期エラー:', error);
      showStatus('error', `同期エラー: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncFrom = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      await gistSyncService.syncFromGist();
      showStatus('success', 'データを取得しました');
      if (onSyncComplete) {
        onSyncComplete();
      }
    } catch (error) {
      console.error('取得エラー:', error);
      showStatus('error', `取得エラー: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleSyncFrom}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm"
        >
          <Cloud size={16} className={isLoading ? 'animate-spin' : ''} />
          {isLoading ? '取得中...' : '取得'}
        </button>
        <button
          onClick={handleSync}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm"
        >
          <RefreshCcw size={16} className={isLoading ? 'animate-spin' : ''} />
          {isLoading ? '同期中...' : '同期'}
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
        >
          <CloudOff size={16} />
          ログアウト
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {!showTokenInput ? (
        <button
          onClick={() => setShowTokenInput(true)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
        >
          <Github size={16} />
          GitHub同期
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="password"
            placeholder="GitHub Personal Access Token"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            className="px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
            style={{ minWidth: '200px' }}
          />
          <input
            type="text"
            placeholder="Gist ID (任意)"
            value={gistId}
            onChange={(e) => setGistId(e.target.value)}
            className="px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
            style={{ minWidth: '120px' }}
          />
          <button
            onClick={handleLogin}
            disabled={isLoading || !accessToken.trim()}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm"
          >
            {isLoading ? '認証中...' : 'ログイン'}
          </button>
          <button
            onClick={() => setShowTokenInput(false)}
            className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
          >
            キャンセル
          </button>
        </div>
      )}
      
      {/* ステータス表示 */}
      {status !== 'idle' && (
        <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
          status === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {status === 'success' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
          {statusMessage}
        </div>
      )}
    </div>
  );
};
