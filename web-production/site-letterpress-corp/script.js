// Background Typography Generation
        const bgContainer = document.getElementById('bg-types');
        const chars = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん文選活版印刷明朝ゴシック";
        
        for (let i = 0; i < 100; i++) {
            const span = document.createElement('span');
            span.textContent = chars[Math.floor(Math.random() * chars.length)];
            // ランダムに少し回転させたり透明度を変えたりする
            span.style.opacity = Math.random() * 0.5 + 0.1;
            span.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;
            bgContainer.appendChild(span);
        }

        // Loader Animation
        const loaderContainer = document.getElementById('loader-text-container');
        const loadText = "文選組版所";
        
        loadText.split('').forEach((char, index) => {
            const span = document.createElement('div');
            span.textContent = char;
            span.className = "text-2xl font-bold bg-lead text-paper w-10 h-10 flex items-center justify-center rounded-sm shadow-md animate-type-pick";
            span.style.animationDelay = `${index * 0.15}s`;
            loaderContainer.appendChild(span);
        });

        // Hide Loader
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loader = document.getElementById('loader');
                loader.style.opacity = '0';
                loader.style.transition = 'opacity 0.8s ease';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 800);
            }, 1500);
        });