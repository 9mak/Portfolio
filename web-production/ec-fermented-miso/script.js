const timeline = document.getElementById('fermentation-timeline');
const stickyBg = document.getElementById('sticky-bg');
const monthLabel = document.getElementById('month-label');
const descText = document.getElementById('desc-text');
const misoVisual = document.getElementById('miso-visual');

window.addEventListener('scroll', () => {
    const rect = timeline.getBoundingClientRect();
    const totalHeight = rect.height - window.innerHeight;
    const scrolled = -rect.top;

    if (scrolled < 0) return; // タイムライン前

    const progress = Math.min(Math.max(scrolled / totalHeight, 0), 1);

    // 段階判定 (0.0 - 1.0)
    stickyBg.className = 'sticky-content transition-colors duration-700';

    if (progress < 0.2) {
        stickyBg.classList.add('color-stage-0');
        monthLabel.innerText = "仕込み当日";
        misoVisual.style.backgroundColor = "#f0f4c3"; // 大豆色
        descText.innerHTML = "大豆を潰し、麹と塩を混ぜ合わせる。<br>まだ白っぽく、豆の香りが強い状態。";
    } else if (progress < 0.4) {
        stickyBg.classList.add('color-stage-1');
        monthLabel.innerText = "3ヶ月目";
        misoVisual.style.backgroundColor = "#ffe0b2"; // 薄いオレンジ
        descText.innerHTML = "発酵が始まり、少しずつ色がつき始める。<br>麹の甘い香りが漂う。";
    } else if (progress < 0.6) {
        stickyBg.classList.add('color-stage-2');
        monthLabel.innerText = "6ヶ月目（天地返し）";
        misoVisual.style.backgroundColor = "#d7ccc8"; // 茶色
        descText.innerHTML = "空気を入れるために混ぜ返す。<br>旨味成分が増し、味噌らしい色へ。";
    } else if (progress < 0.8) {
        stickyBg.classList.add('color-stage-3');
        monthLabel.innerText = "10ヶ月目";
        misoVisual.style.backgroundColor = "#8d6e63"; // 赤茶
        descText.innerHTML = "熟成が進み、赤褐色に変化。<br>コクと香りが深まる。";
    } else {
        stickyBg.classList.add('color-stage-4');
        monthLabel.innerText = "1年（完成）";
        misoVisual.style.backgroundColor = "#3e2723"; // 濃い茶
        descText.innerHTML = "ついに完成。<br>あなただけの「手前味噌」の出来上がり。";
    }
});
