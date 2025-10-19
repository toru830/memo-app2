// メモアプリの基本機能
class SimpleMemoApp {
    constructor() {
        this.memos = [];
        this.init();
    }

    // 初期化
    init() {
        this.loadMemos();
        this.bindEvents();
        this.renderMemos();
    }

    // イベントのバインド
    bindEvents() {
        const addButton = document.getElementById('addButton');
        const memoInput = document.getElementById('memoInput');

        // 追加ボタンのクリックイベント
        addButton.addEventListener('click', () => {
            this.addMemo();
        });

        // Enterキーでの追加
        memoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addMemo();
            }
        });
    }

    // メモを追加
    addMemo() {
        const memoInput = document.getElementById('memoInput');
        const text = memoInput.value.trim();

        // 空のメモは追加しない
        if (!text) {
            alert('メモを入力してください。');
            return;
        }

        // メモオブジェクトを作成
        const memo = {
            id: Date.now(),
            text: text,
            createdAt: new Date().toISOString()
        };

        // メモを配列に追加
        this.memos.push(memo);

        // ローカルストレージに保存
        this.saveMemos();

        // 入力フィールドをクリア
        memoInput.value = '';

        // 画面を更新
        this.renderMemos();
    }

    // メモを削除
    deleteMemo(id) {
        if (confirm('このメモを削除しますか？')) {
            this.memos = this.memos.filter(memo => memo.id !== id);
            this.saveMemos();
            this.renderMemos();
        }
    }

    // メモを編集
    editMemo(id) {
        const memo = this.memos.find(m => m.id === id);
        if (!memo) return;

        const newText = prompt('メモを編集してください:', memo.text);
        if (newText !== null && newText.trim() !== '') {
            memo.text = newText.trim();
            memo.updatedAt = new Date().toISOString();
            this.saveMemos();
            this.renderMemos();
        }
    }

    // ローカルストレージからメモを読み込み
    loadMemos() {
        try {
            const saved = localStorage.getItem('simpleMemos');
            if (saved) {
                this.memos = JSON.parse(saved);
            }
        } catch (error) {
            console.error('メモの読み込みに失敗しました:', error);
            this.memos = [];
        }
    }

    // ローカルストレージにメモを保存
    saveMemos() {
        try {
            localStorage.setItem('simpleMemos', JSON.stringify(this.memos));
        } catch (error) {
            console.error('メモの保存に失敗しました:', error);
        }
    }

    // メモ一覧を表示
    renderMemos() {
        const memoList = document.getElementById('memoList');
        
        if (this.memos.length === 0) {
            memoList.innerHTML = '<div class="empty-state">まだメモがありません。<br>上の入力欄からメモを追加してください。</div>';
            return;
        }

        // メモを新しい順にソート
        const sortedMemos = [...this.memos].sort((a, b) => {
            const dateA = new Date(a.updatedAt || a.createdAt);
            const dateB = new Date(b.updatedAt || b.createdAt);
            return dateB - dateA;
        });

        memoList.innerHTML = sortedMemos.map(memo => `
            <div class="memo-item">
                <div class="memo-text">${this.escapeHtml(memo.text)}</div>
                <div class="memo-actions">
                    <button class="edit-btn" onclick="app.editMemo(${memo.id})">編集</button>
                    <button class="delete-btn" onclick="app.deleteMemo(${memo.id})">削除</button>
                </div>
            </div>
        `).join('');
    }

    // HTMLエスケープ（セキュリティ対策）
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// アプリケーションを開始
const app = new SimpleMemoApp();