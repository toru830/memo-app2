// Firebase configuration and initialization
declare const firebase: any;

// デバッグ用：環境変数の確認
console.log('🔍 Environment Variables Debug:');
console.log('VITE_FIREBASE_API_KEY:', import.meta.env.VITE_FIREBASE_API_KEY);
console.log('VITE_FIREBASE_AUTH_DOMAIN:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
console.log('VITE_FIREBASE_PROJECT_ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);
console.log('VITE_FIREBASE_STORAGE_BUCKET:', import.meta.env.VITE_FIREBASE_STORAGE_BUCKET);
console.log('VITE_FIREBASE_MESSAGING_SENDER_ID:', import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID);
console.log('VITE_FIREBASE_APP_ID:', import.meta.env.VITE_FIREBASE_APP_ID);

// Firebase設定（環境変数から読み込み、なければ無効な設定）
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBhl1GkAnWHRxyza7X9-M8Y3sdWhHGRiC0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "memo-app-7d6cf.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "memo-app-7d6cf",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "memo-app-7d6cf.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "935089831921",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:935089831921:web:1ac161a36bc175c1090e50"
};

console.log('🔥 Firebase Config:', firebaseConfig);

// Firebase初期化（ブラウザ環境のみ）
let app: any = null;
let auth: any = null;
let db: any = null;
let firebaseInstance: any = null;

// Firebase初期化の条件を改善
const isFirebaseConfigured = firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "firebase-not-configured" &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== "firebase-not-configured";

console.log('🔧 Firebase Configuration Check:', {
  isFirebaseConfigured,
  hasWindow: typeof window !== 'undefined',
  apiKey: firebaseConfig.apiKey,
  projectId: firebaseConfig.projectId
});

if (typeof window !== 'undefined' && isFirebaseConfigured) {
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
      
      console.log('✅ Firebase initialized successfully');
    } else {
      console.error('❌ Firebase instance not found');
    }
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
  }
} else {
  console.log('⚠️ Firebase not configured - using local storage only');
  console.log('Configuration status:', {
    hasWindow: typeof window !== 'undefined',
    isFirebaseConfigured,
    config: firebaseConfig
  });
}

export { app, auth, db, firebaseInstance as firebase };

