const API_KEY_STORAGE = 'text-analyzer-api-key';
const PROVIDER_STORAGE = 'text-analyzer-provider';

// 保存されたAPIキーとプロバイダーをロード
document.getElementById('api-key').value = localStorage.getItem(API_KEY_STORAGE) || '';
document.getElementById('provider').value = localStorage.getItem(PROVIDER_STORAGE) || 'openai';

// APIキー保存
document.getElementById('save-key').addEventListener('click', () => {
    const apiKey = document.getElementById('api-key').value;
    const provider = document.getElementById('provider').value;

    if (!apiKey) {
        alert('APIキーを入力してください');
        return;
    }

    localStorage.setItem(API_KEY_STORAGE, apiKey);
    localStorage.setItem(PROVIDER_STORAGE, provider);
    alert('APIキーを保存しました');
});

// テキスト統計リアルタイム更新
document.getElementById('text-input').addEventListener('input', (e) => {
    const text = e.target.value;
    document.getElementById('char-count').textContent = text.length;
    document.getElementById('word-count').textContent = text.split(/\s+/).filter(w => w).length;
});

// 分析実行
document.getElementById('analyze-btn').addEventListener('click', async () => {
    const text = document.getElementById('text-input').value;
    const apiKey = document.getElementById('api-key').value;
    const provider = document.getElementById('provider').value;

    if (!text.trim()) {
        alert('テキストを入力してください');
        return;
    }

    if (!apiKey) {
        alert('APIキーを設定してください');
        return;
    }

    document.getElementById('analyze-btn').textContent = '分析中...';
    document.getElementById('analyze-btn').disabled = true;

    try {
        const result = await analyzeText(text, apiKey, provider);
        displayResults(result);
        document.getElementById('results').style.display = 'block';
    } catch (error) {
        alert('分析に失敗しました: ' + error.message);
    } finally {
        document.getElementById('analyze-btn').textContent = '分析開始';
        document.getElementById('analyze-btn').disabled = false;
    }
});

async function analyzeText(text, apiKey, provider) {
    const prompt = `以下のテキストを分析して、JSON形式で結果を返してください。

テキスト:
"""
${text}
"""

以下の項目を分析してください:
1. sentiment: 感情分析（positive, negative, neutral のいずれか）
2. sentiment_score: 感情スコア（0-100の数値）
3. keywords: 重要なキーワード（配列、最大10個）
4. readability_score: 可読性スコア（0-100、高いほど読みやすい）
5. tone: 文章のトーン（formal, casual, business など）
6. suggestions: 改善提案（配列、最大5個）

JSON形式で返してください。`;

    if (provider === 'openai') {
        return await analyzeWithOpenAI(prompt, apiKey);
    } else if (provider === 'claude') {
        return await analyzeWithClaude(prompt, apiKey);
    }
}

async function analyzeWithOpenAI(prompt, apiKey) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3
        })
    });

    if (!response.ok) {
        throw new Error('API呼び出しに失敗しました');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // JSONを抽出
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
}

async function analyzeWithClaude(prompt, apiKey) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            messages: [{ role: 'user', content: prompt }]
        })
    });

    if (!response.ok) {
        throw new Error('API呼び出しに失敗しました');
    }

    const data = await response.json();
    const content = data.content[0].text;

    // JSONを抽出
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
}

function displayResults(result) {
    // 感情分析
    const sentimentColors = {
        positive: '#10b981',
        negative: '#ef4444',
        neutral: '#6b7280'
    };
    const sentimentLabels = {
        positive: 'ポジティブ',
        negative: 'ネガティブ',
        neutral: 'ニュートラル'
    };

    document.getElementById('sentiment-result').innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 3rem; color: ${sentimentColors[result.sentiment] || '#6b7280'};">
                ${sentimentLabels[result.sentiment] || result.sentiment}
            </div>
            <div style="margin-top: 10px;">
                スコア: <strong>${result.sentiment_score || 'N/A'}</strong>
            </div>
        </div>
    `;

    // キーワード
    document.getElementById('keywords-result').innerHTML = result.keywords
        ? result.keywords.map(kw => `<span class="tag" style="background: #06b6d4; color: white; padding: 5px 12px; border-radius: 15px; display: inline-block; margin: 5px;">${kw}</span>`).join('')
        : 'キーワードが見つかりませんでした';

    // 可読性
    document.getElementById('readability-result').innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 2.5rem; font-weight: 700; color: #06b6d4;">
                ${result.readability_score || 'N/A'}
            </div>
            <div style="margin-top: 10px;">
                トーン: <strong>${result.tone || 'N/A'}</strong>
            </div>
        </div>
    `;

    // 改善提案
    document.getElementById('suggestions-result').innerHTML = result.suggestions
        ? '<ul style="margin: 0; padding-left: 20px;">' + result.suggestions.map(s => `<li style="margin: 8px 0;">${s}</li>`).join('') + '</ul>'
        : '改善提案がありません';
}
