import React, { useState, useEffect } from 'react';
import { LogIn, LogOut, Cloud, CloudOff } from 'lucide-react';
import { authService, User } from '../services/authService';
import { firestoreService } from '../services/firestoreService';

interface AuthButtonProps {
  onSyncComplete?: () => void;
}

export const AuthButton: React.FC<AuthButtonProps> = ({ onSyncComplete }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    // 認証状態の監視
    const unsubscribe = authService.onAuthStateChanged(async (authUser) => {
      setUser(authUser);
      
      if (authUser) {
        // ログイン時に自動同期
        setSyncing(true);
        try {
          await firestoreService.syncData();
          firestoreService.startRealtimeSync(() => {
            if (onSyncComplete) {
              onSyncComplete();
            }
          });
          console.log('Auto sync completed');
        } catch (error) {
          console.error('Auto sync error:', error);
        } finally {
          setSyncing(false);
        }
      } else {
        // ログアウト時にリアルタイム同期を停止
        firestoreService.stopRealtimeSync();
      }
    });

    return () => unsubscribe();
  }, [onSyncComplete]);

  const handleSignIn = async () => {
    // Firebase設定が無い場合は説明を表示
    if (!import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY === "firebase-not-configured") {
      setError('Firebase設定が必要です。詳細は開発者にお問い合わせください。');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await authService.signInWithGoogle();
    } catch (error: any) {
      setError(error.message);
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.signOut();
    } catch (error: any) {
      setError(error.message);
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-2">
        {syncing && (
          <div className="flex items-center gap-2 text-xs text-blue-400">
            <Cloud size={14} className="animate-pulse" />
            <span>同期中...</span>
          </div>
        )}
        
        {!syncing && (
          <div className="flex items-center gap-2 text-xs text-green-400">
            <Cloud size={14} />
            <span className="hidden sm:inline">クラウド同期中</span>
          </div>
        )}
        
        {user.photoURL && (
          <img 
            src={user.photoURL} 
            alt={user.displayName || 'User'} 
            className="w-6 h-6 rounded-full"
          />
        )}
        
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          title="ログアウト"
        >
          <LogOut size={16} className="text-gray-400" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleSignIn}
        disabled={loading}
        className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 text-white text-sm"
        title="Googleでログイン"
      >
        {loading ? (
          <>
            <CloudOff size={16} className="animate-pulse" />
            <span className="hidden sm:inline">ログイン中...</span>
          </>
        ) : (
          <>
            <LogIn size={16} />
            <span className="hidden sm:inline">クラウド同期</span>
          </>
        )}
      </button>
      
      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
};

