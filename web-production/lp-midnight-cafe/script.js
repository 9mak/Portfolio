// 窓を伝う雨のアニメーション
const canvas = document.getElementById('rain-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let raindrops = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Raindrop {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * -100;
        this.vy = Math.random() * 2 + 2; // 落下速度
        this.size = Math.random() * 2 + 1;
        this.trail = [];
        this.trailLength = Math.random() * 20 + 10;
    }

    update() {
        this.y += this.vy;

        // 軌跡を保存
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > this.trailLength) {
            this.trail.shift();
        }

        // ランダムに少し蛇行させる（窓を伝う感じ）
        if (Math.random() < 0.05) {
            this.x += (Math.random() - 0.5) * 2;
        }

        if (this.y > height + 50) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = this.size;
        ctx.lineCap = 'round';

        if (this.trail.length > 1) {
            ctx.moveTo(this.trail[0].x, this.trail[0].y);
            for (let i = 1; i < this.trail.length; i++) {
                ctx.lineTo(this.trail[i].x, this.trail[i].y);
            }
            ctx.stroke();
        }

        // 先端の滴
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        ctx.fill();
    }
}

function initRain() {
    for (let i = 0; i < 50; i++) {
        raindrops.push(new Raindrop());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    raindrops.forEach(drop => {
        drop.update();
        drop.draw();
    });
    requestAnimationFrame(animate);
}

initRain();
animate();
