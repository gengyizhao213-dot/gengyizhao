/* ========================================
   Digital Finance Center - UI 渲染模块
   负责所有界面渲染和交互
   ======================================== */

const UIManager = {
    formatPrice(price, decimals = 2) {
        if (price >= 1) return '$' + price.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
        if (price >= 0.01) return '$' + price.toFixed(4);
        if (price >= 0.0001) return '$' + price.toFixed(6);
        return '$' + price.toExponential(2);
    },

    formatPercent(value) {
        return (value > 0 ? '+' : '') + value.toFixed(2) + '%';
    },

    renderCryptoCard(crypto) {
        const isPositive = crypto.change24h >= 0;
        const changeClass = isPositive ? 'up' : 'down';
        return `
            <div class="asset-card slide-up" onclick="ChartManager.openChart('${crypto.symbol}', '${crypto.name}')">
                <div class="asset-card-header">
                    <span class="asset-symbol">${crypto.symbol}</span>
                    <span class="asset-change ${changeClass}">${isPositive ? '▲' : '▼'} ${this.formatPercent(crypto.change24h)}</span>
                </div>
                <div class="asset-price">${this.formatPrice(crypto.price)}</div>
                <div class="asset-name">${crypto.name}</div>
                <div class="asset-bar"><div class="asset-bar-fill ${changeClass}" style="width: ${Math.min(Math.abs(crypto.change24h * 5), 100)}%"></div></div>
            </div>
        `;
    },

    renderForexCard(forex) {
        const isPositive = forex.change >= 0;
        const changeClass = isPositive ? 'up' : 'down';
        return `
            <div class="asset-card slide-up" onclick="ChartManager.openChart('${forex.pair}', '${forex.pair}')">
                <div class="asset-card-header">
                    <span class="asset-symbol">${forex.pair}</span>
                    <span class="asset-change ${changeClass}">${isPositive ? '▲' : '▼'} ${this.formatPercent(parseFloat(forex.changePercent))}</span>
                </div>
                <div class="asset-price">${forex.price.toFixed(4)}</div>
                <div class="asset-name">Bid: ${forex.bid.toFixed(4)} | Ask: ${forex.ask.toFixed(4)}</div>
                <div class="asset-bar"><div class="asset-bar-fill ${changeClass}" style="width: ${Math.min(Math.abs(parseFloat(forex.changePercent) * 10), 100)}%"></div></div>
            </div>
        `;
    },

    renderCommodityCard(commodity) {
        const isPositive = commodity.change24h >= 0;
        const changeClass = isPositive ? 'up' : 'down';
        return `
            <div class="asset-card slide-up" onclick="ChartManager.openChart('${commodity.symbol}', '${commodity.name}')">
                <div class="asset-card-header">
                    <span class="asset-symbol">${commodity.symbol}</span>
                    <span class="asset-change ${changeClass}">${isPositive ? '▲' : '▼'} ${this.formatPercent(commodity.change24h)}</span>
                </div>
                <div class="asset-price">${this.formatPrice(commodity.price)}</div>
                <div class="asset-name">${commodity.name} (${commodity.unit})</div>
                <div class="asset-bar"><div class="asset-bar-fill ${changeClass}" style="width: ${Math.min(Math.abs(commodity.change24h * 5), 100)}%"></div></div>
            </div>
        `;
    },

    renderNewsItem(news) {
        return `
            <div class="news-item fade-in" onclick="window.open('${news.url}', '_blank')">
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

    updateTime() {
        const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        document.getElementById('beijingTime').textContent = new Date().toLocaleTimeString('zh-CN', { ...options, timeZone: 'Asia/Shanghai' });
        document.getElementById('tokyoTime').textContent = new Date().toLocaleTimeString('ja-JP', { ...options, timeZone: 'Asia/Tokyo' });
        document.getElementById('utcTime').textContent = new Date().toLocaleTimeString('en-US', { ...options, timeZone: 'UTC' });
    },

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type} toast-slide-in`;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => { toast.classList.add('toast-slide-out'); setTimeout(() => toast.remove(), 300); }, 3000);
    },

    hideLoader() {
        const loader = document.getElementById('pageLoader');
        if (loader) loader.classList.add('hidden');
    }
};

if (typeof module !== 'undefined' && module.exports) module.exports = UIManager;
