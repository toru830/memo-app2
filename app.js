// 習慣トラッカーアプリケーション
class HabitTracker {
    constructor() {
        this.habits = [
            { name: '早寝早起', id: 'early_bed' },
            { name: 'ジャーナル', id: 'journal' },
            { name: '勉強', id: 'study' },
            { name: '筋トレ', id: 'exercise' },
            { name: '読書', id: 'reading' },
            { name: 'To Do List', id: 'todo' },
            { name: 'No寝スマホ', id: 'no_phone' },
            { name: 'No酒', id: 'no_alcohol' },
            { name: 'No暴食', id: 'no_overeating' },
            { name: 'プロテイン', id: 'protein' },
            { name: '整腸剤', id: 'probiotics' },
            { name: 'ビタミンD', id: 'vitamin_d' },
            { name: 'クレアチン', id: 'creatine' },
            { name: 'ガンダ・マグ', id: 'ganda_mag' },
            { name: 'ベリー', id: 'berry' }
        ];
        
        this.currentDate = new Date();
        this.data = this.loadData();
        
        this.init();
    }
    
    // 初期化
    init() {
        this.renderCalendar();
        this.setupEventListeners();
        this.updateTodayHighlight();
    }
    
    // データの読み込み
    loadData() {
        const saved = localStorage.getItem('habit-tracker-data');
        return saved ? JSON.parse(saved) : {};
    }
    
    // データの保存
    saveData() {
        localStorage.setItem('habit-tracker-data', JSON.stringify(this.data));
    }
    
    // カレンダーの描画
    renderCalendar() {
        const calendarBody = document.getElementById('calendar-body');
        calendarBody.innerHTML = '';
        
        // 現在の週の日付を取得
        const weekDates = this.getWeekDates();
        
        this.habits.forEach(habit => {
            const row = document.createElement('div');
            row.className = 'habit-row';
            
            // 習慣名
            const nameCell = document.createElement('div');
            nameCell.className = 'habit-name';
            nameCell.textContent = habit.name;
            row.appendChild(nameCell);
            
            // 各日のチェックボックス
            weekDates.forEach(date => {
                const dayCell = document.createElement('div');
                dayCell.className = 'day-cell';
                
                // 今日の日付をハイライト
                if (this.isToday(date)) {
                    dayCell.classList.add('today');
                }
                
                // チェック状態を確認
                const dateKey = this.formatDate(date);
                const isChecked = this.data[habit.id] && this.data[habit.id][dateKey];
                
                if (isChecked) {
                    dayCell.classList.add('checked');
                }
                
                // クリックイベント
                dayCell.addEventListener('click', () => {
                    this.toggleHabit(habit.id, dateKey);
                    this.renderCalendar(); // 再描画
                });
                
                row.appendChild(dayCell);
            });
            
            // 週計
            const weekCount = this.getWeekCount(habit.id, weekDates);
            const weekCell = document.createElement('div');
            weekCell.className = 'summary-cell';
            weekCell.textContent = weekCount;
            row.appendChild(weekCell);
            
            // 合計
            const totalCount = this.getTotalCount(habit.id);
            const totalCell = document.createElement('div');
            totalCell.className = 'summary-cell';
            totalCell.textContent = totalCount;
            row.appendChild(totalCell);
            
            calendarBody.appendChild(row);
        });
    }
    
    // 現在の週の日付を取得
    getWeekDates() {
        const dates = [];
        const today = new Date(this.currentDate);
        const dayOfWeek = today.getDay();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek + 1); // 月曜日から開始
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            dates.push(date);
        }
        
        return dates;
    }
    
    // 日付が今日かどうか
    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }
    
    // 日付を文字列にフォーマット
    formatDate(date) {
        return date.toISOString().split('T')[0];
    }
    
    // 習慣の切り替え
    toggleHabit(habitId, dateKey) {
        if (!this.data[habitId]) {
            this.data[habitId] = {};
        }
        
        if (this.data[habitId][dateKey]) {
            delete this.data[habitId][dateKey];
        } else {
            this.data[habitId][dateKey] = true;
        }
        
        this.saveData();
    }
    
    // 週のカウント
    getWeekCount(habitId, weekDates) {
        if (!this.data[habitId]) return 0;
        
        return weekDates.filter(date => {
            const dateKey = this.formatDate(date);
            return this.data[habitId][dateKey];
        }).length;
    }
    
    // 合計カウント
    getTotalCount(habitId) {
        if (!this.data[habitId]) return 0;
        
        return Object.keys(this.data[habitId]).length;
    }
    
    // イベントリスナーの設定
    setupEventListeners() {
        // 今日ボタン
        const todayBtn = document.getElementById('today-btn');
        todayBtn.addEventListener('click', () => {
            this.currentDate = new Date();
            this.updateTodayHighlight();
            this.renderCalendar();
        });
        
        // ナビゲーションアイコン
        const navIcons = document.querySelectorAll('.nav-icon');
        navIcons.forEach((icon, index) => {
            icon.addEventListener('click', () => {
                navIcons.forEach(i => i.classList.remove('active'));
                icon.classList.add('active');
            });
        });
    }
    
    // 今日のハイライト更新
    updateTodayHighlight() {
        const today = new Date();
        const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', 
                           '7月', '8月', '9月', '10月', '11月', '12月'];
        const monthElement = document.getElementById('current-month');
        monthElement.textContent = `${today.getFullYear()}年${monthNames[today.getMonth()]}`;
    }
}

// アプリケーションの開始
document.addEventListener('DOMContentLoaded', () => {
    new HabitTracker();
});
