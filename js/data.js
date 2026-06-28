/* ========================================
   Digital Finance Center - 数据管理模块
   负责所有 API 调用和数据缓存
   ======================================== */

const DataManager = {
    cache: { crypto: null, forex: null, commodities: null, energy: null, stocks: null, news: null, ai: null },
    cacheTime: { crypto: 0, forex: 0, commodities: 0, energy: 0, stocks: 0, news: 0, ai: 0 },
    CACHE_DURATION: 60000,
    
    // 中文翻译映射
    chineseNames: {
        // 加密货币
        'bitcoin': '比特币',
        'ethereum': '以太坊',
        'binancecoin': '币安币',
        'cardano': '卡尔达诺',
        'solana': '索拉纳',
        'ripple': '瑞波币',
        'polkadot': '波卡',
        'dogecoin': '狗狗币',
        'litecoin': '莱特币',
        'chainlink': '链接币',
        'uniswap': '优尼斯瓦普',
        'avalanche-2': '雪崩币',
        'polygon': '多边形',
        'cosmos': '宇宙币',
        'near': '近协议',
        'monero': '门罗币',
        'zcash': '零币',
        'stellar': '恒星币',
        'tezos': '特佐斯',
        'algorand': '算法币',
        
        // 外汇对
        'EURUSD': '欧美',
        'GBPUSD': '英美',
        'USDJPY': '美日',
        'AUDUSD': '澳美',
        'USDCAD': '美加',
        'USDCNY': '美人民币',
        'USDCHF': '美瑞郎',
        'NZDUSD': '纽美',
        
        // 商品
        'XAU': '黄金',
        'XAG': '白银',
        'COPPER': '铜',
        'PLATINUM': '铂金',
        'PALLADIUM': '钯',
        
        // 能源
        'WTI': 'WTI原油',
        'BRENT': '布伦特原油',
        'NG': '天然气',
        'CRUDE': '原油',
        'NATGAS': '天然气',
        
        // 股票指数
        'SPX': '标普500',
        'INDU': '道琼斯',
        'IXIC': '纳斯达克',
        'CCMP': '纳指',
        'GSPC': '标普500',
        'DJIA': '道琼斯',
        'VIX': '恐慌指数',
        'FTSE': '富时100',
        'DAX': '德指',
        'HSI': '恒生指数',
        'N225': '日经225',
        'SSEC': '上证综指',
    },
    
    getChineseName(key) {
        return this.chineseNames[key] || key;
    },

    async getCryptoData() {
        if (this.cache.crypto && Date.now() - this.cacheTime.crypto < this.CACHE_DURATION) return this.cache.crypto;
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&sparkline=true&price_change_percentage=24h');
            const data = await response.json();
            const cryptoData = data.map(coin => {
                const chineseName = this.getChineseName(coin.id);
                return {
                    id: coin.id, symbol: coin.symbol.toUpperCase(), 
                    name: `${coin.name}（${chineseName}）`,
                    price: coin.current_price || 0, change24h: coin.price_change_percentage_24h || 0,
                    image: coin.image, sparkline: coin.sparkline_in_7d?.price || []
                };
            });
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
            const chineseName = this.getChineseName(pair);
            return { 
                pair: `${pair}（${chineseName}）`, 
                price: base + change, change, changePercent: (change / base * 100).toFixed(2), 
                bid: base + change - 0.0001, ask: base + change + 0.0001 
            };
        });
        return forexData;
    },

    async getCommoditiesData() {
        return [
            { name: 'Gold（黄金）', symbol: 'XAU', price: 2350.45 + (Math.random() - 0.5) * 10, change24h: 0.45, unit: 'USD/oz' },
            { name: 'Silver（白银）', symbol: 'XAG', price: 29.32 + (Math.random() - 0.5) * 0.5, change24h: -0.12, unit: 'USD/oz' },
            { name: 'Copper（铜）', symbol: 'COPPER', price: 4.25 + (Math.random() - 0.5) * 0.1, change24h: 0.35, unit: 'USD/lb' },
            { name: 'Platinum（铂金）', symbol: 'PLATINUM', price: 1025.50 + (Math.random() - 0.5) * 20, change24h: 0.25, unit: 'USD/oz' }
        ];
    },

    async getEnergyData() {
        return [
            { name: 'WTI Crude Oil（WTI原油）', symbol: 'WTI', price: 78.45 + (Math.random() - 0.5) * 2, change24h: 1.25, unit: 'USD/bbl' },
            { name: 'Brent Crude Oil（布伦特原油）', symbol: 'BRENT', price: 82.10 + (Math.random() - 0.5) * 2, change24h: 0.85, unit: 'USD/bbl' },
            { name: 'Natural Gas（天然气）', symbol: 'NG', price: 2.15 + (Math.random() - 0.5) * 0.1, change24h: -2.45, unit: 'USD/MMBtu' }
        ];
    },

    async getStocksData() {
        return [
            { name: 'S&P 500（标普500）', symbol: 'SPX', price: 5425.50, change24h: 0.75 },
            { name: 'Dow Jones（道琼斯）', symbol: 'INDU', price: 42150.25, change24h: 0.35 },
            { name: 'Nasdaq（纳斯达克）', symbol: 'CCMP', price: 17850.75, change24h: 1.25 },
            { name: 'VIX Index（恐慌指数）', symbol: 'VIX', price: 14.25, change24h: -2.15 },
            { name: 'FTSE 100（富时100）', symbol: 'FTSE', price: 8125.50, change24h: 0.45 },
            { name: 'DAX（德指）', symbol: 'DAX', price: 18450.75, change24h: 0.85 },
            { name: 'Hang Seng（恒生指数）', symbol: 'HSI', price: 17850.25, change24h: -0.35 },
            { name: 'Nikkei 225（日经225）', symbol: 'N225', price: 32500.50, change24h: 1.15 },
            { name: 'Shanghai Composite（上证综指）', symbol: 'SSEC', price: 3025.75, change24h: -0.25 }
        ];
    },

    async getNewsData() {
        if (this.cache.news && Date.now() - this.cacheTime.news < 300000) return this.cache.news;
        try {
            const newsItems = [];
            
            // 1. 从 Cointelegraph RSS 获取加密货币新闻
            try {
                const res1 = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://cointelegraph.com/rss&count=5');
                const data1 = await res1.json();
                if (data1.status === 'ok' && data1.items) {
                    data1.items.slice(0, 3).forEach((item, i) => {
                        newsItems.push({
                            title: item.title,
                            description: (item.description || item.content || '').substring(0, 150),
                            image: item.thumbnail || `https://picsum.photos/seed/${i}/300/200`,
                            source: 'Cointelegraph',
                            url: item.link,
                            time: this.formatNewsTime(new Date(item.pubDate)),
                            category: 'crypto'
                        });
                    });
                }
            } catch (e) { console.log('Cointelegraph 新闻获取失败'); }
            
            // 2. 从 CoinDesk RSS 获取金融新闻
            try {
                const res2 = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.coindesk.com/arc/outboundfeeds/rss/&count=5');
                const data2 = await res2.json();
                if (data2.status === 'ok' && data2.items) {
                    data2.items.slice(0, 3).forEach((item, i) => {
                        newsItems.push({
                            title: item.title,
                            description: (item.description || item.content || '').substring(0, 150),
                            image: item.thumbnail || `https://picsum.photos/seed/${i + 10}/300/200`,
                            source: 'CoinDesk',
                            url: item.link,
                            time: this.formatNewsTime(new Date(item.pubDate)),
                            category: 'crypto'
                        });
                    });
                }
            } catch (e) { console.log('CoinDesk 新闻获取失败'); }
            
            // 3. 从 WSJ RSS 获取市场新闻
            try {
                const res3 = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://feeds.a.dj.com/rss/RSSMarketsMain.xml&count=5');
                const data3 = await res3.json();
                if (data3.status === 'ok' && data3.items) {
                    data3.items.slice(0, 2).forEach((item, i) => {
                        newsItems.push({
                            title: item.title,
                            description: (item.description || item.content || '').substring(0, 150),
                            image: item.thumbnail || `https://picsum.photos/seed/${i + 20}/300/200`,
                            source: 'Wall Street Journal',
                            url: item.link,
                            time: this.formatNewsTime(new Date(item.pubDate)),
                            category: 'forex'
                        });
                    });
                }
            } catch (e) { console.log('WSJ 新闻获取失败'); }
            
            if (newsItems.length === 0) return this.getMockNewsData();
            this.cache.news = newsItems;
            this.cacheTime.news = Date.now();
            return newsItems;
        } catch (error) {
            console.error('获取新闻数据失败:', error);
            return this.getMockNewsData();
        }
    }
    
    formatNewsTime(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        if (minutes < 1) return '刚刚';
        if (minutes < 60) return `${minutes}分钟前`;
        if (hours < 24) return `${hours}小时前`;
        if (days < 7) return `${days}天前`;
        return date.toLocaleDateString('zh-CN');
    }
    
    getMockNewsData() {
        return [
            { title: '美联储维持利率不变，暗示年内可能仅降息一次', source: '华尔街日报', category: 'forex', description: '美联储在最新的政策会议上决定维持利率在5.25%-5.50%区间不变，主席鲍威尔强调通胀仍高于目标。', image: 'https://picsum.photos/seed/1/300/200', url: 'https://www.wsj.com', time: '2小时前' },
            { title: '比特币现货 ETF 录得连续 10 日净流入', source: '彭博社', category: 'crypto', description: '随着机构投资者兴趣增加，比特币现货 ETF 表现强劲，单日流入资金超过 2 亿美元。', image: 'https://picsum.photos/seed/2/300/200', url: 'https://www.bloomberg.com', time: '4小时前' },
            { title: '以太坊现货 ETF 获批预期升温，价格突破 $3,800', source: 'CoinDesk', category: 'crypto', description: '分析师认为 SEC 可能会在近期批准以太坊现货 ETF，这引发了市场的剧烈波动。', image: 'https://picsum.photos/seed/3/300/200', url: 'https://www.coindesk.com', time: '6小时前' }
        ];
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
        return [
            { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin（比特币）', price: 67234, change24h: 1.85, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
            { id: 'ethereum', symbol: 'ETH', name: 'Ethereum（以太坊）', price: 2250, change24h: 1.25, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' }
        ];
    }
};

if (typeof module !== 'undefined' && module.exports) module.exports = DataManager;
