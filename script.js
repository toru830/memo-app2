// シンプルメモアプリ
class SimpleMemoApp {
    constructor() {
        this.memos = this.loadMemos();
        this.init();
    }
    
    // 初期化
    init() {
        this.renderMemos();
        this.setupEventListeners();
    }
    
    // メモの読み込み
    loadMemos() {
        try {
            const saved = localStorage.getItem('simple-memos');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('メモの読み込みエラー:', error);
            return [];
        }
    }
    
    // メモの保存
    saveMemos() {
        try {
            localStorage.setItem('simple-memos', JSON.stringify(this.memos));
        } catch (error) {
            console.error('メモの保存エラー:', error);
            alert('メモの保存に失敗しました');
        }
    }
    
    // メモの表示
    renderMemos() {
        const container = document.getElementById('memos-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (this.memos.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">メモがありません</p>';
            return;
        }
        
        this.memos.forEach((memo, index) => {
            const memoDiv = document.createElement('div');
            memoDiv.className = 'memo-item';
            memoDiv.innerHTML = `
                <div class="memo-title">${this.escapeHtml(memo.title)}</div>
                <div class="memo-content">${this.escapeHtml(memo.content)}</div>
                <div class="memo-actions">
                    <button class="btn-edit" onclick="app.editMemo(${index})">編集</button>
                    <button class="btn-delete" onclick="app.deleteMemo(${index})">削除</button>
                </div>
            `;
            container.appendChild(memoDiv);
        });
    }
    
    // HTMLエスケープ
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // メモの保存
    saveMemo() {
        const titleInput = document.getElementById('memo-title');
        const contentInput = document.getElementById('memo-content');
        
        if (!titleInput || !contentInput) {
            alert('入力フィールドが見つかりません');
            return;
        }
        
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        
        if (!title || !content) {
            alert('タイトルと内容を入力してください');
            return;
        }
        
        const newMemo = {
            title: title,
            content: content,
            createdAt: new Date().toISOString()
        };
        
        this.memos.push(newMemo);
        this.saveMemos();
        this.renderMemos();
        
        // フォームをクリア
        titleInput.value = '';
        contentInput.value = '';
        
        alert('メモを保存しました');
    }
    
    // メモの編集
    editMemo(index) {
        const memo = this.memos[index];
        if (!memo) return;
        
        const titleInput = document.getElementById('memo-title');
        const contentInput = document.getElementById('memo-content');
        
        if (titleInput && contentInput) {
            titleInput.value = memo.title;
            contentInput.value = memo.content;
            titleInput.focus();
        }
        
        // 編集対象のメモを削除
        this.memos.splice(index, 1);
        this.saveMemos();
        this.renderMemos();
    }
    
    // メモの削除
    deleteMemo(index) {
        if (confirm('このメモを削除しますか？')) {
            this.memos.splice(index, 1);
            this.saveMemos();
            this.renderMemos();
        }
    }
    
    // イベントリスナーの設定
    setupEventListeners() {
        const saveBtn = document.getElementById('save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveMemo();
            });
        }
    }
}

// アプリケーションの開始
let app;
document.addEventListener('DOMContentLoaded', () => {
    try {
        app = new SimpleMemoApp();
        console.log('シンプルメモアプリが起動しました');
    } catch (error) {
        console.error('アプリの起動に失敗:', error);
        alert('アプリの起動に失敗しました');
    }
});

