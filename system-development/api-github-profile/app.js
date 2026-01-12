let userRepos = [];
let languagesChart;

// 検索ボタン
document.getElementById('search-btn').addEventListener('click', () => {
    const username = document.getElementById('username-input').value.trim();
    if (username) {
        fetchUserProfile(username);
    }
});

// Enterキーで検索
document.getElementById('username-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('search-btn').click();
    }
});

// ソート変更
document.getElementById('sort-select').addEventListener('change', () => {
    renderRepos(userRepos);
});

// ユーザー情報取得
async function fetchUserProfile(username) {
    try {
        document.getElementById('search-btn').textContent = '検索中...';
        document.getElementById('search-btn').disabled = true;

        // ユーザー情報取得
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!userResponse.ok) {
            throw new Error('ユーザーが見つかりません');
        }
        const user = await userResponse.json();

        // リポジトリ取得
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        if (!reposResponse.ok) {
            throw new Error('リポジトリの取得に失敗しました');
        }
        userRepos = await reposResponse.json();

        // 表示
        displayUserProfile(user);
        await displayLanguageStats(username, userRepos);
        renderRepos(userRepos);

        document.getElementById('profile-section').style.display = 'block';
    } catch (error) {
        alert('エラー: ' + error.message);
    } finally {
        document.getElementById('search-btn').textContent = '検索';
        document.getElementById('search-btn').disabled = false;
    }
}

// ユーザー情報表示
function displayUserProfile(user) {
    document.getElementById('avatar').src = user.avatar_url;
    document.getElementById('name').textContent = user.name || user.login;
    document.getElementById('username').textContent = `@${user.login}`;
    document.getElementById('bio').textContent = user.bio || '自己紹介がありません';

    // メタ情報
    document.getElementById('location').textContent = user.location || '';
    document.getElementById('location').style.display = user.location ? 'block' : 'none';

    document.getElementById('company').textContent = user.company || '';
    document.getElementById('company').style.display = user.company ? 'block' : 'none';

    if (user.blog) {
        document.getElementById('website').textContent = user.blog;
        document.getElementById('website').href = user.blog.startsWith('http') ? user.blog : `https://${user.blog}`;
        document.getElementById('website').style.display = 'block';
    } else {
        document.getElementById('website').style.display = 'none';
    }

    // 統計
    document.getElementById('repos').textContent = user.public_repos;
    document.getElementById('followers').textContent = user.followers;
    document.getElementById('following').textContent = user.following;
    document.getElementById('gists').textContent = user.public_gists;
}

// 言語統計表示
async function displayLanguageStats(username, repos) {
    const languageData = {};

    // 各リポジトリの言語取得
    for (const repo of repos.slice(0, 30)) { // 最大30リポジトリ
        try {
            const response = await fetch(repo.languages_url);
            if (response.ok) {
                const languages = await response.json();
                for (const [lang, bytes] of Object.entries(languages)) {
                    languageData[lang] = (languageData[lang] || 0) + bytes;
                }
            }
        } catch (error) {
            console.error('言語取得エラー:', error);
        }
    }

    // グラフ表示
    const sortedLanguages = Object.entries(languageData)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    const labels = sortedLanguages.map(([lang]) => lang);
    const data = sortedLanguages.map(([, bytes]) => bytes);

    const ctx = document.getElementById('languages-chart');

    // 既存のグラフを破棄
    if (languagesChart) {
        languagesChart.destroy();
    }

    languagesChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#3178c6', '#f1e05a', '#e34c26', '#563d7c', '#89e051',
                    '#555555', '#4F5D95', '#384d54', '#f34b7d', '#3572A5'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#c9d1d9'
                    }
                },
                title: {
                    display: true,
                    text: 'トップ10言語',
                    color: '#c9d1d9'
                }
            }
        }
    });
}

// リポジトリ一覧表示
function renderRepos(repos) {
    const sortBy = document.getElementById('sort-select').value;
    const listDiv = document.getElementById('repos-list');

    // ソート
    let sortedRepos = [...repos];
    switch (sortBy) {
        case 'stars':
            sortedRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);
            break;
        case 'updated':
            sortedRepos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            break;
        case 'name':
            sortedRepos.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }

    if (sortedRepos.length === 0) {
        listDiv.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">リポジトリがありません</p>';
        return;
    }

    listDiv.innerHTML = sortedRepos.map(repo => {
        const languageColor = getLanguageColor(repo.language);
        return `
            <div class="repo-item">
                <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
                <p class="repo-description">${repo.description || '説明がありません'}</p>
                <div class="repo-meta">
                    ${repo.language ? `<span><span class="language-dot" style="background-color: ${languageColor};"></span>${repo.language}</span>` : ''}
                    <span>⭐ ${repo.stargazers_count}</span>
                    <span>🍴 ${repo.forks_count}</span>
                    <span>更新: ${new Date(repo.updated_at).toLocaleDateString()}</span>
                </div>
            </div>
        `;
    }).join('');
}

// 言語カラー
function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f1e05a',
        'TypeScript': '#3178c6',
        'Python': '#3572A5',
        'Java': '#b07219',
        'C++': '#f34b7d',
        'C': '#555555',
        'C#': '#178600',
        'Ruby': '#701516',
        'Go': '#00ADD8',
        'Rust': '#dea584',
        'PHP': '#4F5D95',
        'Swift': '#ffac45',
        'Kotlin': '#A97BFF',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Shell': '#89e051'
    };
    return colors[language] || '#858585';
}

// 初期読み込み
fetchUserProfile('octocat');
