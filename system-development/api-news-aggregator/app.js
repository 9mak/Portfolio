const BOOKMARKS_STORAGE = 'news-aggregator-bookmarks';

let articles = [];
let bookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_STORAGE)) || [];

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
    const category = document.getElementById('category').value;
    const search = document.getElementById('search').value;

    articles = generateSampleNews().filter(article => {
        const matchesCategory = !category || article.category === category;
        const query = search.trim().toLowerCase();
        const matchesSearch = !query || `${article.title} ${article.description}`.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
    });
    renderNews(articles);
}

// サンプルニュース生成（公開デモ用）
function generateSampleNews() {
    return [
        {
            title: 'AI技術の最新動向：2026年の展望',
            description: '人工知能技術が急速に発展し、様々な産業で活用が進んでいます。',
            url: '#',
            urlToImage: null,
            category: 'technology',
            source: { name: 'テック情報' },
            publishedAt: new Date().toISOString()
        },
        {
            title: 'スタートアップ企業の資金調達が過去最高に',
            description: '2026年第1四半期のスタートアップ投資額が記録的な水準に達しました。',
            url: '#',
            urlToImage: null,
            category: 'business',
            source: { name: 'ビジネスニュース' },
            publishedAt: new Date().toISOString()
        },
        {
            title: '環境配慮型テクノロジーが注目を集める',
            description: 'グリーンテックへの投資が増加傾向にあります。',
            url: '#',
            urlToImage: null,
            category: 'science',
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
