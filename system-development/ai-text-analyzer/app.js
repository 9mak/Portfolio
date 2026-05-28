document.getElementById('text-input').addEventListener('input', (e) => {
    const text = e.target.value;
    document.getElementById('char-count').textContent = text.length;
    document.getElementById('word-count').textContent = text.split(/\s+/).filter(w => w).length;
});

document.getElementById('analyze-btn').addEventListener('click', () => {
    const text = document.getElementById('text-input').value;

    if (!text.trim()) {
        alert('テキストを入力してください');
        return;
    }

    const result = analyzeTextLocally(text);
    displayResults(result);
    document.getElementById('results').style.display = 'block';
});

function analyzeTextLocally(text) {
    const positiveWords = ['良い', '便利', '安心', '改善', '成功', '簡単', 'おすすめ', '高品質'];
    const negativeWords = ['不安', '遅い', '難しい', '問題', '失敗', '高い', '面倒', '不足'];
    const positive = positiveWords.filter(word => text.includes(word)).length;
    const negative = negativeWords.filter(word => text.includes(word)).length;
    const sentiment = positive > negative ? 'positive' : negative > positive ? 'negative' : 'neutral';
    const sentences = text.split(/[。！？\n]/).filter(Boolean);
    const avgSentenceLength = text.length / Math.max(sentences.length, 1);
    const readability = Math.max(35, Math.min(95, Math.round(100 - Math.max(0, avgSentenceLength - 32))));
    const keywords = Array.from(new Set(text
        .replace(/[、。！？\n]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length >= 3)
        .slice(0, 10)));

    return {
        sentiment,
        sentiment_score: sentiment === 'positive' ? 78 : sentiment === 'negative' ? 42 : 60,
        keywords: keywords.length ? keywords : ['改善', '訴求', '導線'],
        readability_score: readability,
        tone: avgSentenceLength > 45 ? 'business' : 'casual',
        suggestions: [
            '冒頭に結論を置き、読み手が得られるメリットを明確にします。',
            '長い文は2つに分け、スマホでも追いやすい文字量にします。',
            '実績、数字、事例を1つ追加して信頼材料を補強します。',
            '最後に問い合わせや購入など、次の行動をひとつだけ提示します。'
        ]
    };
}

function displayResults(result) {
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

    document.getElementById('keywords-result').innerHTML = result.keywords
        ? result.keywords.map(kw => `<span class="tag" style="background: #06b6d4; color: white; padding: 5px 12px; border-radius: 15px; display: inline-block; margin: 5px;">${kw}</span>`).join('')
        : 'キーワードが見つかりませんでした';

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

    document.getElementById('suggestions-result').innerHTML = result.suggestions
        ? '<ul style="margin: 0; padding-left: 20px;">' + result.suggestions.map(s => `<li style="margin: 8px 0;">${s}</li>`).join('') + '</ul>'
        : '改善提案がありません';
}
