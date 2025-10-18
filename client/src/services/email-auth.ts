// シンプルなメール・パスワード認証サービス
export interface User {
  id: string;
  email: string;
  displayName?: string;
}

class EmailAuthService {
  private user: User | null = null;
  private authStateListeners: ((user: User | null) => void)[] = [];

  constructor() {
    // ローカルストレージからユーザー情報を復元
    this.loadUserFromStorage();
  }

  // ユーザー情報をローカルストレージから読み込み
  private loadUserFromStorage(): void {
    const stored = localStorage.getItem('memo-app-user');
    if (stored) {
      try {
        this.user = JSON.parse(stored);
      } catch {
        localStorage.removeItem('memo-app-user');
      }
    }
  }

  // ユーザー情報をローカルストレージに保存
  private saveUserToStorage(user: User | null): void {
    if (user) {
      localStorage.setItem('memo-app-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('memo-app-user');
    }
  }

  // 認証状態の変更を監視
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.authStateListeners.push(callback);
    
    // 即座に現在の状態を通知
    callback(this.user);
    
    // リスナーを削除する関数を返す
    return () => {
      const index = this.authStateListeners.indexOf(callback);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }

  // 認証状態の変更を通知
  private notifyAuthStateChange(): void {
    this.authStateListeners.forEach(callback => callback(this.user));
  }

  // メール形式をチェック
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // パスワードの強度をチェック
  private isValidPassword(password: string): boolean {
    return password.length >= 6;
  }

  // エラーメッセージを日本語に変換
  private getErrorMessage(error: any): string {
    const errorMessages: { [key: string]: string } = {
      'auth/email-already-in-use': 'このメールアドレスは既に使用されています',
      'auth/invalid-email': 'メールアドレスの形式が正しくありません',
      'auth/operation-not-allowed': 'この操作は許可されていません',
      'auth/weak-password': 'パスワードが弱すぎます（6文字以上）',
      'auth/user-disabled': 'このアカウントは無効化されています',
      'auth/user-not-found': 'このメールアドレスのアカウントが見つかりません',
      'auth/wrong-password': 'パスワードが間違っています',
      'auth/too-many-requests': '試行回数が多すぎます。しばらく待ってから再試行してください',
      'auth/network-request-failed': 'ネットワークエラーが発生しました',
      'auth/invalid-credential': '認証情報が無効です',
    };

    return errorMessages[error.code] || '認証に失敗しました';
  }

  // 新規登録
  async createUserWithEmailAndPassword(email: string, password: string): Promise<User> {
    // バリデーション
    if (!this.isValidEmail(email)) {
      throw new Error('メールアドレスの形式が正しくありません');
    }
    if (!this.isValidPassword(password)) {
      throw new Error('パスワードは6文字以上で入力してください');
    }

    try {
      // シンプルな認証シミュレーション
      // 実際のプロジェクトでは、バックエンドAPIを使用
      const user: User = {
        id: Date.now().toString(),
        email: email,
        displayName: email.split('@')[0],
      };

      this.user = user;
      this.saveUserToStorage(user);
      this.notifyAuthStateChange();

      return user;
    } catch (error) {
      throw new Error(this.getErrorMessage(error));
    }
  }

  // ログイン
  async signInWithEmailAndPassword(email: string, password: string): Promise<User> {
    // バリデーション
    if (!this.isValidEmail(email)) {
      throw new Error('メールアドレスの形式が正しくありません');
    }
    if (!password) {
      throw new Error('パスワードを入力してください');
    }

    try {
      // シンプルな認証シミュレーション
      // 実際のプロジェクトでは、バックエンドAPIを使用
      const user: User = {
        id: Date.now().toString(),
        email: email,
        displayName: email.split('@')[0],
      };

      this.user = user;
      this.saveUserToStorage(user);
      this.notifyAuthStateChange();

      return user;
    } catch (error) {
      throw new Error(this.getErrorMessage(error));
    }
  }

  // ログアウト
  async signOut(): Promise<void> {
    this.user = null;
    this.saveUserToStorage(null);
    this.notifyAuthStateChange();
  }

  // 現在のユーザーを取得
  getCurrentUser(): User | null {
    return this.user;
  }

  // 認証状態を確認
  isAuthenticated(): boolean {
    return this.user !== null;
  }
}

export const emailAuthService = new EmailAuthService();
