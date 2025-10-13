// Firebase Console自動設定スクリプト
// このスクリプトは手動でFirebase Consoleを操作するためのガイドです

console.log('🔥 Firebase Console設定ガイド');
console.log('===============================');

const steps = [
  {
    title: '1. Webアプリを追加',
    url: 'https://console.firebase.google.com/u/0/project/memo-app-7d6cf/settings/general',
    actions: [
      '「マイアプリ」セクションで「</>」アイコンをクリック',
      'アプリのニックネーム: memo-web-app',
      '「アプリを登録」をクリック',
      '設定情報をコピー'
    ]
  },
  {
    title: '2. Authentication設定',
    url: 'https://console.firebase.google.com/u/0/project/memo-app-7d6cf/authentication/providers',
    actions: [
      '「始める」をクリック',
      '「Sign-in method」タブを開く',
      '「Google」をクリックして有効化',
      'プロジェクトの公開名: Memo App',
      'サポートメール: あなたのメールアドレス',
      '「保存」をクリック'
    ]
  },
  {
    title: '3. Firestore Database設定',
    url: 'https://console.firebase.google.com/u/0/project/memo-app-7d6cf/firestore',
    actions: [
      '「データベースを作成」をクリック',
      '「本番環境モードで開始」を選択',
      'ロケーション: asia-northeast1 (東京)',
      '「有効にする」をクリック'
    ]
  },
  {
    title: '4. セキュリティルール設定',
    url: 'https://console.firebase.google.com/u/0/project/memo-app-7d6cf/firestore/rules',
    actions: [
      '「ルール」タブを開く',
      '既存のルールを削除',
      '新しいルールを貼り付け',
      '「公開」をクリック'
    ]
  },
  {
    title: '5. 承認済みドメイン設定',
    url: 'https://console.firebase.google.com/u/0/project/memo-app-7d6cf/authentication/settings',
    actions: [
      '「承認済みドメイン」セクションを探す',
      '「ドメインを追加」をクリック',
      'localhost を追加',
      'toru830.github.io を追加'
    ]
  }
];

steps.forEach((step, index) => {
  console.log(`\n${step.title}`);
  console.log(`URL: ${step.url}`);
  console.log('手順:');
  step.actions.forEach((action, i) => {
    console.log(`  ${i + 1}. ${action}`);
  });
});

console.log('\n===============================');
console.log('✅ 設定完了後、GitHub Secretsに値を追加してください');
console.log('📖 詳細: setup-github-secrets.md を参照');
