// スクロールで湯気が晴れる
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const steam = document.getElementById('steam');
            
            // 300pxスクロールしたら完全に晴れる
            const blurAmount = Math.max(0, 8 - (scrollY / 300) * 8);
            steam.style.backdropFilter = `blur(${blurAmount}px)`;
            steam.style.webkitBackdropFilter = `blur(${blurAmount}px)`;
            
            if (blurAmount <= 0) {
                steam.style.display = 'none';
            } else {
                steam.style.display = 'block';
            }
        });