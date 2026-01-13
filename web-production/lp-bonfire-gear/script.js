// 火の粉パーティクルシステム
const canvas = document.getElementById('embers-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let embers = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Ember {
    constructor() {
        this.reset();
        this.y = Math.random() * height; // 初期配置はランダム
    }

    reset() {
        this.x = Math.random() * width;
        this.y = height + 10;
        this.vx = (Math.random() - 0.5) * 2; // 横揺れ
        this.vy = -(Math.random() * 2 + 1); // 上昇速度
        this.size = Math.random() * 3 + 1;
        this.color = `rgba(255, ${Math.floor(Math.random() * 100) + 50}, 0, ${Math.random()})`;
        this.life = Math.random() * 100 + 50;
    }

    update() {
        this.x += this.vx + Math.sin(this.y * 0.01); // ゆらゆら
        this.y += this.vy;
        this.life--;
        this.size *= 0.99; // 徐々に小さく

        if (this.life <= 0 || this.y < -10 || this.size < 0.1) {
            this.reset();
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "orange";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // 重くなるのでリセット
    }
}

function initEmbers() {
    for (let i = 0; i < 60; i++) {
        embers.push(new Ember());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    embers.forEach(ember => {
        ember.update();
        ember.draw();
    });
    requestAnimationFrame(animate);
}

initEmbers();
animate();

// スクロールフェードイン
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
