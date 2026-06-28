/* ========================================
   Digital Finance Center - 数据管理模块
   负责所有 API 调用和数据缓存
   ======================================== */

// 数据管理对象
const DataManager = {
    // 缓存配置
    cache: {
        crypto: null,
        forex: null,
        commodities: null,
        energy: null,
        stocks: null,
        news: null,
        ai: null,
    },

    // 缓存时间戳
    cacheTime: {
        crypto: 0,
        forex: 0,
        commodities: 0,
        energy: 0,
        stocks: 0,
        news: 0,
        ai: 0,
    },

    // 缓存过期时间（毫秒）
    CACHE_DURATION: 60000, // 60 秒

    // 获取加密货币数据
    async getCryptoData() {
        // 检查缓存是否有效
        if (this.cache.crypto && Date.now() - this.cacheTime.crypto < this.CACHE_DURATION) {
            return this.cache.crypto;
        }

        try {
            // 尝试从 CoinGecko API 获取数据
            const response = await fetch(
                'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&sparkline=true&price_change_percentage=24h'
            );
            const data = await response.json();

            // 转换数据格式
            const cryptoData = data.map(coin => ({
                id: coin.id,
                symbol: coin.symbol.toUpperCase(),
                name: coin.name,
                price: coin.current_price || 0,
                change24h: coin.price_change_percentage_24h || 0,
                marketCap: coin.market_cap || 0,
                volume: coin.total_volume || 0,
                image: coin.image,
                sparkline: coin.sparkline_in_7d?.price || [],
            }));

            // 缓存数据
            this.cache.crypto = cryptoData;
            this.cacheTime.crypto = Date.now();

            return cryptoData;
        } catch (error) {
            // 如果 API 失败，返回模拟数据
            console.warn('CoinGecko API 失败，使用模拟数据:', error);
            return this.getMockCryptoData();
        }
    },

    // 获取外汇数据
    async getForexData() {
        // 检查缓存是否有效
        if (this.cache.forex && Date.now() - this.cacheTime.forex < this.CACHE_DURATION) {
            return this.cache.forex;
        }

        try {
            // 外汇对列表
            const pairs = ['USDJPY', 'EURUSD', 'GBPUSD', 'AUDUSD', 'USDCNY', 'USDCHF', 'USDCAD', 'NZDUSD'];

            // 模拟获取外汇数据
            const forexData = pairs.map(pair => {
                const basePrice = this.getForexBasePrice(pair);
                const change = (Math.random() - 0.5) * 2; // -1 到 1 之间的随机变化
                return {
                    pair: pair,
                    price: basePrice + change,
                    change: change,
                    changePercent: (change / basePrice * 100).toFixed(2),
                    bid: basePrice + change - 0.0001,
                    ask: basePrice + change + 0.0001,
                };
            });

            // 缓存数据
            this.cache.forex = forexData;
            this.cacheTime.forex = Date.now();

            return forexData;
        } catch (error) {
            console.warn('外汇数据获取失败:', error);
            return this.getMockForexData();
        }
    },

    // 获取贵金属数据
    async getCommoditiesData() {
        // 检查缓存是否有效
        if (this.cache.commodities && Date.now() - this.cacheTime.commodities < this.CACHE_DURATION) {
            return this.cache.commodities;
        }

        try {
            // 从 CoinGecko 获取贵金属数据
            const response = await fetch(
                'https://api.coingecko.com/api/v3/simple/price?ids=gold,silver,platinum,palladium&vs_currencies=usd&include_24hr_change=true'
            );
            const data = await response.json();

            // 转换数据格式
            const commoditiesData = [
                {
                    name: 'Gold',
                    symbol: 'XAU',
                    price: data.gold?.usd || 2000,
                    change24h: data.gold?.usd_24h_change || 0,
                    unit: 'USD/oz',
                },
                {
                    name: 'Silver',
                    symbol: 'XAG',
                    price: data.silver?.usd || 25,
                    change24h: data.silver?.usd_24h_change || 0,
                    unit: 'USD/oz',
                },
                {
                    name: 'Platinum',
                    symbol: 'XPT',
                    price: data.platinum?.usd || 1000,
                    change24h: data.platinum?.usd_24h_change || 0,
                    unit: 'USD/oz',
                },
                {
                    name: 'Palladium',
                    symbol: 'XPD',
                    price: data.palladium?.usd || 1200,
                    change24h: data.palladium?.usd_24h_change || 0,
                    unit: 'USD/oz',
                },
            ];

            // 缓存数据
            this.cache.commodities = commoditiesData;
            this.cacheTime.commodities = Date.now();

            return commoditiesData;
        } catch (error) {
            console.warn('贵金属数据获取失败:', error);
            return this.getMockCommoditiesData();
        }
    },

    // 获取能源数据
    async getEnergyData() {
        // 检查缓存是否有效
        if (this.cache.energy && Date.now() - this.cacheTime.energy < this.CACHE_DURATION) {
            return this.cache.energy;
        }

        try {
            // 模拟能源数据
            const energyData = [
                {
                    name: 'WTI Crude Oil',
                    symbol: 'WTI',
                    price: 75.5 + (Math.random() - 0.5) * 5,
                    change24h: (Math.random() - 0.5) * 2,
                    unit: 'USD/bbl',
                },
                {
                    name: 'Brent Crude Oil',
                    symbol: 'BRENT',
                    price: 82.3 + (Math.random() - 0.5) * 5,
                    change24h: (Math.random() - 0.5) * 2,
                    unit: 'USD/bbl',
                },
                {
                    name: 'Natural Gas',
                    symbol: 'NG',
                    price: 2.8 + (Math.random() - 0.5) * 0.5,
                    change24h: (Math.random() - 0.5) * 2,
                    unit: 'USD/MMBtu',
                },
            ];

            // 缓存数据
            this.cache.energy = energyData;
            this.cacheTime.energy = Date.now();

            return energyData;
        } catch (error) {
            console.warn('能源数据获取失败:', error);
            return this.getMockEnergyData();
        }
    },

    // 获取股票指数数据
    async getStocksData() {
        // 检查缓存是否有效
        if (this.cache.stocks && Date.now() - this.cacheTime.stocks < this.CACHE_DURATION) {
            return this.cache.stocks;
        }

        try {
            // 模拟股票指数数据
            const stocksData = [
                { name: 'NASDAQ', symbol: 'IXIC', price: 18500 + Math.random() * 100, change24h: (Math.random() - 0.5) * 2 },
                { name: 'Dow Jones', symbol: 'DJIA', price: 40000 + Math.random() * 100, change24h: (Math.random() - 0.5) * 2 },
                { name: 'S&P 500', symbol: 'GSPC', price: 5400 + Math.random() * 50, change24h: (Math.random() - 0.5) * 2 },
                { name: 'Nikkei 225', symbol: 'N225', price: 38000 + Math.random() * 200, change24h: (Math.random() - 0.5) * 2 },
                { name: 'Hang Seng', symbol: 'HSI', price: 18000 + Math.random() * 100, change24h: (Math.random() - 0.5) * 2 },
                { name: 'Shanghai', symbol: 'SSEC', price: 3200 + Math.random() * 50, change24h: (Math.random() - 0.5) * 2 },
                { name: 'Shenzhen', symbol: 'SZSC', price: 11000 + Math.random() * 100, change24h: (Math.random() - 0.5) * 2 },
                { name: 'DAX', symbol: 'GDAXI', price: 18500 + Math.random() * 100, change24h: (Math.random() - 0.5) * 2 },
                { name: 'CAC40', symbol: 'FCHI', price: 7500 + Math.random() * 50, change24h: (Math.random() - 0.5) * 2 },
            ];

            // 缓存数据
            this.cache.stocks = stocksData;
            this.cacheTime.stocks = Date.now();

            return stocksData;
        } catch (error) {
            console.warn('股票数据获取失败:', error);
            return this.getMockStocksData();
        }
    },

    // 获取新闻数据
    async getNewsData() {
        // 检查缓存是否有效
        if (this.cache.news && Date.now() - this.cacheTime.news < this.CACHE_DURATION * 5) {
            return this.cache.news;
        }

        try {
            // 模拟新闻数据
            const newsData = [
                {
                    title: 'BTC 突破 $90,000 创历史新高',
                    description: '比特币在今日交易中创造了新的历史记录，突破 $90,000 大关...',
                    source: 'Crypto News',
                    time: '2 小时前',
                    image: 'https://via.placeholder.com/120x80?text=BTC',
                    category: 'crypto',
                },
                {
                    title: '美元指数跌至三个月低点',
                    description: '美元指数在今日下跌，创造了三个月以来的最低水平...',
                    source: 'Forex News',
                    time: '4 小时前',
                    image: 'https://via.placeholder.com/120x80?text=USD',
                    category: 'forex',
                },
                {
                    title: '黄金价格创新高',
                    description: '国际黄金价格继续上升，创造了新的历史高点...',
                    source: 'Gold News',
                    time: '6 小时前',
                    image: 'https://via.placeholder.com/120x80?text=Gold',
                    category: 'commodities',
                },
                {
                    title: 'S&P 500 创历史新高',
                    description: 'S&P 500 指数在今日收盘时创造了新的历史记录...',
                    source: 'Stock News',
                    time: '8 小时前',
                    image: 'https://via.placeholder.com/120x80?text=SP500',
                    category: 'stocks',
                },
            ];

            // 缓存数据
            this.cache.news = newsData;
            this.cacheTime.news = Date.now();

            return newsData;
        } catch (error) {
            console.warn('新闻数据获取失败:', error);
            return this.getMockNewsData();
        }
    },

    // 获取 AI 分析数据
    async getAIAnalysisData() {
        // 检查缓存是否有效
        if (this.cache.ai && Date.now() - this.cacheTime.ai < this.CACHE_DURATION) {
            return this.cache.ai;
        }

        try {
            // 生成 AI 分析数据
            const aiData = {
                sentiment: Math.random() * 100, // 0-100，50 为中立
                btcTrend: Math.random() > 0.5 ? 'bullish' : 'bearish',
                ethTrend: Math.random() > 0.5 ? 'bullish' : 'bearish',
                dxyValue: 103.5 + (Math.random() - 0.5) * 2,
                dxyChange: (Math.random() - 0.5) * 2,
                goldAnalysis: '黄金处于上升趋势，建议关注 $2000 支撑位',
                oilAnalysis: '原油在高位震荡，关注 OPEC 会议动态',
                fearIndex: Math.random() * 100, // 0-100，50 为中立
                flowTrend: Math.random() > 0.5 ? 'inflow' : 'outflow',
            };

            // 缓存数据
            this.cache.ai = aiData;
            this.cacheTime.ai = Date.now();

            return aiData;
        } catch (error) {
            console.warn('AI 分析数据获取失败:', error);
            return this.getMockAIData();
        }
    },

    // 获取外汇基础价格
    getForexBasePrice(pair) {
        const prices = {
            'USDJPY': 150.5,
            'EURUSD': 1.0850,
            'GBPUSD': 1.2650,
            'AUDUSD': 0.6750,
            'USDCNY': 7.2500,
            'USDCHF': 0.8850,
            'USDCAD': 1.3650,
            'NZDUSD': 0.6050,
        };
        return prices[pair] || 1.0;
    },

    // 模拟加密货币数据
    getMockCryptoData() {
        return [
            { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 87234, change24h: 1.85, marketCap: 1700000000000, volume: 45000000000, image: 'https://via.placeholder.com/24', sparkline: [] },
            { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 3215, change24h: 2.10, marketCap: 385000000000, volume: 22000000000, image: 'https://via.placeholder.com/24', sparkline: [] },
            { id: 'binancecoin', symbol: 'BNB', name: 'BNB', price: 612, change24h: -0.45, marketCap: 93000000000, volume: 2500000000, image: 'https://via.placeholder.com/24', sparkline: [] },
            { id: 'solana', symbol: 'SOL', name: 'Solana', price: 142.30, change24h: -3.21, marketCap: 65000000000, volume: 3200000000, image: 'https://via.placeholder.com/24', sparkline: [] },
            { id: 'ripple', symbol: 'XRP', name: 'XRP', price: 2.48, change24h: 6.78, marketCap: 135000000000, volume: 5600000000, image: 'https://via.placeholder.com/24', sparkline: [] },
        ];
    },

    // 模拟外汇数据
    getMockForexData() {
        return [
            { pair: 'USDJPY', price: 150.5, change: 0.2, changePercent: '0.13', bid: 150.49, ask: 150.51 },
            { pair: 'EURUSD', price: 1.0850, change: 0.0015, changePercent: '0.14', bid: 1.0849, ask: 1.0851 },
            { pair: 'GBPUSD', price: 1.2650, change: 0.0020, changePercent: '0.16', bid: 1.2649, ask: 1.2651 },
            { pair: 'AUDUSD', price: 0.6750, change: -0.0010, changePercent: '-0.15', bid: 0.6749, ask: 0.6751 },
            { pair: 'USDCNY', price: 7.2500, change: 0.0050, changePercent: '0.07', bid: 7.2499, ask: 7.2501 },
        ];
    },

    // 模拟贵金属数据
    getMockCommoditiesData() {
        return [
            { name: 'Gold', symbol: 'XAU', price: 2000, change24h: 0.5, unit: 'USD/oz' },
            { name: 'Silver', symbol: 'XAG', price: 25, change24h: -0.2, unit: 'USD/oz' },
            { name: 'Platinum', symbol: 'XPT', price: 1000, change24h: 0.3, unit: 'USD/oz' },
            { name: 'Palladium', symbol: 'XPD', price: 1200, change24h: -0.5, unit: 'USD/oz' },
        ];
    },

    // 模拟能源数据
    getMockEnergyData() {
        return [
            { name: 'WTI Crude Oil', symbol: 'WTI', price: 75.5, change24h: 0.8, unit: 'USD/bbl' },
            { name: 'Brent Crude Oil', symbol: 'BRENT', price: 82.3, change24h: 1.2, unit: 'USD/bbl' },
            { name: 'Natural Gas', symbol: 'NG', price: 2.8, change24h: -0.3, unit: 'USD/MMBtu' },
        ];
    },

    // 模拟股票数据
    getMockStocksData() {
        return [
            { name: 'NASDAQ', symbol: 'IXIC', price: 18500, change24h: 0.5 },
            { name: 'Dow Jones', symbol: 'DJIA', price: 40000, change24h: 0.3 },
            { name: 'S&P 500', symbol: 'GSPC', price: 5400, change24h: 0.4 },
            { name: 'Nikkei 225', symbol: 'N225', price: 38000, change24h: 0.2 },
            { name: 'Hang Seng', symbol: 'HSI', price: 18000, change24h: -0.5 },
        ];
    },

    // 模拟新闻数据
    getMockNewsData() {
        return [
            { title: 'BTC 突破新高', description: '比特币创造新的历史记录...', source: 'Crypto News', time: '2 小时前', image: 'https://via.placeholder.com/120x80', category: 'crypto' },
            { title: '美元指数下跌', description: '美元指数创造三个月低点...', source: 'Forex News', time: '4 小时前', image: 'https://via.placeholder.com/120x80', category: 'forex' },
        ];
    },

    // 模拟 AI 分析数据
    getMockAIData() {
        return {
            sentiment: 65,
            btcTrend: 'bullish',
            ethTrend: 'bullish',
            dxyValue: 103.5,
            dxyChange: 0.2,
            goldAnalysis: '黄金处于上升趋势',
            oilAnalysis: '原油在高位震荡',
            fearIndex: 45,
            flowTrend: 'inflow',
        };
    },
};

// 导出数据管理器
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
}
