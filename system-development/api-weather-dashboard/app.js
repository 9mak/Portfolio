class WeatherDashboard {
    constructor() {
        // 無料のOpenWeatherMap APIを使用（制限あり）
        // 実際の使用時はユーザー自身のAPIキーを取得してください
        this.apiKey = 'demo'; // デモ用（実際には機能しません）
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
        this.favorites = JSON.parse(localStorage.getItem('weather_favorites') || '[]');
        this.currentCity = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderFavorites();
        this.showDemoData();
    }

    setupEventListeners() {
        document.getElementById('searchBtn').addEventListener('click', () => {
            this.searchWeather();
        });

        document.getElementById('cityInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchWeather();
            }
        });

        document.getElementById('geoBtn').addEventListener('click', () => {
            this.getLocationWeather();
        });

        document.querySelectorAll('.city-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const city = e.target.dataset.city;
                document.getElementById('cityInput').value = city;
                this.searchWeather();
            });
        });

        document.getElementById('addFavorite')?.addEventListener('click', () => {
            this.addToFavorites();
        });
    }

    async searchWeather() {
        const city = document.getElementById('cityInput').value.trim();
        if (!city) {
            this.showNotification('都市名を入力してください', 'error');
            return;
        }

        try {
            document.getElementById('searchBtn').disabled = true;
            await this.fetchWeatherData(city);
        } catch (error) {
            this.showNotification('天気情報の取得に失敗しました', 'error');
            console.error(error);
        } finally {
            document.getElementById('searchBtn').disabled = false;
        }
    }

    async getLocationWeather() {
        if (!navigator.geolocation) {
            this.showNotification('位置情報がサポートされていません', 'error');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                await this.fetchWeatherByCoords(latitude, longitude);
            },
            (error) => {
                this.showNotification('位置情報の取得に失敗しました', 'error');
                console.error(error);
            }
        );
    }

    async fetchWeatherData(city) {
        // デモモード: 実際のAPIを使わずにサンプルデータを表示
        this.showNotification('デモモード: サンプルデータを表示しています', 'info');
        this.displayWeatherData(this.getSampleData(city));
        this.displayForecast(this.getSampleForecast());
    }

    async fetchWeatherByCoords(lat, lon) {
        // デモモード
        this.showNotification('デモモード: 現在地の天気を表示', 'info');
        this.displayWeatherData(this.getSampleData('現在地'));
        this.displayForecast(this.getSampleForecast());
    }

    getSampleData(city) {
        const weatherTypes = [
            { desc: '晴れ', icon: '01d', temp: 25 },
            { desc: '曇り', icon: '02d', temp: 20 },
            { desc: '小雨', icon: '10d', temp: 18 },
            { desc: '晴れ時々曇り', icon: '03d', temp: 22 }
        ];
        const weather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];

        return {
            name: city,
            main: {
                temp: weather.temp + Math.floor(Math.random() * 5),
                feels_like: weather.temp - 2,
                humidity: 60 + Math.floor(Math.random() * 30),
            },
            weather: [
                {
                    description: weather.desc,
                    icon: weather.icon
                }
            ],
            wind: {
                speed: 3 + Math.random() * 5
            },
            clouds: {
                all: Math.floor(Math.random() * 100)
            },
            sys: {
                sunrise: Date.now() / 1000 - 6 * 3600,
                sunset: Date.now() / 1000 + 6 * 3600
            }
        };
    }

    getSampleForecast() {
        const days = ['月', '火', '水', '木', '金'];
        const weatherTypes = [
            { desc: '晴れ', icon: '01d' },
            { desc: '曇り', icon: '02d' },
            { desc: '雨', icon: '10d' },
            { desc: '晴れ時々曇り', icon: '03d' }
        ];

        return {
            list: days.map((day, index) => {
                const weather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
                return {
                    dt: Date.now() / 1000 + (index + 1) * 86400,
                    main: {
                        temp: 18 + Math.floor(Math.random() * 10)
                    },
                    weather: [weather]
                };
            })
        };
    }

    displayWeatherData(data) {
        this.currentCity = data.name;

        document.getElementById('cityName').textContent = data.name;
        document.getElementById('currentTime').textContent = new Date().toLocaleString('ja-JP');
        document.getElementById('temperature').textContent = Math.round(data.main.temp);
        document.getElementById('weatherDescription').textContent = data.weather[0].description;
        document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        document.getElementById('humidity').textContent = `${data.main.humidity}%`;
        document.getElementById('windSpeed').textContent = `${data.wind.speed.toFixed(1)} m/s`;
        document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°C`;
        document.getElementById('clouds').textContent = `${data.clouds.all}%`;
        document.getElementById('sunrise').textContent = this.formatTime(data.sys.sunrise);
        document.getElementById('sunset').textContent = this.formatTime(data.sys.sunset);

        document.getElementById('currentWeather').style.display = 'block';
        document.getElementById('addFavorite').style.display = 'block';
    }

    displayForecast(data) {
        const forecastList = document.getElementById('forecastList');

        forecastList.innerHTML = data.list.map(item => `
            <div class="forecast-item">
                <div class="forecast-date">${this.formatDate(item.dt)}</div>
                <div class="forecast-icon">
                    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="Weather">
                </div>
                <div class="forecast-temp">${Math.round(item.main.temp)}°C</div>
                <div class="forecast-desc">${item.weather[0].description}</div>
            </div>
        `).join('');

        document.getElementById('forecast').style.display = 'block';
    }

    addToFavorites() {
        if (!this.currentCity) return;

        if (this.favorites.some(fav => fav.city === this.currentCity)) {
            this.showNotification('既にお気に入りに追加されています', 'info');
            return;
        }

        this.favorites.push({
            city: this.currentCity,
            addedAt: Date.now()
        });

        localStorage.setItem('weather_favorites', JSON.stringify(this.favorites));
        this.renderFavorites();
        this.showNotification('お気に入りに追加しました', 'success');
    }

    renderFavorites() {
        const favoritesList = document.getElementById('favoritesList');

        if (this.favorites.length === 0) {
            favoritesList.innerHTML = '<p class="empty-state">お気に入りの都市がありません</p>';
            return;
        }

        favoritesList.innerHTML = this.favorites.map((fav, index) => `
            <div class="favorite-item" data-city="${fav.city}">
                <div class="favorite-info">
                    <h4>${fav.city}</h4>
                    <p class="favorite-temp">クリックして表示</p>
                </div>
                <button class="btn-remove" data-index="${index}">削除</button>
            </div>
        `).join('');

        document.querySelectorAll('.favorite-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('btn-remove')) {
                    const city = e.currentTarget.dataset.city;
                    document.getElementById('cityInput').value = city;
                    this.searchWeather();
                }
            });
        });

        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(e.target.dataset.index);
                this.removeFromFavorites(index);
            });
        });
    }

    removeFromFavorites(index) {
        this.favorites.splice(index, 1);
        localStorage.setItem('weather_favorites', JSON.stringify(this.favorites));
        this.renderFavorites();
        this.showNotification('お気に入りから削除しました', 'success');
    }

    formatTime(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    }

    formatDate(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', weekday: 'short' });
    }

    showDemoData() {
        const demoNotice = document.createElement('div');
        demoNotice.style.cssText = `
            background: #fef3c7;
            color: #92400e;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            text-align: center;
            font-weight: 600;
        `;
        demoNotice.innerHTML = `
            ⚠️ デモモード: サンプルデータを表示しています<br>
            <small style="font-weight: normal;">実際に使用するには <a href="https://openweathermap.org/api" target="_blank" style="color: #2563eb;">OpenWeatherMap API</a> のキーを取得してください</small>
        `;
        document.querySelector('.container').insertBefore(demoNotice, document.querySelector('.search-section'));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        if (!document.getElementById('notification-styles')) {
            style.id = 'notification-styles';
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WeatherDashboard();
});
