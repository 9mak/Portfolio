const arm = document.getElementById('arm');
const disk = document.getElementById('disk');
const led = document.getElementById('led');
let isPlaying = false;

// 簡易的なクリック・トグル実装（ドラッグ実装は複雑になるため、デモ用にクリックで移動）
arm.addEventListener('click', () => {
    if (!isPlaying) {
        // Play
        arm.style.transform = "rotate(15deg)"; // レコード上に移動
        setTimeout(() => {
            disk.classList.add('spinning');
            led.classList.add('on');
        }, 300); // アームが降りる時間
        isPlaying = true;
    } else {
        // Stop
        arm.style.transform = "rotate(-30deg)"; // 元に戻る
        disk.classList.remove('spinning');
        led.classList.remove('on');
        isPlaying = false;
    }
});
