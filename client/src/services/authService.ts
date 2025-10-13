import { auth, firebase } from './firebase';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

class AuthService {
  private currentUser: User | null = null;
  private authStateListeners: ((user: User | null) => void)[] = [];

  constructor() {
    // 認証状態の変更を監視
    if (auth) {
      auth.onAuthStateChanged((firebaseUser: any) => {
        if (firebaseUser) {
          this.currentUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL
          };
        } else {
          this.currentUser = null;
        }
        
        // すべてのリスナーに通知
        this.authStateListeners.forEach(listener => listener(this.currentUser));
      });
    }
  }

  // 認証状態の変更を監視
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.authStateListeners.push(callback);
    // 現在のユーザー状態をすぐに通知
    callback(this.currentUser);
    
    // アンサブスクライブ関数を返す
    return () => {
      this.authStateListeners = this.authStateListeners.filter(l => l !== callback);
    };
  }

  // Googleでログイン
  async signInWithGoogle(): Promise<User> {
    if (!auth || !firebase) {
      throw new Error('Firebase is not initialized');
    }

    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await auth.signInWithPopup(provider);
      
      if (!result.user) {
        throw new Error('No user returned from sign in');
      }

      const user: User = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL
      };

      this.currentUser = user;
      return user;
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(`ログインに失敗しました: ${error.message}`);
    }
  }

  // ログアウト
  async signOut(): Promise<void> {
    if (!auth) {
      throw new Error('Firebase is not initialized');
    }

    try {
      await auth.signOut();
      this.currentUser = null;
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(`ログアウトに失敗しました: ${error.message}`);
    }
  }

  // 現在のユーザーを取得
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // ログイン状態を確認
  isSignedIn(): boolean {
    return this.currentUser !== null;
  }
}

export const authService = new AuthService();

