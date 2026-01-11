class ImageOptimizer {
    constructor() {
        this.images = [];
        this.totalOriginalSize = 0;
        this.totalOptimizedSize = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateStats();
    }

    setupEventListeners() {
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');
        const qualitySlider = document.getElementById('qualitySlider');

        dropZone.addEventListener('click', () => fileInput.click());

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            this.handleFiles(e.dataTransfer.files);
        });

        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });

        qualitySlider.addEventListener('input', (e) => {
            document.getElementById('qualityValue').textContent = `${e.target.value}%`;
        });

        document.getElementById('downloadAll')?.addEventListener('click', () => {
            this.downloadAll();
        });
    }

    async handleFiles(files) {
        const validFiles = Array.from(files).filter(file =>
            file.type.startsWith('image/')
        );

        if (validFiles.length === 0) {
            this.showNotification('画像ファイルを選択してください', 'error');
            return;
        }

        for (const file of validFiles) {
            await this.processImage(file);
        }

        document.getElementById('imagesSection').style.display = 'block';
        this.showNotification(`${validFiles.length}枚の画像を処理しました`, 'success');
    }

    async processImage(file) {
        const reader = new FileReader();

        return new Promise((resolve) => {
            reader.onload = async (e) => {
                const img = new Image();
                img.onload = async () => {
                    const optimized = await this.optimizeImage(img, file);
                    this.images.push({
                        original: file,
                        optimized: optimized,
                        originalSize: file.size,
                        optimizedSize: optimized.size,
                        name: file.name,
                        preview: e.target.result
                    });

                    this.totalOriginalSize += file.size;
                    this.totalOptimizedSize += optimized.size;

                    this.renderImages();
                    this.updateStats();
                    resolve();
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    async optimizeImage(img, originalFile) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const resizeOption = document.getElementById('resizeOption').value;
        const quality = document.getElementById('qualitySlider').value / 100;
        const convertWebP = document.getElementById('convertWebP').checked;

        let width = img.width;
        let height = img.height;

        if (resizeOption !== 'none') {
            const maxWidth = parseInt(resizeOption);
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = convertWebP ? 'image/webp' : originalFile.type;

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                const fileName = this.getOptimizedFileName(originalFile.name, convertWebP);
                const file = new File([blob], fileName, { type: mimeType });
                resolve(file);
            }, mimeType, quality);
        });
    }

    getOptimizedFileName(originalName, convertWebP) {
        const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
        const ext = convertWebP ? 'webp' : originalName.split('.').pop();
        return `${nameWithoutExt}_optimized.${ext}`;
    }

    renderImages() {
        const imagesList = document.getElementById('imagesList');
        imagesList.innerHTML = this.images.map((img, index) =>
            this.createImageItemHTML(img, index)
        ).join('');

        this.images.forEach((img, index) => {
            const btn = document.querySelector(`[data-index="${index}"]`);
            btn.addEventListener('click', () => this.downloadImage(img.optimized));
        });
    }

    createImageItemHTML(img, index) {
        const savedBytes = img.originalSize - img.optimizedSize;
        const savedPercent = ((savedBytes / img.originalSize) * 100).toFixed(1);

        return `
            <div class="image-item">
                <img src="${img.preview}" alt="${img.name}" class="image-preview">
                <div class="image-info">
                    <h3>${this.escapeHtml(img.name)}</h3>
                    <div class="image-stats">
                        <div class="stat-item">
                            <span class="stat-item-label">元のサイズ</span>
                            <span class="stat-item-value">${this.formatBytes(img.originalSize)}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-item-label">最適化後</span>
                            <span class="stat-item-value">${this.formatBytes(img.optimizedSize)}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-item-label">削減率</span>
                            <span class="stat-item-value success">${savedPercent}%</span>
                        </div>
                    </div>
                </div>
                <button class="btn-download" data-index="${index}">
                    ダウンロード
                </button>
            </div>
        `;
    }

    downloadImage(file) {
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    async downloadAll() {
        for (const img of this.images) {
            this.downloadImage(img.optimized);
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        this.showNotification('すべての画像をダウンロードしました', 'success');
    }

    updateStats() {
        const totalImages = this.images.length;
        const savedBytes = this.totalOriginalSize - this.totalOptimizedSize;
        const savedPercent = this.totalOriginalSize > 0
            ? ((savedBytes / this.totalOriginalSize) * 100).toFixed(1)
            : 0;

        document.getElementById('totalImages').textContent = totalImages;
        document.getElementById('totalOriginalSize').textContent = this.formatBytes(this.totalOriginalSize);
        document.getElementById('totalOptimizedSize').textContent = this.formatBytes(this.totalOptimizedSize);
        document.getElementById('totalSaved').textContent = `${savedPercent}%`;
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
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
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#8b5cf6'};
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
        document.head.appendChild(style);

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ImageOptimizer();
});
