// Firebase configuration and initialization
declare const firebase: any;

// シンプルなFirebase設定（環境変数を使わない）
console.log('🚀 Simple Firebase Setup - No Environment Variables');

// Firebase設定（直接記述 - 確実に動作させる）
const firebaseConfig = {
  apiKey: "AIzaSyBhl1GkAnWHRxyza7X9-M8Y3sdWhHGRiC0",
  authDomain: "memo-app-7d6cf.firebaseapp.com",
  projectId: "memo-app-7d6cf",
  storageBucket: "memo-app-7d6cf.firebasestorage.app",
  messagingSenderId: "935089831921",
  appId: "1:935089831921:web:1ac161a36bc175c1090e50"
};

console.log('🔥 Firebase Config (Direct):', firebaseConfig);

// Firebase初期化（ブラウザ環境のみ）
let app: any = null;
let auth: any = null;
let db: any = null;
let firebaseInstance: any = null;

// シンプルなFirebase初期化
console.log('🚀 Starting Firebase initialization...');

if (typeof window !== 'undefined' && (window as any).firebase) {
  try {
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
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
  }
} else {
  console.error('❌ Firebase SDK not found on window object');
}

export { app, auth, db, firebaseInstance as firebase };

