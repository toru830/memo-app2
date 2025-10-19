// メモアプリ v3.0 - Firebase除外版
class MemoApp {
    constructor() {
        this.memos = [];
        this.currentTab = 'all';
        this.editingMemo = null;
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
        // 検索機能
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            this.filterMemos(e.target.value);
        });

        // クイック作成ボタン
        const quickCreateBtns = document.querySelectorAll('.quick-create-btn');
        quickCreateBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.openMemoModal(null, category);
            });
        });

        // フローティングアクションボタン
        const addMemoBtn = document.getElementById('addMemoBtn');
        addMemoBtn.addEventListener('click', () => {
            this.openMemoModal();
        });

        // 下部ナビゲーション
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });

        // モーダル関連
        const modal = document.getElementById('memoModal');
        const modalClose = document.getElementById('modalClose');
        const modalCancel = document.getElementById('modalCancel');
        const modalSave = document.getElementById('modalSave');

        modalClose.addEventListener('click', () => this.closeMemoModal());
        modalCancel.addEventListener('click', () => this.closeMemoModal());
        modalSave.addEventListener('click', () => this.saveMemo());

        // モーダル外クリックで閉じる
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeMemoModal();
            }
        });
    }

    // タブ切り替え
    switchTab(tab) {
        this.currentTab = tab;
        
        // ナビゲーションの状態更新
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        // メモ一覧を再描画
        this.renderMemos();
    }

    // メモのフィルタリング
    filterMemos(searchTerm) {
        const filteredMemos = this.getFilteredMemos(searchTerm);
        this.renderMemoList(filteredMemos);
    }

    // フィルタリングされたメモを取得
    getFilteredMemos(searchTerm = '') {
        let filtered = [...this.memos];

        // タブによるフィルタリング
        switch (this.currentTab) {
            case 'tasks':
                filtered = filtered.filter(memo => memo.isTask);
                break;
            case 'shopping':
                filtered = filtered.filter(memo => memo.category === '買い物');
                break;
            case 'work':
                filtered = filtered.filter(memo => memo.category === '仕事');
                break;
            case 'ideas':
                filtered = filtered.filter(memo => memo.category === 'アイデア');
                break;
            case 'thoughts':
                filtered = filtered.filter(memo => memo.category === '思い');
                break;
        }

        // 検索によるフィルタリング
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(memo => 
                memo.title.toLowerCase().includes(term) ||
                memo.content.toLowerCase().includes(term) ||
                memo.tags.some(tag => tag.toLowerCase().includes(term))
            );
        }

        // 作成日時でソート（新しい順）
        return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // メモ一覧の描画
    renderMemos() {
        const searchTerm = document.getElementById('searchInput').value;
        const filteredMemos = this.getFilteredMemos(searchTerm);
        this.renderMemoList(filteredMemos);
    }

    // メモ一覧のHTML生成
    renderMemoList(memos) {
        const memoList = document.getElementById('memoList');
        
        if (memos.length === 0) {
            memoList.innerHTML = `
                <div class="empty-state">
                    <h3>メモがありません</h3>
                    <p>新しいメモを作成してください</p>
                </div>
            `;
            return;
        }

        memoList.innerHTML = memos.map(memo => this.createMemoHTML(memo)).join('');
    }

    // メモのHTML生成
    createMemoHTML(memo) {
        const createdAt = new Date(memo.createdAt).toLocaleDateString('ja-JP');
        const priorityClass = memo.priority || 'medium';
        const priorityText = {
            high: '高',
            medium: '中',
            low: '低'
        }[priorityClass];

        return `
            <div class="memo-item" data-id="${memo.id}">
                <div class="memo-header">
                    <div class="memo-title">${this.escapeHtml(memo.title)}</div>
                    <div class="memo-priority ${priorityClass}">☆${priorityText}</div>
                </div>
                ${memo.content ? `<div class="memo-content">${this.escapeHtml(memo.content)}</div>` : ''}
                <div class="memo-meta">
                    <div class="memo-tags">
                        ${memo.isTask ? '<span class="memo-task-badge">タスク</span>' : ''}
                        ${memo.tags.map(tag => `<span class="memo-tag">${this.escapeHtml(tag)}</span>`).join('')}
                    </div>
                    <div class="memo-date">${createdAt}</div>
                </div>
                <div class="memo-actions">
                    <button class="memo-action-btn" onclick="app.editMemo(${memo.id})" title="編集">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                    </button>
                    <button class="memo-action-btn" onclick="app.deleteMemo(${memo.id})" title="削除">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }

    // メモモーダルを開く
    openMemoModal(memo = null, category = null) {
        this.editingMemo = memo;
        const modal = document.getElementById('memoModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('memoForm');

        if (memo) {
            modalTitle.textContent = 'メモを編集';
            document.getElementById('memoTitle').value = memo.title;
            document.getElementById('memoContent').value = memo.content || '';
            document.getElementById('memoCategory').value = memo.category;
            document.getElementById('memoTags').value = memo.tags.join(', ');
            document.getElementById('memoIsTask').checked = memo.isTask || false;
            document.getElementById('memoPriority').value = memo.priority || 'medium';
        } else {
            modalTitle.textContent = 'メモを作成';
            form.reset();
            if (category) {
                document.getElementById('memoCategory').value = category;
            }
        }

        modal.classList.add('show');
        document.getElementById('memoTitle').focus();
    }

    // メモモーダルを閉じる
    closeMemoModal() {
        const modal = document.getElementById('memoModal');
        modal.classList.remove('show');
        this.editingMemo = null;
    }

    // メモを保存
    saveMemo() {
        const title = document.getElementById('memoTitle').value.trim();
        const content = document.getElementById('memoContent').value.trim();
        const category = document.getElementById('memoCategory').value;
        const tags = document.getElementById('memoTags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
        const isTask = document.getElementById('memoIsTask').checked;
        const priority = document.getElementById('memoPriority').value;

        if (!title) {
            alert('タイトルを入力してください。');
            return;
        }

        const memoData = {
            title,
            content,
            category,
            tags,
            isTask,
            priority,
            updatedAt: new Date().toISOString()
        };

        if (this.editingMemo) {
            // 編集
            const index = this.memos.findIndex(m => m.id === this.editingMemo.id);
            if (index !== -1) {
                this.memos[index] = { ...this.memos[index], ...memoData };
            }
        } else {
            // 新規作成
            const newMemo = {
                id: Date.now(),
                ...memoData,
                createdAt: new Date().toISOString()
            };
            this.memos.push(newMemo);
        }

        this.saveMemos();
        this.closeMemoModal();
        this.renderMemos();
    }

    // メモを編集
    editMemo(id) {
        const memo = this.memos.find(m => m.id === id);
        if (memo) {
            this.openMemoModal(memo);
        }
    }

    // メモを削除
    deleteMemo(id) {
        if (confirm('このメモを削除しますか？')) {
            this.memos = this.memos.filter(m => m.id !== id);
            this.saveMemos();
            this.renderMemos();
        }
    }

    // ローカルストレージからメモを読み込み
    loadMemos() {
        try {
            const saved = localStorage.getItem('memoAppMemos');
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
            localStorage.setItem('memoAppMemos', JSON.stringify(this.memos));
        } catch (error) {
            console.error('メモの保存に失敗しました:', error);
        }
    }

    // HTMLエスケープ（セキュリティ対策）
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// アプリケーションを開始
const app = new MemoApp();

// デバッグ用（開発時のみ）
if (typeof window !== 'undefined') {
    window.app = app;
    console.log('メモアプリ v3.0 が起動しました');
}