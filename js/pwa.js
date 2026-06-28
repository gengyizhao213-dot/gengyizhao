/* ========================================
   Digital Finance Center - PWA 配置
   Service Worker 和离线支持
   ======================================== */

// 注册 Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker 已注册'))
            .catch(err => console.log('Service Worker 注册失败:', err));
    });
}

// PWA 安装提示
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

// 应用主程序逻辑
const App = {
    // 初始化应用
    async init() {
        // 更新时间
        UIManager.updateTime();
        setInterval(() => UIManager.updateTime(), 1000);

        // 加载数据
        await this.loadAllData();

        // 隐藏加载器
        UIManager.hideLoader();

        // 设置事件监听
        this.setupEventListeners();

        // 自动刷新数据
        setInterval(() => this.loadAllData(), 60000);
    },

    // 加载所有数据
    async loadAllData() {
        try {
            // 并行加载所有数据
            const [crypto, forex, commodities, energy, stocks, news, ai] = await Promise.all([
                DataManager.getCryptoData(),
                DataManager.getForexData(),
                DataManager.getCommoditiesData(),
                DataManager.getEnergyData(),
                DataManager.getStocksData(),
                DataManager.getNewsData(),
                DataManager.getAIAnalysisData(),
            ]);

            // 渲染各个部分
            this.renderCrypto(crypto);
            this.renderForex(forex);
            this.renderCommodities(commodities);
            this.renderEnergy(energy);
            this.renderStocks(stocks);
            this.renderNews(news);
            this.renderAI(ai);

            // 更新统计数据
            this.updateStats(crypto, forex, stocks);
        } catch (error) {
            console.error('数据加载失败:', error);
            UIManager.showToast('数据加载失败，请重试', 'error');
        }
    },

    // 渲染加密货币
    renderCrypto(data) {
        const grid = document.getElementById('cryptoGrid');
        grid.innerHTML = data.map(c => UIManager.renderCryptoCard(c)).join('');
        document.getElementById('cryptoUpdateTime').textContent = new Date().toLocaleTimeString('zh-CN');
        document.getElementById('cryptoCount').textContent = data.length;
    },

    // 渲染外汇
    renderForex(data) {
        const grid = document.getElementById('forexGrid');
        grid.innerHTML = data.map(f => UIManager.renderForexCard(f)).join('');
        document.getElementById('forexUpdateTime').textContent = new Date().toLocaleTimeString('zh-CN');
        document.getElementById('forexCount').textContent = data.length;
    },

    // 渲染商品
    renderCommodities(data) {
        const grid = document.getElementById('commoditiesGrid');
        grid.innerHTML = data.map(c => UIManager.renderCommodityCard(c)).join('');
    },

    // 渲染能源
    renderEnergy(data) {
        const grid = document.getElementById('energyGrid');
        grid.innerHTML = data.map(e => UIManager.renderCommodityCard(e)).join('');
    },

    // 渲染股票
    renderStocks(data) {
        const grid = document.getElementById('stocksGrid');
        grid.innerHTML = data.map(s => UIManager.renderCommodityCard(s)).join('');
        document.getElementById('stockCount').textContent = data.length;
    },

    // 渲染新闻
    renderNews(data) {
        const list = document.getElementById('newsList');
        list.innerHTML = data.map(n => UIManager.renderNewsItem(n)).join('');
    },

    // 渲染 AI 分析
    renderAI(data) {
        // 市场情绪
        const sentimentBar = document.getElementById('sentimentBar');
        sentimentBar.style.width = data.sentiment + '%';
        document.getElementById('sentimentLabel').textContent = 
            data.sentiment > 60 ? '贪婪' : data.sentiment > 40 ? '中立' : '恐惧';

        // 恐慌指数
        const fearGauge = document.getElementById('fearGauge');
        const fearFill = fearGauge.querySelector('.fear-gauge-fill') || 
            (() => { const div = document.createElement('div'); div.className = 'fear-gauge-fill'; fearGauge.appendChild(div); return div; })();
        fearFill.style.width = data.fearIndex + '%';
        document.getElementById('fearValue').textContent = Math.round(data.fearIndex);

        // 其他分析
        document.getElementById('btcTrend').textContent = data.btcTrend === 'bullish' ? '看涨' : '看跌';
        document.getElementById('ethTrend').textContent = data.ethTrend === 'bullish' ? '看涨' : '看跌';
        document.getElementById('dxyValue').textContent = data.dxyValue.toFixed(2);
        document.getElementById('dxyChange').textContent = UIManager.formatPercent(data.dxyChange);
        document.getElementById('goldAnalysis').textContent = data.goldAnalysis;
        document.getElementById('oilAnalysis').textContent = data.oilAnalysis;
    },

    // 更新统计数据
    updateStats(crypto, forex, stocks) {
        document.getElementById('cryptoCount').textContent = crypto.length;
        document.getElementById('forexCount').textContent = forex.length;
        document.getElementById('stockCount').textContent = stocks.length;
    },

    // 设置事件监听
    setupEventListeners() {
        // 导航菜单
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        });

        // 刷新按钮
        document.getElementById('cryptoRefresh').addEventListener('click', () => this.loadAllData());
        document.getElementById('forexRefresh').addEventListener('click', () => this.loadAllData());
        document.getElementById('commoditiesRefresh').addEventListener('click', () => this.loadAllData());
        document.getElementById('energyRefresh').addEventListener('click', () => this.loadAllData());
        document.getElementById('stocksRefresh').addEventListener('click', () => this.loadAllData());

        // 图表抽屉关闭
        document.getElementById('drawerClose').addEventListener('click', () => ChartManager.closeChart());

        // 时间框架按钮
        document.querySelectorAll('.timeframe-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.timeframe-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                ChartManager.changeTimeframe(btn.dataset.timeframe);
            });
        });

        // 返回顶部
        document.getElementById('scrollToTop').addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // 主题切换
        document.getElementById('themeToggle').addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
        });
    },
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => App.init());
