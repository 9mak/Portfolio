// Opening Animation
window.addEventListener('load', () => {
    const loaderText = document.getElementById('loader-text');
    const loader = document.getElementById('loader');

    // テキスト表示
    setTimeout(() => {
        loaderText.classList.remove('opacity-0');
    }, 500);

    // フェードアウト
    setTimeout(() => {
        loader.classList.add('opacity-0');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 1000);
    }, 2500);
});

// Intersection Observer for Scroll Animation
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // 一度だけ発火
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in-ink').forEach(el => {
    observer.observe(el);
});

// Mobile Menu Toggle
const menuBtn = document.getElementById('menu-btn');
const menuOverlay = document.getElementById('menu-overlay');
const menuLinks = document.querySelectorAll('.menu-link');
let isMenuOpen = false;

menuBtn.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
        menuOverlay.classList.remove('translate-x-full');
        document.body.style.overflow = 'hidden';
        // アイコンアニメーション（簡易）
        menuBtn.children[0].classList.add('rotate-45', 'translate-y-2');
        menuBtn.children[1].classList.add('-rotate-45', '-translate-y-1');
    } else {
        menuOverlay.classList.add('translate-x-full');
        document.body.style.overflow = '';
        // アイコン戻す
        menuBtn.children[0].classList.remove('rotate-45', 'translate-y-2');
        menuBtn.children[1].classList.remove('-rotate-45', '-translate-y-1');
    }
});

menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        isMenuOpen = false;
        menuOverlay.classList.add('translate-x-full');
        document.body.style.overflow = '';
    });
});
