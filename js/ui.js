/* ========================================
   Digital Finance Center - UI 渲染模块
   负责所有界面渲染和交互
   ======================================== */

const UIManager = {
    // 格式化价格
    formatPrice(price, decimals = 2) {
        if (price >= 1) return '$' + price.toFixed(decimals);
        if (price >= 0.01) return '$' + price.toFixed(4);
        if (price >= 0.0001) return '$' + price.toFixed(6);
        return '$' + price.toExponential(2);
    },

    // 格式化百分比
    formatPercent(value) {
        return (value > 0 ? '+' : '') + value.toFixed(2) + '%';
    },

    // 格式化数字
    formatNumber(num) {
        if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return num.toFixed(2);
    },

    // 渲染加密货币卡片
    renderCryptoCard(crypto) {
        const isPositive = crypto.change24h >= 0;
        const changeClass = isPositive ? 'up' : 'down';
        const arrow = isPositive ? '▲' : '▼';

        return `
            <div class="asset-card slide-up" onclick="ChartManager.openChart('${crypto.symbol}', '${crypto.name}')">
                <button class="asset-favorite" onclick="event.stopPropagation(); UIManager.toggleFavorite('${crypto.id}')">★</button>
                <div class="asset-card-header">
                    <span class="asset-symbol">${crypto.symbol}</span>
                    <span class="asset-change ${changeClass}">
                        ${arrow} ${this.formatPercent(crypto.change24h)}
                    </span>
                </div>
                <div class="asset-price">${this.formatPrice(crypto.price)}</div>
                <div class="asset-name">${crypto.name}</div>
                <div class="asset-bar">
                    <div class="asset-bar-fill ${changeClass}" style="width: ${Math.min(Math.abs(crypto.change24h), 100)}%"></div>
                </div>
            </div>
        `;
    },

    // 渲染外汇卡片
    renderForexCard(forex) {
        const isPositive = forex.change >= 0;
        const changeClass = isPositive ? 'up' : 'down';

        return `
            <div class="asset-card slide-up" onclick="ChartManager.openChart('${forex.pair}', '${forex.pair}')">
                <div class="asset-card-header">
                    <span class="asset-symbol">${forex.pair}</span>
                    <span class="asset-change ${changeClass}">
                        ${isPositive ? '▲' : '▼'} ${this.formatPercent(parseFloat(forex.changePercent))}
                    </span>
                </div>
                <div class="asset-price">${forex.price.toFixed(4)}</div>
                <div class="asset-name">Bid: ${forex.bid.toFixed(4)} | Ask: ${forex.ask.toFixed(4)}</div>
                <div class="asset-bar">
                    <div class="asset-bar-fill ${changeClass}" style="width: ${Math.min(Math.abs(parseFloat(forex.changePercent)), 100)}%"></div>
                </div>
            </div>
        `;
    },

    // 渲染商品卡片
    renderCommodityCard(commodity) {
        const isPositive = commodity.change24h >= 0;
        const changeClass = isPositive ? 'up' : 'down';

        return `
            <div class="asset-card slide-up" onclick="ChartManager.openChart('${commodity.symbol}', '${commodity.name}')">
                <div class="asset-card-header">
                    <span class="asset-symbol">${commodity.symbol}</span>
                    <span class="asset-change ${changeClass}">
                        ${isPositive ? '▲' : '▼'} ${this.formatPercent(commodity.change24h)}
                    </span>
                </div>
                <div class="asset-price">${this.formatPrice(commodity.price)}</div>
                <div class="asset-name">${commodity.name} (${commodity.unit})</div>
                <div class="asset-bar">
                    <div class="asset-bar-fill ${changeClass}" style="width: ${Math.min(Math.abs(commodity.change24h), 100)}%"></div>
                </div>
            </div>
        `;
    },

    // 渲染新闻项目
    renderNewsItem(news) {
        return `
            <div class="news-item fade-in">
                <img src="${news.image}" alt="${news.title}" class="news-image">
                <div class="news-content">
                    <div class="news-title">${news.title}</div>
                    <div class="news-description">${news.description}</div>
                    <div class="news-meta">
                        <span class="news-source">${news.source}</span>
                        <span class="news-time">${news.time}</span>
                    </div>
                </div>
            </div>
        `;
    },

    // 更新时间显示
    updateTime() {
        // 北京时间
        const beijingTime = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false });
        document.getElementById('beijingTime').textContent = beijingTime.split(' ')[1];

        // 东京时间
        const tokyoTime = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', hour12: false });
        document.getElementById('tokyoTime').textContent = tokyoTime.split(' ')[1];

        // UTC 时间
        const utcTime = new Date().toLocaleString('en-US', { timeZone: 'UTC', hour12: false });
        document.getElementById('utcTime').textContent = utcTime.split(' ')[1];
    },

    // 显示 Toast 通知
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type} toast-slide-in`;
        toast.textContent = message;

        container.appendChild(toast);

        // 3 秒后自动移除
        setTimeout(() => {
            toast.classList.add('toast-slide-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // 切换收藏
    toggleFavorite(id) {
        let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const index = favorites.indexOf(id);

        if (index > -1) {
            favorites.splice(index, 1);
            this.showToast('已取消收藏', 'info');
        } else {
            favorites.push(id);
            this.showToast('已添加到收藏', 'success');
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
    },

    // 隐藏加载器
    hideLoader() {
        const loader = document.getElementById('pageLoader');
        if (loader) {
            loader.classList.add('hidden');
        }
    },
};

// 导出 UI 管理器
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
}
