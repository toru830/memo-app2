// Firebase configuration and initialization
declare const firebase: any;

// Firebase設定（環境変数から読み込み、フォールバック付き）
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBhl1GkAnWHRxyza7X9-M8Y3sdWhHGRiC0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "memo-app-7d6cf.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "memo-app-7d6cf",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "memo-app-7d6cf.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "935089831921",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:935089831921:web:1ac161a36bc175c1090e50"
};

// デバッグ用：環境変数の値を確認
console.log('🔍 Environment Variables Debug:');
console.log('VITE_FIREBASE_API_KEY:', import.meta.env.VITE_FIREBASE_API_KEY);
console.log('VITE_FIREBASE_AUTH_DOMAIN:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
console.log('VITE_FIREBASE_PROJECT_ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);
console.log('Firebase Config:', firebaseConfig);

// Firebase初期化
let app: any = null;
let auth: any = null;
let db: any = null;
let firebaseInstance: any = null;

// 環境変数が設定されているかチェック
const isFirebaseConfigured = firebaseConfig.apiKey && 
  firebaseConfig.authDomain && 
  firebaseConfig.projectId;

console.log('🔧 Firebase Configuration Check:', {
  isFirebaseConfigured,
  hasWindow: typeof window !== 'undefined',
  apiKey: !!firebaseConfig.apiKey,
  authDomain: !!firebaseConfig.authDomain,
  projectId: !!firebaseConfig.projectId
});

// ブラウザ環境でFirebaseが設定されている場合のみ初期化
if (typeof window !== 'undefined' && isFirebaseConfigured) {
  try {
    firebaseInstance = (window as any).firebase;
    
    if (firebaseInstance) {
      console.log('🚀 Initializing Firebase...');
      
      // Firebase アプリを初期化
      if (!firebaseInstance.apps.length) {
        app = firebaseInstance.initializeApp(firebaseConfig);
      } else {
        app = firebaseInstance.app();
      }
      
      auth = firebaseInstance.auth();
      db = firebaseInstance.firestore();
      
      console.log('✅ Firebase initialized successfully!');
    } else {
      console.error('❌ Firebase SDK not found');
    }
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
  }
} else {
  console.log('Firebase not configured - using local storage only');
}

export { app, auth, db, firebaseInstance as firebase };

