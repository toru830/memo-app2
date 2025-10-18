import React, { useState, useEffect } from 'react';
import { LogIn, LogOut, User } from 'lucide-react';
import { googleAuthService, GoogleUser } from '../services/google-auth';

interface GoogleAuthProps {
  onAuthChange?: (user: GoogleUser | null) => void;
}

export const GoogleAuth: React.FC<GoogleAuthProps> = ({ onAuthChange }) => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Google認証を初期化
    const initAuth = async () => {
      try {
        await googleAuthService.initialize();
        setIsInitialized(true);
        
        // 既存のユーザーを確認
        const currentUser = googleAuthService.getCurrentUser();
        setUser(currentUser);
        if (onAuthChange) onAuthChange(currentUser);

        // 認証状態の変更を監視
        googleAuthService.onAuthStateChanged((user) => {
          setUser(user);
          if (onAuthChange) onAuthChange(user);
        });
      } catch (error) {
        console.error('Google Auth initialization failed:', error);
      }
    };

    initAuth();
  }, [onAuthChange]);

  const handleSignIn = async () => {
    if (!isInitialized) return;
    
    setIsLoading(true);
    try {
      const user = await googleAuthService.signIn();
      setUser(user);
      if (onAuthChange) onAuthChange(user);
    } catch (error) {
      console.error('Sign in failed:', error);
      alert('ログインに失敗しました。Google Client IDが正しく設定されているか確認してください。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!isInitialized) return;
    
    setIsLoading(true);
    try {
      await googleAuthService.signOut();
      setUser(null);
      if (onAuthChange) onAuthChange(null);
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
        <span className="text-sm text-gray-400">初期化中...</span>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <img 
            src={user.picture} 
            alt={user.name}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm text-white hidden sm:block">{user.name}</span>
        </div>
        <button
          onClick={handleSignOut}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm"
        >
          <LogOut size={16} className={isLoading ? 'animate-spin' : ''} />
          {isLoading ? 'ログアウト中...' : 'ログアウト'}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm"
    >
      <LogIn size={16} className={isLoading ? 'animate-spin' : ''} />
      {isLoading ? 'ログイン中...' : 'Googleでログイン'}
    </button>
  );
};
