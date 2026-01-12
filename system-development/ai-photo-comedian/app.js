const API_KEY_STORAGE = 'photo-comedian-api-key';
const PROVIDER_STORAGE = 'photo-comedian-provider';
const GALLERY_STORAGE = 'photo-comedian-gallery';

let currentImage = null;
let selectedStyle = 'boke';
let gallery = JSON.parse(localStorage.getItem(GALLERY_STORAGE)) || [];

// 初期化
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

// ファイルアップロード
const fileInput = document.getElementById('file-input');
const uploadArea = document.getElementById('upload-area');
const previewImage = document.getElementById('preview-image');

uploadArea.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') return;
    fileInput.click();
});

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
    if (file && file.type.startsWith('image/')) {
        handleImage(file);
    }
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleImage(file);
});

function handleImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        currentImage = e.target.result;
        previewImage.src = currentImage;
        previewImage.style.display = 'block';
        document.querySelector('.upload-content').style.display = 'none';
        document.getElementById('generate-btn').disabled = false;
    };
    reader.readAsDataURL(file);
}

// スタイル選択
document.querySelectorAll('.style-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedStyle = btn.dataset.style;
    });
});

// 一言生成
document.getElementById('generate-btn').addEventListener('click', async () => {
    const apiKey = document.getElementById('api-key').value;
    const provider = document.getElementById('provider').value;

    if (!apiKey) {
        alert('APIキーを設定してください');
        return;
    }

    if (!currentImage) {
        alert('画像をアップロードしてください');
        return;
    }

    const btn = document.getElementById('generate-btn');
    btn.textContent = '生成中...';
    btn.disabled = true;

    try {
        const captions = await generateCaptions(currentImage, selectedStyle, apiKey, provider);
        displayCaptions(captions);
        document.getElementById('results').style.display = 'block';
    } catch (error) {
        alert('生成に失敗しました: ' + error.message);
    } finally {
        btn.textContent = '一言生成';
        btn.disabled = false;
    }
});

async function generateCaptions(imageBase64, style, apiKey, provider) {
    const stylePrompts = {
        boke: 'この画像を見て、IPPONグランプリの「写真で一言」のような面白いボケを5つ考えてください。シュールで予想外の発想を。',
        tsukkomi: 'この画像を見て、写真の矛盾や面白いポイントにツッコミを入れてください。5つのパターンを。',
        ogiri: 'この画像をお題として、大喜利の秀逸な回答を5つ考えてください。',
        free: 'この画像を見て、自由に面白い一言を5つ考えてください。ユーモアと創造性を重視して。'
    };

    const prompt = `${stylePrompts[style] || stylePrompts.free}

各一言は30文字以内で。JSON形式で返してください:
{
  "captions": ["一言1", "一言2", "一言3", "一言4", "一言5"]
}`;

    if (provider === 'openai') {
        return await generateWithOpenAI(imageBase64, prompt, apiKey);
    } else if (provider === 'claude') {
        return await generateWithClaude(imageBase64, prompt, apiKey);
    }
}

async function generateWithOpenAI(imageBase64, prompt, apiKey) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4-vision-preview',
            messages: [{
                role: 'user',
                content: [
                    { type: 'text', text: prompt },
                    { type: 'image_url', image_url: { url: imageBase64 } }
                ]
            }],
            max_tokens: 500
        })
    });

    if (!response.ok) {
        throw new Error('API呼び出しに失敗しました');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
    return result.captions || [];
}

async function generateWithClaude(imageBase64, prompt, apiKey) {
    // Base64からメディアタイプとデータを分離
    const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
    if (!matches) throw new Error('無効な画像形式');

    const mediaType = matches[1];
    const base64Data = matches[2];

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
            messages: [{
                role: 'user',
                content: [
                    {
                        type: 'image',
                        source: {
                            type: 'base64',
                            media_type: mediaType,
                            data: base64Data
                        }
                    },
                    { type: 'text', text: prompt }
                ]
            }]
        })
    });

    if (!response.ok) {
        throw new Error('API呼び出しに失敗しました');
    }

    const data = await response.json();
    const content = data.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
    return result.captions || [];
}

function displayCaptions(captions) {
    const listDiv = document.getElementById('captions-list');
    listDiv.innerHTML = captions.map((caption, index) => `
        <div class="caption-item" data-index="${index}">
            <div class="caption-text">${caption}</div>
            <div class="caption-actions">
                <button class="like-btn" onclick="likeCaption(${index})">❤️ いいね</button>
                <button class="save-btn" onclick="saveToGallery('${caption.replace(/'/g, "\\'")}')">ギャラリーに保存</button>
            </div>
        </div>
    `).join('');
}

function likeCaption(index) {
    const btn = document.querySelector(`[data-index="${index}"] .like-btn`);
    btn.classList.toggle('liked');
}

function saveToGallery(caption) {
    const item = {
        id: Date.now(),
        image: currentImage,
        caption: caption,
        style: selectedStyle,
        likes: 0,
        created: new Date().toISOString()
    };

    gallery.unshift(item);
    localStorage.setItem(GALLERY_STORAGE, JSON.stringify(gallery));
    renderGallery();
    alert('ギャラリーに保存しました！');
}

function renderGallery() {
    const galleryDiv = document.getElementById('gallery');

    if (gallery.length === 0) {
        galleryDiv.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">まだ保存されていません</p>';
        return;
    }

    galleryDiv.innerHTML = '<div class="gallery-grid">' + gallery.map(item => `
        <div class="gallery-item">
            <img src="${item.image}" alt="Gallery Image">
            <div class="gallery-caption">${item.caption}</div>
            <div class="gallery-likes">❤️ ${item.likes}</div>
        </div>
    `).join('') + '</div>';
}

document.getElementById('clear-gallery').addEventListener('click', () => {
    if (!confirm('ギャラリーを全て削除しますか？')) return;
    gallery = [];
    localStorage.removeItem(GALLERY_STORAGE);
    renderGallery();
});

// 初期表示
renderGallery();
