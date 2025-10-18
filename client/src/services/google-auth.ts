// Google認証サービス（Firebaseなし）
interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture: string;
}

class GoogleAuthService {
  private user: GoogleUser | null = null;
  private readonly CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // 後で設定

  // Google認証を初期化
  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Google Auth is only available in browser'));
        return;
      }

      // Google API スクリプトを動的に読み込み
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        gapi.load('auth2', () => {
          gapi.auth2.init({
            client_id: this.CLIENT_ID,
          }).then(() => {
            resolve();
          }).catch(reject);
        });
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Google認証でログイン
  async signIn(): Promise<GoogleUser> {
    if (typeof window === 'undefined') {
      throw new Error('Google Auth is only available in browser');
    }

    const authInstance = gapi.auth2.getAuthInstance();
    const googleUser = await authInstance.signIn();
    const profile = googleUser.getBasicProfile();
    
    this.user = {
      id: profile.getId(),
      name: profile.getName(),
      email: profile.getEmail(),
      picture: profile.getImageUrl(),
    };

    // ローカルストレージに保存
    localStorage.setItem('google-user', JSON.stringify(this.user));
    
    return this.user;
  }

  // ログアウト
  async signOut(): Promise<void> {
    if (typeof window === 'undefined') {
      throw new Error('Google Auth is only available in browser');
    }

    const authInstance = gapi.auth2.getAuthInstance();
    await authInstance.signOut();
    
    this.user = null;
    localStorage.removeItem('google-user');
  }

  // 現在のユーザーを取得
  getCurrentUser(): GoogleUser | null {
    if (this.user) {
      return this.user;
    }

    // ローカルストレージから復元
    const stored = localStorage.getItem('google-user');
    if (stored) {
      try {
        this.user = JSON.parse(stored);
        return this.user;
      } catch {
        localStorage.removeItem('google-user');
      }
    }

    return null;
  }

  // 認証状態を確認
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  // 認証状態の変更を監視
  onAuthStateChanged(callback: (user: GoogleUser | null) => void): void {
    if (typeof window === 'undefined') return;

    const authInstance = gapi.auth2.getAuthInstance();
    authInstance.isSignedIn.listen((isSignedIn) => {
      if (isSignedIn) {
        const googleUser = authInstance.currentUser.get();
        const profile = googleUser.getBasicProfile();
        const user: GoogleUser = {
          id: profile.getId(),
          name: profile.getName(),
          email: profile.getEmail(),
          picture: profile.getImageUrl(),
        };
        this.user = user;
        localStorage.setItem('google-user', JSON.stringify(user));
        callback(user);
      } else {
        this.user = null;
        localStorage.removeItem('google-user');
        callback(null);
      }
    });
  }
}

export const googleAuthService = new GoogleAuthService();
