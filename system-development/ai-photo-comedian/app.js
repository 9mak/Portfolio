const GALLERY_STORAGE = 'photo-comedian-gallery';

let currentImage = null;
let selectedStyle = 'boke';
let gallery = [];

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

document.querySelectorAll('.style-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedStyle = btn.dataset.style;
    });
});

document.getElementById('generate-btn').addEventListener('click', () => {
    if (!currentImage) {
        alert('画像をアップロードしてください');
        return;
    }

    const btn = document.getElementById('generate-btn');
    btn.textContent = '生成中...';
    btn.disabled = true;

    setTimeout(() => {
        const captions = generateCaptions(selectedStyle);
        displayCaptions(captions);
        document.getElementById('results').style.display = 'block';
        btn.textContent = '一言生成';
        btn.disabled = false;
    }, 350);
});

function generateCaptions(style) {
    const samples = {
        boke: ['会議に遅れた未来の自分', '背景だけ先に帰った写真', '説明書を読まなかった世界線', '静止画なのに残業している', '主役より余白が緊張している'],
        tsukkomi: ['いや、そこが一番目立つんかい', '情報量の置き場所まちがえてる', 'その余白、家賃払ってる？', '真剣な顔で何してんねん', '背景のほうが事情知ってそう'],
        ogiri: ['新商品の名前を会議で決め損ねた瞬間', '締切5分前のデザイナーの脳内', 'レビューコメント「もう少しだけ派手に」', 'AIに任せたら妙に礼儀正しかった', '採用面接で趣味を聞かれた時の答え'],
        free: ['ここだけ急にプレゼン資料', '思ったよりプロジェクト感が出た', '余白の圧が強い', 'たぶん前職はバナー', '一言より状況説明が欲しい']
    };
    return samples[style] || samples.free;
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
    renderGallery();
    alert('ギャラリーに保存しました。このデモではブラウザ保存せず、ページを閉じると消えます。');
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
    renderGallery();
});

renderGallery();
