class PomodoroTimer {
    constructor() {
        this.modes = {
            pomodoro: { duration: 25, label: '作業時間', color: '#ef4444' },
            short: { duration: 5, label: '短い休憩', color: '#10b981' },
            long: { duration: 15, label: '長い休憩', color: '#3b82f6' }
        };

        this.currentMode = 'pomodoro';
        this.timeLeft = this.modes.pomodoro.duration * 60;
        this.isRunning = false;
        this.timer = null;
        this.pomodoroCount = 0;
        this.sessionCount = 0;

        this.stats = JSON.parse(localStorage.getItem('pomodoro_stats') || '{"total": 0, "focusTime": 0, "history": []}');
        this.settings = JSON.parse(localStorage.getItem('pomodoro_settings') || '{"autoStart": false, "sound": true, "notification": true}');

        this.init();
    }

    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.updateDisplay();
        this.updateStats();
        this.renderHistory();
        this.requestNotificationPermission();
    }

    setupEventListeners() {
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchMode(e.target.dataset.mode);
            });
        });

        document.getElementById('startBtn').addEventListener('click', () => {
            this.start();
        });

        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.pause();
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.reset();
        });

        ['pomodoroTime', 'shortBreakTime', 'longBreakTime'].forEach(id => {
            document.getElementById(id).addEventListener('change', (e) => {
                this.updateModeDuration(id, parseInt(e.target.value));
            });
        });

        ['autoStart', 'soundEnabled', 'notificationEnabled'].forEach(id => {
            document.getElementById(id).addEventListener('change', (e) => {
                this.settings[id.replace('Enabled', '')] = e.target.checked;
                this.saveSettings();
            });
        });

        document.getElementById('clearHistory').addEventListener('click', () => {
            this.clearHistory();
        });
    }

    loadSettings() {
        document.getElementById('pomodoroTime').value = this.modes.pomodoro.duration;
        document.getElementById('shortBreakTime').value = this.modes.short.duration;
        document.getElementById('longBreakTime').value = this.modes.long.duration;
        document.getElementById('autoStart').checked = this.settings.autoStart;
        document.getElementById('soundEnabled').checked = this.settings.sound;
        document.getElementById('notificationEnabled').checked = this.settings.notification;
    }

    updateModeDuration(id, value) {
        const modeMap = {
            'pomodoroTime': 'pomodoro',
            'shortBreakTime': 'short',
            'longBreakTime': 'long'
        };

        const mode = modeMap[id];
        this.modes[mode].duration = value;

        if (this.currentMode === mode && !this.isRunning) {
            this.timeLeft = value * 60;
            this.updateDisplay();
        }
    }

    switchMode(mode) {
        if (this.isRunning) {
            this.pause();
        }

        this.currentMode = mode;
        this.timeLeft = this.modes[mode].duration * 60;

        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        const circle = document.getElementById('progressCircle');
        circle.style.stroke = this.modes[mode].color;

        this.updateDisplay();
    }

    start() {
        this.isRunning = true;
        document.getElementById('startBtn').style.display = 'none';
        document.getElementById('pauseBtn').style.display = 'inline-block';

        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();

            if (this.timeLeft <= 0) {
                this.complete();
            }
        }, 1000);
    }

    pause() {
        this.isRunning = false;
        clearInterval(this.timer);
        document.getElementById('startBtn').style.display = 'inline-block';
        document.getElementById('pauseBtn').style.display = 'none';
    }

    reset() {
        this.pause();
        this.timeLeft = this.modes[this.currentMode].duration * 60;
        this.updateDisplay();
    }

    complete() {
        this.pause();

        if (this.currentMode === 'pomodoro') {
            this.pomodoroCount++;
            this.sessionCount++;
            this.stats.total++;
            this.stats.focusTime += this.modes.pomodoro.duration;
            this.addToHistory();
            this.saveStats();
            this.updateStats();

            this.showNotification('ポモドーロ完了！', '休憩時間です 🎉');

            if (this.pomodoroCount % 4 === 0) {
                this.switchMode('long');
            } else {
                this.switchMode('short');
            }
        } else {
            this.showNotification('休憩終了！', '作業を再開しましょう 💪');
            this.switchMode('pomodoro');
        }

        if (this.settings.sound) {
            this.playSound();
        }

        if (this.settings.autoStart) {
            setTimeout(() => this.start(), 1000);
        }

        this.updatePomodoroCounter();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        document.getElementById('timeDisplay').textContent = display;
        document.getElementById('sessionInfo').textContent = this.modes[this.currentMode].label;

        const totalTime = this.modes[this.currentMode].duration * 60;
        const progress = ((totalTime - this.timeLeft) / totalTime) * 848.23;
        document.getElementById('progressCircle').style.strokeDashoffset = 848.23 - progress;

        document.title = `${display} - ${this.modes[this.currentMode].label}`;
    }

    updatePomodoroCounter() {
        const completed = this.sessionCount % 4;
        let icons = '';
        for (let i = 0; i < 4; i++) {
            icons += i < completed ? '🍅' : '⚪';
        }
        document.getElementById('tomatoIcons').textContent = icons;
        document.getElementById('pomodoroCount').textContent = `${completed} / 4`;
    }

    updateStats() {
        document.getElementById('totalPomodoros').textContent = this.stats.total;
        document.getElementById('totalFocusTime').textContent = `${this.stats.focusTime}分`;

        const today = new Date().toDateString();
        const todayPomodoros = this.stats.history.filter(h =>
            new Date(h.date).toDateString() === today
        ).reduce((sum, h) => sum + h.count, 0);

        document.getElementById('todayPomodoros').textContent = todayPomodoros;
        document.getElementById('streak').textContent = `${this.calculateStreak()}日`;
    }

    calculateStreak() {
        if (this.stats.history.length === 0) return 0;

        const sortedHistory = [...this.stats.history].sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        );

        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        for (const entry of sortedHistory) {
            const entryDate = new Date(entry.date);
            entryDate.setHours(0, 0, 0, 0);

            if (entryDate.getTime() === currentDate.getTime()) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else if (entryDate.getTime() < currentDate.getTime()) {
                break;
            }
        }

        return streak;
    }

    addToHistory() {
        const today = new Date().toDateString();
        const existing = this.stats.history.find(h => h.date === today);

        if (existing) {
            existing.count++;
        } else {
            this.stats.history.push({
                date: today,
                count: 1
            });
        }

        this.renderHistory();
    }

    renderHistory() {
        const historyList = document.getElementById('historyList');

        if (this.stats.history.length === 0) {
            historyList.innerHTML = '<p class="empty-state">履歴がありません</p>';
            return;
        }

        const sortedHistory = [...this.stats.history].sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        ).slice(0, 10);

        historyList.innerHTML = sortedHistory.map(item => {
            const date = new Date(item.date);
            const dateStr = date.toLocaleDateString('ja-JP', {
                month: 'short',
                day: 'numeric',
                weekday: 'short'
            });

            return `
                <div class="history-item">
                    <span class="history-date">${dateStr}</span>
                    <span class="history-count">🍅 × ${item.count}</span>
                </div>
            `;
        }).join('');
    }

    clearHistory() {
        if (confirm('履歴をすべて削除しますか？')) {
            this.stats = { total: 0, focusTime: 0, history: [] };
            this.sessionCount = 0;
            this.pomodoroCount = 0;
            this.saveStats();
            this.updateStats();
            this.renderHistory();
            this.updatePomodoroCounter();
            this.showNotification('履歴を削除しました', 'success');
        }
    }

    saveStats() {
        localStorage.setItem('pomodoro_stats', JSON.stringify(this.stats));
    }

    saveSettings() {
        localStorage.setItem('pomodoro_settings', JSON.stringify(this.settings));
    }

    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    showNotification(title, body) {
        if (this.settings.notification && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: body,
                icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ctext y="0.9em" font-size="90"%3E🍅%3C/text%3E%3C/svg%3E',
                badge: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ctext y="0.9em" font-size="90"%3E🍅%3C/text%3E%3C/svg%3E'
            });
        } else {
            this.showToast(title + ': ' + body);
        }
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: #ef4444;
            color: white;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        if (!document.getElementById('toast-styles')) {
            style.id = 'toast-styles';
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    playSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {
        console.log('Service Worker registration failed');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
});
