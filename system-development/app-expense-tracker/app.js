// データベース名
const DB_NAME = 'ExpenseTrackerDB';
const DB_VERSION = 1;
const STORE_NAME = 'expenses';

let db;
let expenses = [];
let categoryChart;

// データベース初期化
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                objectStore.createIndex('date', 'date', { unique: false });
                objectStore.createIndex('category', 'category', { unique: false });
            }
        };
    });
}

// 支出を追加
function addExpense(expense) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.add(expense);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// 全支出を取得
function getAllExpenses() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// 支出を削除
function deleteExpense(id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// 全データ削除
function clearAllData() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// タブ切り替え
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;

        // タブボタンのアクティブ切り替え
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // タブコンテンツの切り替え
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(targetTab).classList.add('active');

        // 統計タブの場合はグラフを更新
        if (targetTab === 'stats') {
            updateStats();
        }
    });
});

// フォーム送信
document.getElementById('expense-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const amount = parseInt(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    const memo = document.getElementById('memo').value;

    const expense = {
        amount,
        category,
        date,
        memo,
        timestamp: new Date().getTime()
    };

    try {
        await addExpense(expense);
        alert('支出を追加しました');
        e.target.reset();
        // 今日の日付をデフォルトに設定
        document.getElementById('date').valueAsDate = new Date();
        loadExpenses();
    } catch (error) {
        alert('エラーが発生しました: ' + error.message);
    }
});

// 支出一覧を読み込み
async function loadExpenses() {
    try {
        expenses = await getAllExpenses();
        renderExpenseList();
    } catch (error) {
        console.error('データ読み込みエラー:', error);
    }
}

// 支出一覧を表示
function renderExpenseList(filterCategory = '') {
    const listElement = document.getElementById('expense-list');
    const filteredExpenses = filterCategory
        ? expenses.filter(e => e.category === filterCategory)
        : expenses;

    // 日付でソート（新しい順）
    filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filteredExpenses.length === 0) {
        listElement.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">まだ支出が記録されていません</p>';
        document.getElementById('total-amount').textContent = '¥0';
        return;
    }

    listElement.innerHTML = filteredExpenses.map(expense => `
        <div class="expense-item">
            <div class="expense-info">
                <div>
                    <span class="expense-category">${expense.category}</span>
                    <span class="expense-date">${expense.date}</span>
                </div>
                ${expense.memo ? `<div class="expense-memo">${expense.memo}</div>` : ''}
            </div>
            <span class="expense-amount">¥${expense.amount.toLocaleString()}</span>
            <div class="expense-actions">
                <button class="delete-btn" onclick="deleteExpenseItem(${expense.id})">削除</button>
            </div>
        </div>
    `).join('');

    // 合計金額
    const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    document.getElementById('total-amount').textContent = `¥${total.toLocaleString()}`;
}

// 支出削除
async function deleteExpenseItem(id) {
    if (!confirm('この支出を削除しますか？')) return;

    try {
        await deleteExpense(id);
        loadExpenses();
    } catch (error) {
        alert('削除に失敗しました: ' + error.message);
    }
}

// カテゴリフィルタ
document.getElementById('filter-category').addEventListener('change', (e) => {
    renderExpenseList(e.target.value);
});

// 統計更新
async function updateStats() {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // 今月の支出をフィルタ
    const monthlyExpenses = expenses.filter(e => e.date.startsWith(currentMonth));

    // 統計計算
    const monthlyTotal = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const dailyAverage = monthlyTotal / daysInMonth;
    const maxExpense = monthlyExpenses.length > 0 ? Math.max(...monthlyExpenses.map(e => e.amount)) : 0;

    // 表示更新
    document.getElementById('monthly-total').textContent = `¥${monthlyTotal.toLocaleString()}`;
    document.getElementById('daily-average').textContent = `¥${Math.round(dailyAverage).toLocaleString()}`;
    document.getElementById('max-expense').textContent = `¥${maxExpense.toLocaleString()}`;
    document.getElementById('expense-count').textContent = `${monthlyExpenses.length}件`;

    // カテゴリ別集計
    const categoryData = {};
    monthlyExpenses.forEach(expense => {
        categoryData[expense.category] = (categoryData[expense.category] || 0) + expense.amount;
    });

    // グラフ更新
    updateCategoryChart(categoryData);
}

// カテゴリ別円グラフ
function updateCategoryChart(categoryData) {
    const ctx = document.getElementById('category-chart');

    // 既存のグラフを破棄
    if (categoryChart) {
        categoryChart.destroy();
    }

    const labels = Object.keys(categoryData);
    const data = Object.values(categoryData);

    if (labels.length === 0) {
        ctx.getContext('2d').clearRect(0, 0, ctx.width, ctx.height);
        return;
    }

    categoryChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#4f46e5', '#10b981', '#f59e0b', '#ef4444',
                    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
                    '#f97316', '#6366f1'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'カテゴリ別支出'
                }
            }
        }
    });
}

// CSVエクスポート
document.getElementById('export-csv').addEventListener('click', () => {
    if (expenses.length === 0) {
        alert('エクスポートするデータがありません');
        return;
    }

    let csv = '日付,カテゴリ,金額,メモ\n';
    expenses.forEach(expense => {
        csv += `${expense.date},${expense.category},${expense.amount},"${expense.memo || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
});

// JSONエクスポート
document.getElementById('export-json').addEventListener('click', () => {
    if (expenses.length === 0) {
        alert('エクスポートするデータがありません');
        return;
    }

    const json = JSON.stringify(expenses, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expenses_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
});

// JSONインポート
document.getElementById('import-json').addEventListener('click', () => {
    document.getElementById('import-file').click();
});

document.getElementById('import-file').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
        try {
            const importedData = JSON.parse(event.target.result);

            if (!Array.isArray(importedData)) {
                alert('無効なデータ形式です');
                return;
            }

            for (const expense of importedData) {
                // idを除外して追加
                const { id, ...expenseData } = expense;
                await addExpense(expenseData);
            }

            alert(`${importedData.length}件のデータをインポートしました`);
            loadExpenses();
        } catch (error) {
            alert('インポートに失敗しました: ' + error.message);
        }
    };
    reader.readAsText(file);
});

// 全データ削除
document.getElementById('clear-data').addEventListener('click', async () => {
    if (!confirm('すべてのデータを削除しますか？この操作は取り消せません。')) return;
    if (!confirm('本当に削除しますか？')) return;

    try {
        await clearAllData();
        expenses = [];
        alert('すべてのデータを削除しました');
        loadExpenses();
    } catch (error) {
        alert('削除に失敗しました: ' + error.message);
    }
});

// 初期化
async function init() {
    try {
        await initDB();
        await loadExpenses();

        // 今日の日付をデフォルトに設定
        document.getElementById('date').valueAsDate = new Date();
    } catch (error) {
        console.error('初期化エラー:', error);
        alert('アプリの初期化に失敗しました。ブラウザがIndexedDBをサポートしているか確認してください。');
    }
}

// アプリ起動
init();
