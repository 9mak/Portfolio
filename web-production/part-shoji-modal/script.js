const modal = document.getElementById('modal');

function toggleShoji() {
    if (modal.classList.contains('active')) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 600); // アニメーション待機
    } else {
        modal.style.display = 'block';
        // display:blockの直後にclass付与だとアニメーションしないため微遅延
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }
}
