let csvData = [];
let filteredData = [];
let headers = [];

// ファイル入力
const fileInput = document.getElementById('file-input');
const uploadArea = document.getElementById('upload-area');

// ドラッグ&ドロップ
uploadArea.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});
uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});
uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
});

// ファイル処理
function handleFile(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
        const text = e.target.result;
        parseCSV(text);
    };

    reader.readAsText(file, 'UTF-8');
}

// CSV パース
function parseCSV(text) {
    Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            csvData = results.data;
            filteredData = [...csvData];
            headers = results.meta.fields;

            renderTable();
            setupFilters();
            showSections();
        },
        error: (error) => {
            alert('CSVの読み込みに失敗しました: ' + error.message);
        }
    });
}

// テーブル表示
function renderTable(data = filteredData) {
    const thead = document.getElementById('table-head');
    const tbody = document.getElementById('table-body');

    // ヘッダー
    thead.innerHTML = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;

    // データ（最大1000行）
    const displayData = data.slice(0, 1000);
    tbody.innerHTML = displayData.map(row =>
        `<tr>${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}</tr>`
    ).join('');

    // 統計更新
    document.getElementById('row-count').textContent = data.length;
    document.getElementById('col-count').textContent = headers.length;
}

// セクション表示
function showSections() {
    document.getElementById('preview-section').style.display = 'block';
    document.getElementById('tools-section').style.display = 'block';
    document.getElementById('export-section').style.display = 'block';
}

// フィルタ設定
function setupFilters() {
    const filterColumn = document.getElementById('filter-column');
    const aggregateColumn = document.getElementById('aggregate-column');

    // 列をセレクトボックスに追加
    const options = headers.map(h => `<option value="${h}">${h}</option>`).join('');
    filterColumn.innerHTML = '<option value="">選択してください</option>' + options;
    aggregateColumn.innerHTML = '<option value="">選択してください</option>' + options;
}

// フィルタ適用
document.getElementById('apply-filter').addEventListener('click', () => {
    const column = document.getElementById('filter-column').value;
    const operator = document.getElementById('filter-operator').value;
    const value = document.getElementById('filter-value').value;

    if (!column || !value) {
        alert('列と値を入力してください');
        return;
    }

    filteredData = csvData.filter(row => {
        const cellValue = row[column];
        const numValue = parseFloat(cellValue);
        const searchValue = parseFloat(value);

        switch (operator) {
            case 'contains':
                return cellValue && cellValue.toString().includes(value);
            case 'equals':
                return cellValue === value;
            case 'gt':
                return !isNaN(numValue) && !isNaN(searchValue) && numValue > searchValue;
            case 'lt':
                return !isNaN(numValue) && !isNaN(searchValue) && numValue < searchValue;
            default:
                return true;
        }
    });

    renderTable(filteredData);
});

// フィルタクリア
document.getElementById('clear-filter').addEventListener('click', () => {
    filteredData = [...csvData];
    renderTable();
    document.getElementById('filter-value').value = '';
});

// 集計計算
document.getElementById('calculate-stats').addEventListener('click', () => {
    const column = document.getElementById('aggregate-column').value;

    if (!column) {
        alert('列を選択してください');
        return;
    }

    const values = filteredData
        .map(row => parseFloat(row[column]))
        .filter(v => !isNaN(v));

    if (values.length === 0) {
        alert('数値データがありません');
        return;
    }

    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const count = values.length;

    document.getElementById('stats-result').innerHTML = `
        <div><span>合計:</span> <strong>${sum.toLocaleString()}</strong></div>
        <div><span>平均:</span> <strong>${avg.toFixed(2)}</strong></div>
        <div><span>最大:</span> <strong>${max.toLocaleString()}</strong></div>
        <div><span>最小:</span> <strong>${min.toLocaleString()}</strong></div>
        <div><span>データ数:</span> <strong>${count}</strong></div>
    `;
});

// CSV エクスポート
document.getElementById('export-csv').addEventListener('click', () => {
    const csv = Papa.unparse(filteredData);
    downloadFile(csv, 'data.csv', 'text/csv');
});

// JSON エクスポート
document.getElementById('export-json').addEventListener('click', () => {
    const json = JSON.stringify(filteredData, null, 2);
    downloadFile(json, 'data.json', 'application/json');
});

// TSV エクスポート
document.getElementById('export-tsv').addEventListener('click', () => {
    const tsv = Papa.unparse(filteredData, { delimiter: '\t' });
    downloadFile(tsv, 'data.tsv', 'text/tab-separated-values');
});

// ファイルダウンロード
function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type: type + ';charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}
