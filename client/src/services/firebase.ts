// Firebase configuration and initialization
declare const firebase: any;

// Firebase設定（環境変数から読み込み、なければ無効な設定）
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "firebase-not-configured",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "firebase-not-configured",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "firebase-not-configured",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "firebase-not-configured",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "firebase-not-configured",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "firebase-not-configured"
};

// Firebase初期化（ブラウザ環境のみ）
let app: any = null;
let auth: any = null;
let db: any = null;
let firebaseInstance: any = null;

if (typeof window !== 'undefined' && import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== "firebase-not-configured") {
  try {
    // グローバルfirebaseオブジェクトを取得
    firebaseInstance = (window as any).firebase;
    
    if (firebaseInstance && firebaseInstance.apps) {
      // 既に初期化されていない場合のみ初期化
      if (!firebaseInstance.apps.length) {
        app = firebaseInstance.initializeApp(firebaseConfig);
      } else {
        app = firebaseInstance.app();
      }
      
      auth = firebaseInstance.auth();
      db = firebaseInstance.firestore();
      
      console.log('Firebase initialized successfully');
    }
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
} else {
  console.log('Firebase not configured - using local storage only');
}

export { app, auth, db, firebaseInstance as firebase };

