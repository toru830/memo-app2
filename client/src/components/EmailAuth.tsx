import React, { useState, useEffect } from 'react';
import { LogIn, UserPlus, Mail, Lock, Eye, EyeOff, X } from 'lucide-react';
import { emailAuthService, User } from '../services/email-auth';

interface EmailAuthProps {
  onAuthChange?: (user: User | null) => void;
}

export const EmailAuth: React.FC<EmailAuthProps> = ({ onAuthChange }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 認証状態の変更を監視
    const unsubscribe = emailAuthService.onAuthStateChanged((user) => {
      setUser(user);
      if (onAuthChange) onAuthChange(user);
    });

    return unsubscribe;
  }, [onAuthChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await emailAuthService.signInWithEmailAndPassword(email, password);
      } else {
        await emailAuthService.createUserWithEmailAndPassword(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '認証に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await emailAuthService.signOut();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ログアウトに失敗しました');
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setError('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  // ログイン済みの場合はユーザー情報を表示
  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <UserPlus size={16} className="text-white" />
          </div>
          <span className="text-sm text-white hidden sm:block">{user.email}</span>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm"
        >
          <LogIn size={16} className={isLoading ? 'animate-spin' : ''} />
          {isLoading ? 'ログアウト中...' : 'ログアウト'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setIsLogin(true)}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isLogin
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        ログイン
      </button>
      <button
        onClick={() => setIsLogin(false)}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          !isLogin
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        新規登録
      </button>
      
      {/* 認証フォームモーダル */}
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {isLogin ? (
                  <>
                    <LogIn size={24} className="text-blue-400" />
                    ログイン
                  </>
                ) : (
                  <>
                    <UserPlus size={24} className="text-green-400" />
                    新規登録
                  </>
                )}
              </h3>
              <button
                onClick={resetForm}
                className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* メールアドレス */}
              <div>
                <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-1">
                  メールアドレス
                </label>
                <div className="relative">
                  <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="example@email.com"
                    required
                  />
                </div>
              </div>

              {/* パスワード */}
              <div>
                <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-1">
                  パスワード
                </label>
                <div className="relative">
                  <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="パスワードを入力"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {!isLogin && (
                  <p className="text-xs text-gray-400 mt-1">パスワードは6文字以上で入力してください</p>
                )}
              </div>

              {/* エラーメッセージ */}
              {error && (
                <div className="bg-red-800/50 border border-red-600 text-red-100 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* 送信ボタン */}
              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isLogin ? 'ログイン中...' : '登録中...'}
                  </>
                ) : (
                  <>
                    {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                    {isLogin ? 'ログイン' : '新規登録'}
                  </>
                )}
              </button>
            </form>

            {/* モード切り替え */}
            <div className="mt-4 text-center">
              <button
                onClick={toggleMode}
                className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
              >
                {isLogin ? 'アカウントをお持ちでない方は新規登録' : '既にアカウントをお持ちの方はログイン'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
