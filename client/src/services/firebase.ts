// Firebase configuration and initialization
declare const firebase: any;

// Firebase設定（直接記述 - 環境変数を使わない）
const firebaseConfig = {
  apiKey: "AIzaSyBhl1GkAnWHRxyza7X9-M8Y3sdWhHGRiC0",
  authDomain: "memo-app-7d6cf.firebaseapp.com",
  projectId: "memo-app-7d6cf",
  storageBucket: "memo-app-7d6cf.firebasestorage.app",
  messagingSenderId: "935089831921",
  appId: "1:935089831921:web:1ac161a36bc175c1090e50"
};

console.log('🔥 Firebase Config:', firebaseConfig);

// Firebase初期化
let app: any = null;
let auth: any = null;
let db: any = null;
let firebaseInstance: any = null;

// ブラウザ環境でのみFirebaseを初期化
if (typeof window !== 'undefined') {
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
  console.log('⚠️ Not in browser environment');
}

export { app, auth, db, firebaseInstance as firebase };

