class AIWritingAssistant {
    constructor() {
        this.apiKey = localStorage.getItem('openai_api_key');
        this.history = JSON.parse(localStorage.getItem('writing_history') || '[]');
        this.currentTemplate = null;
        this.templates = {
            blog: {
                name: 'ブログ記事',
                prompt: '以下のテーマについて、SEOを意識した読みやすいブログ記事を書いてください：'
            },
            product: {
                name: '商品説明文',
                prompt: '以下の商品について、購買意欲を高める魅力的な商品説明文を書いてください：'
            },
            sns: {
                name: 'SNS投稿',
                prompt: '以下のテーマについて、エンゲージメントを高めるSNS投稿文を書いてください：'
            },
            email: {
                name: 'ビジネスメール',
                prompt: '以下の内容について、丁寧で分かりやすいビジネスメールを書いてください：'
            },
            press: {
                name: 'プレスリリース',
                prompt: '以下の内容について、メディア向けのプレスリリースを書いてください：'
            },
            ad: {
                name: '広告コピー',
                prompt: '以下の商品・サービスについて、注目を集める広告コピーを書いてください：'
            }
        };
        this.init();
    }

    init() {
        if (this.apiKey) {
            this.showMainSection();
        }
        this.setupEventListeners();
        this.renderHistory();
    }

    setupEventListeners() {
        document.getElementById('saveApiKey')?.addEventListener('click', () => {
            this.saveApiKey();
        });

        document.getElementById('changeApiKey')?.addEventListener('click', () => {
            this.changeApiKey();
        });

        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectTemplate(e.target.dataset.template);
            });
        });

        document.getElementById('generateBtn')?.addEventListener('click', () => {
            this.generateText();
        });

        document.getElementById('copyBtn')?.addEventListener('click', () => {
            this.copyToClipboard();
        });

        document.getElementById('clearHistory')?.addEventListener('click', () => {
            this.clearHistory();
        });
    }

    saveApiKey() {
        const apiKey = document.getElementById('apiKeyInput').value.trim();
        if (!apiKey) {
            this.showNotification('APIキーを入力してください', 'error');
            return;
        }

        if (!apiKey.startsWith('sk-')) {
            this.showNotification('有効なAPIキーを入力してください', 'error');
            return;
        }

        localStorage.setItem('openai_api_key', apiKey);
        this.apiKey = apiKey;
        this.showMainSection();
        this.showNotification('APIキーを保存しました', 'success');
    }

    changeApiKey() {
        document.getElementById('apiKeySection').style.display = 'flex';
        document.getElementById('mainSection').style.display = 'none';
        document.getElementById('apiKeyInput').value = '';
    }

    showMainSection() {
        document.getElementById('apiKeySection').style.display = 'none';
        document.getElementById('mainSection').style.display = 'block';
    }

    selectTemplate(templateKey) {
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        this.currentTemplate = templateKey;
    }

    async generateText() {
        if (!this.currentTemplate) {
            this.showNotification('テンプレートを選択してください', 'error');
            return;
        }

        const inputText = document.getElementById('inputText').value.trim();
        if (!inputText) {
            this.showNotification('テーマを入力してください', 'error');
            return;
        }

        const tone = document.getElementById('toneSelect').value;
        const length = document.getElementById('lengthSelect').value;
        const model = document.getElementById('modelSelect').value;

        const toneMap = {
            professional: 'フォーマルで専門的な',
            casual: 'カジュアルで親しみやすい',
            friendly: 'フレンドリーで温かい',
            persuasive: '説得力のある'
        };

        const lengthMap = {
            short: '100字程度の短い',
            medium: '300字程度の適度な',
            long: '500字以上の詳しい'
        };

        const template = this.templates[this.currentTemplate];
        const prompt = `${template.prompt}\n\n【テーマ】\n${inputText}\n\n【条件】\n- トーン: ${toneMap[tone]}\n- 長さ: ${lengthMap[length]}`;

        this.showLoading(true);
        document.getElementById('generateBtn').disabled = true;

        try {
            const response = await this.callOpenAI(prompt, model);
            this.displayResult(response);
            this.addToHistory(template.name, inputText, response);
            this.showNotification('文章を生成しました', 'success');
        } catch (error) {
            this.showNotification('エラーが発生しました: ' + error.message, 'error');
            this.displayError(error.message);
        } finally {
            this.showLoading(false);
            document.getElementById('generateBtn').disabled = false;
        }
    }

    async callOpenAI(prompt, model) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: 'system',
                        content: 'あなたは優秀なライティングアシスタントです。ユーザーの要望に応じて、高品質な文章を作成してください。'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || '不明なエラー');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    displayResult(text) {
        const outputArea = document.getElementById('outputText');
        outputArea.textContent = text;
        outputArea.classList.remove('placeholder-text');
        document.getElementById('copyBtn').style.display = 'block';
    }

    displayError(message) {
        const outputArea = document.getElementById('outputText');
        outputArea.innerHTML = `<p style="color: #ef4444;">エラー: ${this.escapeHtml(message)}</p>`;
    }

    showLoading(show) {
        document.getElementById('loadingIndicator').style.display = show ? 'block' : 'none';
        document.getElementById('outputText').style.display = show ? 'none' : 'block';
    }

    copyToClipboard() {
        const text = document.getElementById('outputText').textContent;
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('クリップボードにコピーしました', 'success');
        });
    }

    addToHistory(templateName, input, output) {
        this.history.unshift({
            id: Date.now(),
            template: templateName,
            input: input,
            output: output,
            timestamp: new Date().toISOString()
        });

        if (this.history.length > 20) {
            this.history = this.history.slice(0, 20);
        }

        localStorage.setItem('writing_history', JSON.stringify(this.history));
        this.renderHistory();
    }

    renderHistory() {
        const historyList = document.getElementById('historyList');

        if (this.history.length === 0) {
            historyList.innerHTML = '<p class="empty-state">履歴がありません</p>';
            return;
        }

        historyList.innerHTML = this.history.map(item => `
            <div class="history-item" data-id="${item.id}">
                <div class="history-meta">
                    <span>${item.template}</span>
                    <span>${new Date(item.timestamp).toLocaleString('ja-JP')}</span>
                </div>
                <div class="history-text">${this.escapeHtml(item.output)}</div>
            </div>
        `).join('');

        document.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.loadFromHistory(id);
            });
        });
    }

    loadFromHistory(id) {
        const item = this.history.find(h => h.id === id);
        if (item) {
            this.displayResult(item.output);
            document.getElementById('inputText').value = item.input;
            this.showNotification('履歴から読み込みました', 'success');
        }
    }

    clearHistory() {
        if (confirm('履歴をすべて削除しますか？')) {
            this.history = [];
            localStorage.removeItem('writing_history');
            this.renderHistory();
            this.showNotification('履歴を削除しました', 'success');
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#06b6d4'};
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
        if (!document.getElementById('notification-styles')) {
            style.id = 'notification-styles';
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AIWritingAssistant();
});
