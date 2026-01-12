const API_KEY_STORAGE = 'news-aggregator-api-key';
const BOOKMARKS_STORAGE = 'news-aggregator-bookmarks';

let articles = [];
let bookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_STORAGE)) || [];

// 初期化
document.getElementById('api-key').value = localStorage.getItem(API_KEY_STORAGE) || '';

// APIキー保存
document.getElementById('save-key').addEventListener('click', () => {
    const apiKey = document.getElementById('api-key').value;
    if (!apiKey) {
        alert('APIキーを入力してください');
        return;
    }
    localStorage.setItem(API_KEY_STORAGE, apiKey);
    alert('APIキーを保存しました');
});

// タブ切り替え
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;

        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(targetTab + '-tab').classList.add('active');

        if (targetTab === 'bookmarks') {
            renderBookmarks();
        }
    });
});

// ニュース取得
async function fetchNews() {
    const apiKey = document.getElementById('api-key').value;
    const category = document.getElementById('category').value;
    const search = document.getElementById('search').value;

    // デモ用のサンプルデータ（APIキーがない場合）
    if (!apiKey) {
        articles = generateSampleNews();
        renderNews(articles);
        return;
    }

    try {
        let url = `https://newsapi.org/v2/top-headlines?country=jp&apiKey=${apiKey}`;

        if (category) {
            url += `&category=${category}`;
        }

        if (search) {
            url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(search)}&language=ja&apiKey=${apiKey}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'ok') {
            articles = data.articles;
            renderNews(articles);
        } else {
            alert('ニュースの取得に失敗しました: ' + data.message);
        }
    } catch (error) {
        alert('エラーが発生しました: ' + error.message);
        // フォールバック: サンプルデータ
        articles = generateSampleNews();
        renderNews(articles);
    }
}

// サンプルニュース生成（APIキーがない場合のデモ用）
function generateSampleNews() {
    return [
        {
            title: 'AI技術の最新動向：2026年の展望',
            description: '人工知能技術が急速に発展し、様々な産業で活用が進んでいます。',
            url: '#',
            urlToImage: null,
            source: { name: 'テック情報' },
            publishedAt: new Date().toISOString()
        },
        {
            title: 'スタートアップ企業の資金調達が過去最高に',
            description: '2026年第1四半期のスタートアップ投資額が記録的な水準に達しました。',
            url: '#',
            urlToImage: null,
            source: { name: 'ビジネスニュース' },
            publishedAt: new Date().toISOString()
        },
        {
            title: '環境配慮型テクノロジーが注目を集める',
            description: 'グリーンテックへの投資が増加傾向にあります。',
            url: '#',
            urlToImage: null,
            source: { name: 'エコニュース' },
            publishedAt: new Date().toISOString()
        }
    ];
}

// ニュース表示
function renderNews(newsArticles) {
    const listDiv = document.getElementById('news-list');

    if (newsArticles.length === 0) {
        listDiv.innerHTML = '<p style="text-align: center; color: var(--text-secondary); grid-column: 1/-1;">ニュースが見つかりませんでした</p>';
        return;
    }

    listDiv.innerHTML = newsArticles.map((article, index) => {
        const isBookmarked = bookmarks.some(b => b.url === article.url);
        return `
            <div class="news-card">
                ${article.urlToImage
                    ? `<img src="${article.urlToImage}" alt="${article.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`
                    : ''
                }
                <div class="placeholder-img" style="${article.urlToImage ? 'display: none;' : ''}">📰</div>
                <div class="news-content">
                    <h3 class="news-title">${article.title}</h3>
                    <p class="news-description">${article.description || '説明がありません'}</p>
                    <div class="news-meta">
                        <span class="news-source">${article.source.name}</span>
                        <span>${new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <div class="news-actions">
                        <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}"
                                onclick="toggleBookmark(${index}, event)">
                            ${isBookmarked ? '★ ブックマーク済み' : '☆ ブックマーク'}
                        </button>
                        <a href="${article.url}" target="_blank" style="text-decoration: none;">
                            <button class="btn btn-primary" style="padding: 6px 12px; font-size: 0.9rem;">記事を読む</button>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ブックマーク切り替え
function toggleBookmark(index, event) {
    event.stopPropagation();
    const article = articles[index];

    const existingIndex = bookmarks.findIndex(b => b.url === article.url);

    if (existingIndex >= 0) {
        bookmarks.splice(existingIndex, 1);
    } else {
        bookmarks.push(article);
    }

    localStorage.setItem(BOOKMARKS_STORAGE, JSON.stringify(bookmarks));
    renderNews(articles);
}

// ブックマーク表示
function renderBookmarks() {
    const listDiv = document.getElementById('bookmarks-list');

    if (bookmarks.length === 0) {
        listDiv.innerHTML = '<p style="text-align: center; color: var(--text-secondary); grid-column: 1/-1;">ブックマークがありません</p>';
        return;
    }

    listDiv.innerHTML = bookmarks.map((article, index) => `
        <div class="news-card">
            ${article.urlToImage
                ? `<img src="${article.urlToImage}" alt="${article.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`
                : ''
            }
            <div class="placeholder-img" style="${article.urlToImage ? 'display: none;' : ''}">📰</div>
            <div class="news-content">
                <h3 class="news-title">${article.title}</h3>
                <p class="news-description">${article.description || '説明がありません'}</p>
                <div class="news-meta">
                    <span class="news-source">${article.source.name}</span>
                    <span>${new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
                <div class="news-actions">
                    <button class="bookmark-btn bookmarked" onclick="removeBookmark(${index}, event)">
                        ★ ブックマーク解除
                    </button>
                    <a href="${article.url}" target="_blank" style="text-decoration: none;">
                        <button class="btn btn-primary" style="padding: 6px 12px; font-size: 0.9rem;">記事を読む</button>
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

function removeBookmark(index, event) {
    event.stopPropagation();
    bookmarks.splice(index, 1);
    localStorage.setItem(BOOKMARKS_STORAGE, JSON.stringify(bookmarks));
    renderBookmarks();
}

// イベントリスナー
document.getElementById('refresh-btn').addEventListener('click', fetchNews);
document.getElementById('search').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchNews();
});
document.getElementById('category').addEventListener('change', fetchNews);

// 初期読み込み
fetchNews();
