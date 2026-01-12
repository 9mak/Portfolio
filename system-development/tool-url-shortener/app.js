const STORAGE_KEY = 'url-shortener-data';
let urls = loadData();

function loadData() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
}

function generateAlias() {
    return Math.random().toString(36).substring(2, 8);
}

document.getElementById('shorten-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const original = document.getElementById('original-url').value;
    const alias = document.getElementById('alias').value || generateAlias();
    const tagsInput = document.getElementById('tags').value;
    const memo = document.getElementById('memo').value;

    if (urls.find(u => u.alias === alias)) {
        alert('このエイリアスは既に使用されています');
        return;
    }

    const urlData = {
        alias,
        original,
        clicks: 0,
        tags: tagsInput.split(',').map(t => t.trim()).filter(t => t),
        memo,
        created: new Date().toISOString()
    };

    urls.push(urlData);
    saveData();

    const shortUrl = `${window.location.origin}/#${alias}`;
    showResult(shortUrl, alias);
    renderList();
    e.target.reset();
});

function showResult(shortUrl, alias) {
    document.getElementById('result-section').style.display = 'block';
    document.getElementById('short-url-display').value = shortUrl;

    const qrcodeDiv = document.getElementById('qrcode');
    qrcodeDiv.innerHTML = '';
    new QRCode(qrcodeDiv, {
        text: shortUrl,
        width: 200,
        height: 200
    });
}

document.getElementById('copy-btn').addEventListener('click', () => {
    const input = document.getElementById('short-url-display');
    input.select();
    document.execCommand('copy');
    alert('コピーしました！');
});

document.getElementById('download-qr').addEventListener('click', () => {
    const canvas = document.querySelector('#qrcode canvas');
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'qrcode.png';
    link.click();
});

function renderList() {
    const listDiv = document.getElementById('url-list');
    const search = document.getElementById('search').value.toLowerCase();
    const tagFilter = document.getElementById('tag-filter').value;

    let filtered = urls.filter(url => {
        const matchSearch = !search ||
            url.alias.toLowerCase().includes(search) ||
            url.original.toLowerCase().includes(search) ||
            url.memo.toLowerCase().includes(search);
        const matchTag = !tagFilter || url.tags.includes(tagFilter);
        return matchSearch && matchTag;
    });

    filtered.sort((a, b) => new Date(b.created) - new Date(a.created));

    if (filtered.length === 0) {
        listDiv.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">URLがありません</p>';
        return;
    }

    listDiv.innerHTML = filtered.map((url, index) => `
        <div class="url-item">
            <h3>${window.location.origin}/#${url.alias}</h3>
            <p><strong>元URL:</strong> ${url.original}</p>
            <p><strong>クリック数:</strong> ${url.clicks}</p>
            ${url.memo ? `<p><strong>メモ:</strong> ${url.memo}</p>` : ''}
            ${url.tags.length > 0 ? `<div class="tags">${url.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
            <p style="font-size: 0.85rem; color: var(--text-secondary);">作成日: ${new Date(url.created).toLocaleString()}</p>
            <div class="url-actions">
                <button class="btn btn-secondary" onclick="openUrl('${url.original}', '${url.alias}')">開く</button>
                <button class="btn btn-danger" onclick="deleteUrl('${url.alias}')">削除</button>
            </div>
        </div>
    `).join('');

    updateTagFilter();
}

function openUrl(original, alias) {
    const url = urls.find(u => u.alias === alias);
    if (url) {
        url.clicks++;
        saveData();
        renderList();
    }
    window.open(original, '_blank');
}

function deleteUrl(alias) {
    if (!confirm('この短縮URLを削除しますか？')) return;
    urls = urls.filter(u => u.alias !== alias);
    saveData();
    renderList();
}

function updateTagFilter() {
    const allTags = [...new Set(urls.flatMap(u => u.tags))];
    const select = document.getElementById('tag-filter');
    const currentValue = select.value;
    select.innerHTML = '<option value="">全タグ</option>' +
        allTags.map(tag => `<option value="${tag}">${tag}</option>`).join('');
    select.value = currentValue;
}

document.getElementById('search').addEventListener('input', renderList);
document.getElementById('tag-filter').addEventListener('change', renderList);

document.getElementById('export-json').addEventListener('click', () => {
    const json = JSON.stringify(urls, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'urls.json';
    link.click();
});

document.getElementById('import-json').addEventListener('click', () => {
    document.getElementById('import-file').click();
});

document.getElementById('import-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            urls = urls.concat(data);
            saveData();
            renderList();
            alert('インポートしました');
        } catch (error) {
            alert('インポートに失敗しました');
        }
    };
    reader.readAsText(file);
});

document.getElementById('clear-all').addEventListener('click', () => {
    if (!confirm('全ての短縮URLを削除しますか？')) return;
    urls = [];
    saveData();
    renderList();
});

function handleHash() {
    const alias = window.location.hash.substring(1);
    if (alias) {
        const url = urls.find(u => u.alias === alias);
        if (url) {
            url.clicks++;
            saveData();
            window.location.href = url.original;
        }
    }
}

window.addEventListener('hashchange', handleHash);
window.addEventListener('load', () => {
    renderList();
    handleHash();
});
