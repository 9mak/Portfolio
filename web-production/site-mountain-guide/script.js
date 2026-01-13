// スクロール連動背景 & 標高メーター
        const body = document.body;
        const meterIndicator = document.getElementById('meter-indicator');
        const elevationText = document.getElementById('elevation-text');
        
        // 星生成
        const starContainer = document.getElementById('stars');
        for(let i=0; i<50; i++) {
            const star = document.createElement('div');
            star.style.position = 'absolute';
            star.style.width = Math.random() * 2 + 'px';
            star.style.height = star.style.width;
            star.style.background = 'white';
            star.style.top = Math.random() * 100 + '%';
            star.style.left = Math.random() * 100 + '%';
            star.style.opacity = Math.random();
            starContainer.appendChild(star);
        }

        window.addEventListener('scroll', () => {
            const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
            const scrollPercentClamped = Math.min(Math.max(scrollPercent, 0), 1);
            
            // 背景位置の更新 (bottom基準なので、scrollPercentが増えると上に移動)
            // 0%スクロール = background-position-y: 100% (Green)
            // 100%スクロール = background-position-y: 0% (Space)
            body.style.backgroundPosition = `center ${100 - (scrollPercentClamped * 100)}%`;

            // メーター更新
            meterIndicator.style.bottom = `${scrollPercentClamped * 100}%`;
            
            // 標高テキスト更新 (0m -> 3776m)
            const elevation = Math.round(scrollPercentClamped * 3776);
            elevationText.textContent = elevation;
        });