import React, { useState, useEffect } from 'react';
import { Github, Cloud, CloudOff, Sync } from 'lucide-react';
import { githubGistService } from '../services/githubGistService';

interface GitHubAuthProps {
  onSyncComplete?: () => void;
}

export const GitHubAuth: React.FC<GitHubAuthProps> = ({ onSyncComplete }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [gistId, setGistId] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);

  useEffect(() => {
    // ローカルストレージから認証情報を復元
    const savedToken = localStorage.getItem('github-access-token');
    const savedGistId = localStorage.getItem('github-gist-id');
    
    if (savedToken && savedGistId) {
      setAccessToken(savedToken);
      setGistId(savedGistId);
      githubGistService.setAccessToken(savedToken);
      githubGistService.setGistId(savedGistId);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async () => {
    if (!accessToken.trim()) {
      alert('GitHub Personal Access Token を入力してください');
      return;
    }

    setIsLoading(true);
    try {
      githubGistService.setAccessToken(accessToken);
      
      // 既存のGistがあるかチェック
      const existingData = await githubGistService.getData();
      
      if (existingData) {
        // 既存のGistを使用
        githubGistService.setGistId(gistId);
        localStorage.setItem('github-gist-id', gistId);
      } else {
        // 新しいGistを作成
        const newGistId = await githubGistService.createGist({
          memos: [],
          lastSync: new Date().toISOString()
        });
        setGistId(newGistId);
        localStorage.setItem('github-gist-id', newGistId);
      }

      localStorage.setItem('github-access-token', accessToken);
      setIsAuthenticated(true);
      setShowTokenInput(false);
      
      if (onSyncComplete) {
        onSyncComplete();
      }
    } catch (error) {
      console.error('GitHub認証エラー:', error);
      alert('GitHub認証に失敗しました。トークンを確認してください。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('github-access-token');
    localStorage.removeItem('github-gist-id');
    setAccessToken('');
    setGistId('');
    setIsAuthenticated(false);
    setShowTokenInput(false);
  };

  const handleSync = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      await githubGistService.syncToGist();
      if (onSyncComplete) {
        onSyncComplete();
      }
      alert('データを同期しました！');
    } catch (error) {
      console.error('同期エラー:', error);
      alert('同期に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleSync}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <Sync size={16} className={isLoading ? 'animate-spin' : ''} />
          {isLoading ? '同期中...' : 'クラウド同期'}
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
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
          className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          <Github size={16} />
          GitHub認証
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="password"
            placeholder="GitHub Personal Access Token"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            className="px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            style={{ minWidth: '200px' }}
          />
          <input
            type="text"
            placeholder="Gist ID (任意)"
            value={gistId}
            onChange={(e) => setGistId(e.target.value)}
            className="px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            style={{ minWidth: '120px' }}
          />
          <button
            onClick={handleLogin}
            disabled={isLoading || !accessToken.trim()}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? '認証中...' : 'ログイン'}
          </button>
          <button
            onClick={() => setShowTokenInput(false)}
            className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            キャンセル
          </button>
        </div>
      )}
    </div>
  );
};
