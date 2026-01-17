const arm = document.getElementById('arm');
const disk = document.getElementById('disk');
const led = document.getElementById('led');
const instruction = document.querySelector('.instruction');
let isPlaying = false;
let isDragging = false;

// クリックでトグル
arm.addEventListener('click', (e) => {
    if (!isDragging) {
        togglePlayback();
    }
});

// ドラッグ対応の改善
arm.addEventListener('mousedown', () => {
    isDragging = false;
    arm.style.cursor = 'grabbing';
});

arm.addEventListener('mousemove', (e) => {
    if (e.buttons === 1) {
        isDragging = true;
        arm.classList.add('dragging');
    }
});

arm.addEventListener('mouseup', () => {
    arm.style.cursor = 'grab';
    arm.classList.remove('dragging');
    setTimeout(() => {
        isDragging = false;
    }, 50);
});

// レコードエリアをドロップゾーンに
disk.addEventListener('mouseenter', () => {
    if (!isPlaying) {
        disk.classList.add('hover-ready');
    }
});

disk.addEventListener('mouseleave', () => {
    disk.classList.remove('hover-ready');
});

disk.addEventListener('click', () => {
    if (!isPlaying) {
        togglePlayback();
    }
});

function togglePlayback() {
    if (!isPlaying) {
        // Play
        arm.style.transform = "rotate(15deg)";
        arm.classList.add('playing');
        instruction.textContent = 'Click arm or record to stop.';
        
        setTimeout(() => {
            disk.classList.add('spinning');
            led.classList.add('on');
        }, 300);
        isPlaying = true;
    } else {
        // Stop
        arm.style.transform = "rotate(-30deg)";
        arm.classList.remove('playing');
        disk.classList.remove('spinning');
        led.classList.remove('on');
        instruction.textContent = 'Click or drag the arm to the record.';
        isPlaying = false;
    }
}
