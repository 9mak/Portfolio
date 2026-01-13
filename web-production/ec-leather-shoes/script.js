// Comparison Slider Logic
const container = document.getElementById('comparison');
const overlay = document.getElementById('overlay');
const slider = document.getElementById('slider');

const moveSlider = (e) => {
    const rect = container.getBoundingClientRect();
    // X座標取得（マウス or タッチ）
    let clientX = e.clientX || e.touches[0].clientX;

    let x = clientX - rect.left;
    // 範囲制限
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;

    const percentage = (x / rect.width) * 100;

    overlay.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
    slider.style.left = `${percentage}%`;
};

container.addEventListener('mousemove', moveSlider);
container.addEventListener('touchmove', moveSlider);
