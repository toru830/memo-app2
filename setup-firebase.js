const https = require('https');
const fs = require('fs');

console.log('🔥 Firebase設定の自動化スクリプト');
console.log('');

// Firebase設定の確認
const firebaseConfig = {
  projectId: 'memo-app-7d6cf',
  authDomain: 'memo-app-7d6cf.firebaseapp.com',
  storageBucket: 'memo-app-7d6cf.firebasestorage.app',
  messagingSenderId: '935089831921',
  appId: '1:935089831921:web:1ac161a36bc175c1090e50'
};

console.log('📋 Firebase設定情報:');
console.log(`Project ID: ${firebaseConfig.projectId}`);
console.log(`Auth Domain: ${firebaseConfig.authDomain}`);
console.log('');

console.log('🔧 自動化された設定:');
console.log('✅ firebase.json - Hosting設定');
console.log('✅ .firebaserc - プロジェクト設定');
console.log('✅ firestore.rules - セキュリティルール');
console.log('✅ firestore.indexes.json - インデックス設定');
console.log('');

console.log('🚀 次のステップ:');
console.log('1. Firebase CLIで認証: firebase login');
console.log('2. プロジェクト設定: firebase use memo-app-7d6cf');
console.log('3. ルールデプロイ: firebase deploy --only firestore:rules');
console.log('4. Hostingデプロイ: firebase deploy --only hosting');
console.log('');

console.log('📝 手動設定が必要な項目:');
console.log('1. Firebase Console > Authentication > Sign-in method');
console.log('   - Google プロバイダーを有効化');
console.log('2. Firebase Console > Authentication > Settings');
console.log('   - 承認済みドメインに "toru830.github.io" を追加');
console.log('');

console.log('🎉 設定完了後、以下でアクセス可能:');
console.log('   https://toru830.github.io/memo-app/');
console.log('   https://memo-app-7d6cf.web.app/');
