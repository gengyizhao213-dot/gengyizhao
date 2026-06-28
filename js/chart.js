/* ========================================
   Digital Finance Center - TradingView 图表集成
   ======================================== */

const ChartManager = {
    // 当前图表符号
    currentSymbol: null,
    currentTimeframe: '1m',
    widget: null,

    // 打开图表
    openChart(symbol, name) {
        this.currentSymbol = symbol;
        const drawer = document.getElementById('chartDrawer');
        const title = document.getElementById('drawerTitle');

        title.textContent = `${name} (${symbol})`;
        drawer.classList.add('active');

        // 初始化 TradingView 图表
        this.initTradingViewChart(symbol);
    },

    // 初始化 TradingView 图表
    initTradingViewChart(symbol) {
        const container = document.getElementById('tradingViewContainer');

        // 清空容器
        container.innerHTML = '';

        // 创建 TradingView 图表
        if (typeof TradingView !== 'undefined') {
            new TradingView.widget({
                autosize: true,
                symbol: `BINANCE:${symbol}USDT`,
                interval: this.currentTimeframe,
                timezone: 'Asia/Shanghai',
                theme: 'dark',
                style: '1',
                locale: 'zh',
                toolbar_bg: '#0a0a0f',
                enable_publishing: false,
                allow_symbol_change: false,
                container_id: 'tradingViewContainer',
            });
        } else {
            // 如果 TradingView 不可用，显示模拟图表
            container.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #888;">
                    <p>正在加载 ${symbol} 图表...</p>
                    <div style="margin-top: 20px; height: 400px; background: rgba(102, 126, 234, 0.1); border-radius: 8px;"></div>
                </div>
            `;
        }
    },

    // 改变时间框架
    changeTimeframe(timeframe) {
        this.currentTimeframe = timeframe;
        this.initTradingViewChart(this.currentSymbol);
    },

    // 关闭图表
    closeChart() {
        const drawer = document.getElementById('chartDrawer');
        drawer.classList.remove('active');
    },
};

// 导出图表管理器
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChartManager;
}
