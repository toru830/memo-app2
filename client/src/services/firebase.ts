// Firebase configuration and initialization
declare const firebase: any;

// 緊急デバッグ：環境変数の詳細確認
console.log('🚨 EMERGENCY DEBUG - Environment Variables:');
console.log('NODE_ENV:', import.meta.env.NODE_ENV);
console.log('MODE:', import.meta.env.MODE);
console.log('PROD:', import.meta.env.PROD);
console.log('DEV:', import.meta.env.DEV);
console.log('VITE_FIREBASE_API_KEY:', import.meta.env.VITE_FIREBASE_API_KEY);
console.log('VITE_FIREBASE_AUTH_DOMAIN:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
console.log('VITE_FIREBASE_PROJECT_ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);
console.log('VITE_FIREBASE_STORAGE_BUCKET:', import.meta.env.VITE_FIREBASE_STORAGE_BUCKET);
console.log('VITE_FIREBASE_MESSAGING_SENDER_ID:', import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID);
console.log('VITE_FIREBASE_APP_ID:', import.meta.env.VITE_FIREBASE_APP_ID);

// 環境変数が読み込まれているかチェック
const hasEnvVars = import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN && 
  import.meta.env.VITE_FIREBASE_PROJECT_ID;

console.log('🔍 Environment Variables Check:', {
  hasEnvVars,
  apiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: !!import.meta.env.VITE_FIREBASE_PROJECT_ID
});

// Firebase設定（完全ハードコード - 確実に動作させる）
const firebaseConfig = {
  apiKey: "AIzaSyBhl1GkAnWHRxyza7X9-M8Y3sdWhHGRiC0",
  authDomain: "memo-app-7d6cf.firebaseapp.com",
  projectId: "memo-app-7d6cf",
  storageBucket: "memo-app-7d6cf.firebasestorage.app",
  messagingSenderId: "935089831921",
  appId: "1:935089831921:web:1ac161a36bc175c1090e50"
};

console.log('🔥 Firebase Config:', firebaseConfig);

// Firebase初期化（ブラウザ環境のみ）
let app: any = null;
let auth: any = null;
let db: any = null;
let firebaseInstance: any = null;

// 確実にFirebaseを初期化
console.log('🚀 Starting Firebase initialization...');

// 少し待ってからFirebaseを初期化（SDK読み込み完了を待つ）
setTimeout(() => {
  try {
    console.log('🔍 Checking Firebase SDK...');
    console.log('window.firebase:', typeof (window as any).firebase);
    
    if (typeof window !== 'undefined' && (window as any).firebase) {
      firebaseInstance = (window as any).firebase;
      
      console.log('🔥 Firebase SDK found, initializing...');
      
      // Firebase アプリを初期化
      if (!firebaseInstance.apps.length) {
        app = firebaseInstance.initializeApp(firebaseConfig);
      } else {
        app = firebaseInstance.app();
      }
      
      auth = firebaseInstance.auth();
      db = firebaseInstance.firestore();
      
      console.log('✅ Firebase initialized successfully!');
      console.log('Auth:', !!auth);
      console.log('Firestore:', !!db);
    } else {
      console.error('❌ Firebase SDK not found on window object');
    }
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
  }
}, 1000); // 1秒待ってから初期化

export { app, auth, db, firebaseInstance as firebase };

