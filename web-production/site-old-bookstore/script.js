// 本のデータ生成
        const shelf = document.getElementById('shelf');
        const detailPanel = document.getElementById('detail-panel');
        const titleEl = document.getElementById('book-title');
        const authorEl = document.getElementById('book-author');
        const colors = ['book-red', 'book-blue', 'book-green', 'book-brown', 'book-black', 'book-brown', 'book-brown'];
        
        const titles = [
            "猫と哲学", "深夜の散歩", "失われた時計", "珈琲の淹れ方", "星を読む", 
            "雨の日の手紙", "錆びた鍵", "透明な魚", "月への梯子", "影の採集",
            "夢判断入門", "植物の言葉", "路地裏の地図", "砂の城", "銀河鉄道",
            "古道具目録", "未完の小説", "誰かの日記", "雲の図鑑", "沈黙の音"
        ];

        // 100冊の本をランダム生成
        for (let i = 0; i < 100; i++) {
            const book = document.createElement('div');
            book.classList.add('book-spine');
            
            // ランダムなスタイル
            const height = Math.floor(Math.random() * 80) + 180; // 180-260px
            const width = Math.floor(Math.random() * 20) + 30;   // 30-50px
            const colorClass = colors[Math.floor(Math.random() * colors.length)];
            const title = titles[Math.floor(Math.random() * titles.length)];
            
            book.style.height = `${height}px`;
            book.style.width = `${width}px`;
            book.classList.add(colorClass);
            book.innerText = title;

            // クリックイベント
            book.addEventListener('mouseenter', () => {
                titleEl.innerText = title;
                authorEl.innerText = "著者不明";
                detailPanel.classList.add('active');
            });

            shelf.appendChild(book);
        }

        // 埃パーティクル生成
        for(let i=0; i<30; i++) {
            const dust = document.createElement('div');
            dust.classList.add('dust-particle');
            dust.style.left = Math.random() * 100 + 'vw';
            dust.style.top = Math.random() * 100 + 'vh';
            dust.style.width = Math.random() * 3 + 'px';
            dust.style.height = dust.style.width;
            dust.style.animationDelay = Math.random() * 5 + 's';
            dust.style.animationDuration = (Math.random() * 10 + 10) + 's';
            document.body.appendChild(dust);
        }

        // Shelfから外れたら詳細を隠す
        shelf.addEventListener('mouseleave', () => {
            detailPanel.classList.remove('active');
        });