const https = require('https');

// GitHub Secrets の設定
const secrets = {
  'VITE_FIREBASE_API_KEY': 'AIzaSyBhl1GkAnWHRxyza7X9-M8Y3sdWhHGRiC0',
  'VITE_FIREBASE_AUTH_DOMAIN': 'memo-app-7d6cf.firebaseapp.com',
  'VITE_FIREBASE_PROJECT_ID': 'memo-app-7d6cf',
  'VITE_FIREBASE_STORAGE_BUCKET': 'memo-app-7d6cf.firebasestorage.app',
  'VITE_FIREBASE_MESSAGING_SENDER_ID': '935089831921',
  'VITE_FIREBASE_APP_ID': '1:935089831921:web:1ac161a36bc175c1090e50'
};

console.log('🔧 GitHub Secrets の設定が必要です:');
console.log('');
console.log('1. GitHubリポジトリにアクセス:');
console.log('   https://github.com/toru830/memo-app/settings/secrets/actions');
console.log('');
console.log('2. 以下の6つのSecretsを追加してください:');
console.log('');

Object.entries(secrets).forEach(([key, value]) => {
  console.log(`   ${key}: ${value}`);
});

console.log('');
console.log('3. Firebase Console で承認済みドメインを追加:');
console.log('   https://console.firebase.google.com/u/0/project/memo-app-7d6cf/authentication/settings');
console.log('   "toru830.github.io" を追加');
console.log('');
console.log('4. 設定完了後、以下でアクセス可能:');
console.log('   https://toru830.github.io/memo-app/');
console.log('');
console.log('🎉 設定が完了すれば、Googleアカウントでログインしてクラウド同期が利用できます！');
