/* ========================================
   Digital Finance Center - 数据管理模块
   负责所有 API 调用和数据缓存
   ======================================== */

const DataManager = {
    cache: { crypto: null, forex: null, commodities: null, energy: null, stocks: null, news: null, ai: null },
    cacheTime: { crypto: 0, forex: 0, commodities: 0, energy: 0, stocks: 0, news: 0, ai: 0 },
    CACHE_DURATION: 60000,

    async getCryptoData() {
        if (this.cache.crypto && Date.now() - this.cacheTime.crypto < this.CACHE_DURATION) return this.cache.crypto;
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&sparkline=true&price_change_percentage=24h');
            const data = await response.json();
            const cryptoData = data.map(coin => ({
                id: coin.id, symbol: coin.symbol.toUpperCase(), name: coin.name,
                price: coin.current_price || 0, change24h: coin.price_change_percentage_24h || 0,
                image: coin.image, sparkline: coin.sparkline_in_7d?.price || []
            }));
            this.cache.crypto = cryptoData;
            this.cacheTime.crypto = Date.now();
            return cryptoData;
        } catch (error) { return this.getMockCryptoData(); }
    },

    async getForexData() {
        const pairs = ['USDJPY', 'EURUSD', 'GBPUSD', 'AUDUSD', 'USDCNY', 'USDCHF', 'USDCAD', 'NZDUSD'];
        const forexData = pairs.map(pair => {
            const base = this.getForexBasePrice(pair);
            const change = (Math.random() - 0.5) * 0.01;
            return { pair, price: base + change, change, changePercent: (change / base * 100).toFixed(2), bid: base + change - 0.0001, ask: base + change + 0.0001 };
        });
        return forexData;
    },

    async getCommoditiesData() {
        return [
            { name: '黄金', symbol: 'XAU', price: 2350.45 + (Math.random() - 0.5) * 10, change24h: 0.45, unit: 'USD/oz' },
            { name: '白银', symbol: 'XAG', price: 29.32 + (Math.random() - 0.5) * 0.5, change24h: -0.12, unit: 'USD/oz' }
        ];
    },

    async getEnergyData() {
        return [
            { name: 'WTI 原油', symbol: 'WTI', price: 78.45 + (Math.random() - 0.5) * 2, change24h: 1.25, unit: 'USD/bbl' },
            { name: '天然气', symbol: 'NG', price: 2.15 + (Math.random() - 0.5) * 0.1, change24h: -2.45, unit: 'USD/MMBtu' }
        ];
    },

    async getStocksData() {
        return [
            { name: '纳斯达克', symbol: 'IXIC', price: 16750.45, change24h: 1.15 },
            { name: '道琼斯', symbol: 'DJIA', price: 39500.20, change24h: 0.35 },
            { name: '标普 500', symbol: 'GSPC', price: 5250.80, change24h: 0.82 }
        ];
    },

    async getNewsData() {
        if (this.cache.news && Date.now() - this.cacheTime.news < 300000) return this.cache.news;
        const newsPool = [
            { title: '美联储维持利率不变，暗示年内可能仅降息一次', source: '华尔街日报', category: 'forex', description: '美联储在最新的政策会议上决定维持利率在5.25%-5.50%区间不变，主席鲍威尔强调通胀仍高于目标。' },
            { title: '比特币现货 ETF 录得连续 10 日净流入', source: '彭博社', category: 'crypto', description: '随着机构投资者兴趣增加，比特币现货 ETF 表现强劲，单日流入资金超过 2 亿美元。' },
            { title: '以太坊现货 ETF 获批预期升温，价格突破 $3,800', source: 'CoinDesk', category: 'crypto', description: '分析师认为 SEC 可能会在近期批准以太坊现货 ETF，这引发了市场的剧烈波动。' },
            { title: '欧佩克+讨论延长减产协议以支撑油价', source: '路透社', category: 'energy', description: '主要产油国正在考虑将现有的减产协议延长至 2024 年底，以应对全球需求疲软。' },
            { title: '英伟达市值突破 3 万亿美元，超越苹果', source: 'CNBC', category: 'stocks', description: '受 AI 芯片需求驱动，英伟达股价持续飙升，目前已成为全球市值第二大的公司。' }
        ];
        const newsData = newsPool.sort(() => 0.5 - Math.random()).map((item, index) => ({
            ...item, id: `news-${index}`, time: `${Math.floor(Math.random() * 60) + 1} 分钟前`,
            image: `https://picsum.photos/seed/${index + 20}/120/80`,
            url: 'https://www.investing.com/news/economy'
        }));
        this.cache.news = newsData;
        this.cacheTime.news = Date.now();
        return newsData;
    },

    async getAIAnalysisData() {
        return {
            sentiment: 65 + (Math.random() - 0.5) * 10, btcTrend: Math.random() > 0.4 ? 'bullish' : 'bearish',
            ethTrend: Math.random() > 0.3 ? 'bullish' : 'bearish', dxyValue: 104.5 + (Math.random() - 0.5),
            dxyChange: (Math.random() - 0.5) * 0.5, goldAnalysis: '黄金处于高位盘整，强支撑位在 $2300',
            oilAnalysis: '原油受地缘政治影响，短期看涨情绪较浓', fearIndex: 72, flowTrend: 'inflow'
        };
    },

    getForexBasePrice(pair) {
        const prices = { 'USDJPY': 156.5, 'EURUSD': 1.0850, 'GBPUSD': 1.2750, 'AUDUSD': 0.6650, 'USDCNY': 7.2400, 'USDCHF': 0.9050, 'USDCAD': 1.3650, 'NZDUSD': 0.6150 };
        return prices[pair] || 1.0;
    },

    getMockCryptoData() {
        return [{ id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 67234, change24h: 1.85, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' }];
    }
};

if (typeof module !== 'undefined' && module.exports) module.exports = DataManager;
