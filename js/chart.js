/* ========================================
   Digital Finance Center - TradingView 图表集成
   ======================================== */

const ChartManager = {
    // 当前图表符号
    currentSymbol: null,
    currentTimeframe: '1D',
    widget: null,

    // 符号映射表
    symbolMap: {
        // 加密货币
        'BTC': 'BINANCE:BTCUSDT',
        'ETH': 'BINANCE:ETHUSDT',
        'BNB': 'BINANCE:BNBUSDT',
        'SOL': 'BINANCE:SOLUSDT',
        'XRP': 'BINANCE:XRPUSDT',
        'ADA': 'BINANCE:ADAUSDT',
        'DOGE': 'BINANCE:DOGEUSDT',
        'TRX': 'BINANCE:TRXUSDT',
        'DOT': 'BINANCE:DOTUSDT',
        'MATIC': 'BINANCE:MATICUSDT',
        
        // 外汇
        'USDJPY': 'FX:USDJPY',
        'EURUSD': 'FX:EURUSD',
        'GBPUSD': 'FX:GBPUSD',
        'AUDUSD': 'FX:AUDUSD',
        'USDCNY': 'FX:USDCNY',
        'USDCHF': 'FX:USDCHF',
        'USDCAD': 'FX:USDCAD',
        'NZDUSD': 'FX:NZDUSD',
        
        // 商品
        'XAU': 'OANDA:XAUUSD',
        'XAG': 'OANDA:XAGUSD',
        'XPT': 'OANDA:XPTUSD',
        'XPD': 'OANDA:XPDUSD',
        
        // 能源
        'WTI': 'TVC:USOIL',
        'BRENT': 'TVC:UKOIL',
        'NG': 'TVC:NATGAS',
        
        // 股票指数
        'IXIC': 'NASDAQ:IXIC',
        'DJIA': 'DJ:DJI',
        'GSPC': 'SP:SPX',
        'N225': 'TSE:NI225',
        'HSI': 'HSI:HSI',
        'SSEC': 'SSE:000001',
        'SZSC': 'SZSE:399001',
        'GDAXI': 'XETR:DAX',
        'FCHI': 'EURONEXT:PX1',
    },

    // 打开图表
    openChart(symbol, name) {
        console.log('Opening chart for:', symbol, name);
        this.currentSymbol = symbol;
        const drawer = document.getElementById('chartDrawer');
        const title = document.getElementById('drawerTitle');

        if (title) title.textContent = `${name} (${symbol})`;
        if (drawer) drawer.classList.add('active');

        // 初始化 TradingView 图表
        this.initTradingViewChart(symbol);
    },

    // 初始化 TradingView 图表
    initTradingViewChart(symbol) {
        const containerId = 'tradingViewContainer';
        const container = document.getElementById(containerId);
        if (!container) return;

        // 清空容器
        container.innerHTML = '';

        // 获取映射后的符号
        const tvSymbol = this.symbolMap[symbol] || `BINANCE:${symbol}USDT`;

        // 创建 TradingView 图表
        if (typeof TradingView !== 'undefined') {
            this.widget = new TradingView.widget({
                autosize: true,
                symbol: tvSymbol,
                interval: this.currentTimeframe,
                timezone: 'Asia/Shanghai',
                theme: 'dark',
                style: '1',
                locale: 'zh',
                toolbar_bg: '#0a0a0f',
                enable_publishing: false,
                hide_side_toolbar: false,
                allow_symbol_change: true,
                container_id: containerId,
                studies: [
                    "RSI@tv-basicstudies",
                    "MASimple@tv-basicstudies"
                ],
            });
        } else {
            // 如果 TradingView 不可用，显示模拟图表
            container.innerHTML = `
                <div style="padding: 40px; text-align: center; color: #888; background: #12121a; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                    <p style="font-size: 18px; margin-bottom: 20px;">正在加载 ${symbol} 图表...</p>
                    <div class="loader-spinner"></div>
                    <p style="margin-top: 20px; font-size: 14px;">如果长时间未加载，请检查网络连接或刷新页面。</p>
                </div>
            `;
            
            // 尝试在 2 秒后重新加载
            setTimeout(() => {
                if (typeof TradingView !== 'undefined') {
                    this.initTradingViewChart(symbol);
                }
            }, 2000);
        }
    },

    // 改变时间框架
    changeTimeframe(timeframe) {
        this.currentTimeframe = timeframe;
        if (this.currentSymbol) {
            this.initTradingViewChart(this.currentSymbol);
        }
    },

    // 关闭图表
    closeChart() {
        const drawer = document.getElementById('chartDrawer');
        if (drawer) drawer.classList.remove('active');
    },
};

// 导出图表管理器
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChartManager;
}
