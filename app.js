// メモアプリケーション
class MemoApp {
    constructor() {
        this.memos = this.loadMemos();
        this.editingId = null;
        this.searchTerm = '';
        
        this.init();
    }
    
    // 初期化
    init() {
        this.renderMemos();
        this.setupEventListeners();
    }
    
    // メモの読み込み
    loadMemos() {
        const saved = localStorage.getItem('memo-app-data');
        return saved ? JSON.parse(saved) : [];
    }
    
    // メモの保存
    saveMemos() {
        localStorage.setItem('memo-app-data', JSON.stringify(this.memos));
    }
    
    // メモの描画
    renderMemos() {
        const container = document.getElementById('memos-container');
        container.innerHTML = '';
        
        const filteredMemos = this.memos.filter(memo => 
            memo.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            memo.content.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
        
        if (filteredMemos.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <h3>📝 メモがありません</h3>
                <p>「+ メモを追加」ボタンから新しいメモを作成しましょう</p>
            `;
            container.appendChild(emptyState);
            return;
        }
        
        filteredMemos.forEach(memo => {
            const memoCard = this.createMemoCard(memo);
            container.appendChild(memoCard);
        });
    }
    
    // メモカードの作成
    createMemoCard(memo) {
        const card = document.createElement('div');
        card.className = 'memo-card';
        
        const date = new Date(memo.createdAt).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        card.innerHTML = `
            <div class="memo-header">
                <div>
                    <div class="memo-title">${this.escapeHtml(memo.title)}</div>
                    <div class="memo-date">${date}</div>
                </div>
            </div>
            <div class="memo-content">${this.escapeHtml(memo.content)}</div>
            <div class="memo-actions">
                <button class="btn-edit" onclick="memoApp.editMemo(${memo.id})">編集</button>
                <button class="btn-delete" onclick="memoApp.deleteMemo(${memo.id})">削除</button>
            </div>
        `;
        
        return card;
    }
    
    // HTMLエスケープ
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // メモの追加
    addMemo() {
        this.editingId = null;
        this.showModal();
    }
    
    // メモの編集
    editMemo(id) {
        const memo = this.memos.find(m => m.id === id);
        if (memo) {
            this.editingId = id;
            document.getElementById('memo-title').value = memo.title;
            document.getElementById('memo-content').value = memo.content;
            this.showModal();
        }
    }
    
    // メモの削除
    deleteMemo(id) {
        if (confirm('このメモを削除しますか？')) {
            this.memos = this.memos.filter(m => m.id !== id);
            this.saveMemos();
            this.renderMemos();
        }
    }
    
    // メモの保存
    saveMemo() {
        const title = document.getElementById('memo-title').value.trim();
        const content = document.getElementById('memo-content').value.trim();
        
        if (!title || !content) {
            alert('タイトルと内容を入力してください');
            return;
        }
        
        const now = new Date().toISOString();
        
        if (this.editingId) {
            // 編集
            const memo = this.memos.find(m => m.id === this.editingId);
            if (memo) {
                memo.title = title;
                memo.content = content;
                memo.updatedAt = now;
            }
        } else {
            // 新規作成
            const newMemo = {
                id: Date.now(),
                title: title,
                content: content,
                createdAt: now,
                updatedAt: now
            };
            this.memos.unshift(newMemo);
        }
        
        this.saveMemos();
        this.hideModal();
        this.renderMemos();
    }
    
    // モーダル表示
    showModal() {
        const modal = document.getElementById('memo-modal');
        const title = document.getElementById('modal-title');
        const titleInput = document.getElementById('memo-title');
        const contentInput = document.getElementById('memo-content');
        
        if (this.editingId) {
            title.textContent = 'メモを編集';
        } else {
            title.textContent = 'メモを追加';
            titleInput.value = '';
            contentInput.value = '';
        }
        
        modal.style.display = 'block';
        titleInput.focus();
    }
    
    // モーダル非表示
    hideModal() {
        const modal = document.getElementById('memo-modal');
        modal.style.display = 'none';
        this.editingId = null;
    }
    
    // 検索
    searchMemos() {
        this.searchTerm = document.getElementById('search-input').value;
        this.renderMemos();
    }
    
    // イベントリスナーの設定
    setupEventListeners() {
        // メモ追加ボタン
        document.getElementById('add-memo-btn').addEventListener('click', () => {
            this.addMemo();
        });
        
        // 検索入力
        document.getElementById('search-input').addEventListener('input', () => {
            this.searchMemos();
        });
        
        // モーダル関連
        document.getElementById('close-modal').addEventListener('click', () => {
            this.hideModal();
        });
        
        document.getElementById('cancel-memo').addEventListener('click', () => {
            this.hideModal();
        });
        
        document.getElementById('save-memo').addEventListener('click', () => {
            this.saveMemo();
        });
        
        // モーダル外クリックで閉じる
        document.getElementById('memo-modal').addEventListener('click', (e) => {
            if (e.target.id === 'memo-modal') {
                this.hideModal();
            }
        });
        
        // Enterキーで保存
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.saveMemo();
            }
        });
    }
}

// アプリケーションの開始
let memoApp;
document.addEventListener('DOMContentLoaded', () => {
    memoApp = new MemoApp();
});