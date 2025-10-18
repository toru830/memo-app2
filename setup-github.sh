#!/bin/bash

# GitHub Secrets と Pages の自動設定スクリプト

echo "🚀 GitHub Secrets と Pages の設定を開始します..."

# GitHubリポジトリのURL
REPO_URL="https://github.com/toru830/memo-app.git"
REPO_NAME="toru830/memo-app"

echo "📋 設定するSecrets:"
echo "VITE_FIREBASE_API_KEY=AIzaSyBhl1GkAnWHRxyza7X9-M8Y3sdWhHGRiC0"
echo "VITE_FIREBASE_AUTH_DOMAIN=memo-app-7d6cf.firebaseapp.com"
echo "VITE_FIREBASE_PROJECT_ID=memo-app-7d6cf"
echo "VITE_FIREBASE_STORAGE_BUCKET=memo-app-7d6cf.firebasestorage.app"
echo "VITE_FIREBASE_MESSAGING_SENDER_ID=935089831921"
echo "VITE_FIREBASE_APP_ID=1:935089831921:web:1ac161a36bc175c1090e50"

echo ""
echo "🔧 手動設定が必要な項目:"
echo ""
echo "1. GitHub Secrets の設定:"
echo "   https://github.com/toru830/memo-app/settings/secrets/actions"
echo "   上記の6つのSecretsを追加してください"
echo ""
echo "2. GitHub Pages の有効化:"
echo "   https://github.com/toru830/memo-app/settings/pages"
echo "   Source を 'GitHub Actions' に設定してください"
echo ""
echo "3. Firebase Console で承認済みドメインを追加:"
echo "   https://console.firebase.google.com/u/0/project/memo-app-7d6cf/authentication/settings"
echo "   'toru830.github.io' を追加してください"
echo ""
echo "✅ 設定完了後、以下のURLでアクセス可能になります:"
echo "   https://toru830.github.io/memo-app/"
echo ""
echo "🎉 設定が完了すれば、どこからでもGoogleアカウントでログインしてタスク管理ができます！"
