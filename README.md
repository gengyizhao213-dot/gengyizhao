# Digital Finance Center

一个高级的、实时的金融数据中心网站，展示加密货币、外汇、商品、能源和股票市场数据。

## 功能特性

### 🚀 核心功能
- **实时数据展示** - 加密货币、外汇、贵金属、能源、股票指数
- **多资产类别** - 支持 50+ 加密货币、8+ 外汇对、4 种贵金属、3 种能源、9 个股票指数
- **AI 分析** - 市场情绪、恐慌指数、趋势分析、资金流向
- **TradingView 集成** - 专业级图表，支持多个时间框架（1m-1M）
- **实时新闻** - 金融市场新闻和动态

### 🎨 UI/UX 设计
- **Apple + Binance + TradingView 风格** - 现代、专业、科技感
- **毛玻璃效果** - 深色科技风格，蓝紫渐变
- **动态光效** - 20+ 种动画效果（Framer Motion 风格）
- **响应式设计** - Desktop、Tablet、Phone 完美适配
- **暗色模式** - 保护眼睛，提升用户体验

### 📱 PWA 功能
- **离线支持** - Service Worker 缓存策略
- **可安装** - 支持添加到主屏幕
- **后台同步** - 自动同步最新数据
- **推送通知** - 市场动态实时通知

### 📊 数据来源
- **CoinGecko API** - 加密货币和贵金属数据
- **模拟数据** - 外汇、能源、股票数据（可替换为真实 API）
- **本地缓存** - 60 秒缓存策略，减少 API 调用

### 🔧 技术栈
- **前端** - HTML5、CSS3、Vanilla JavaScript
- **样式** - CSS 变量、Grid、Flexbox、毛玻璃效果
- **动画** - CSS 动画、关键帧、过渡效果
- **数据** - CoinGecko API、模拟数据
- **图表** - TradingView Lightweight Charts
- **PWA** - Service Worker、Web App Manifest

## 文件结构

```
gengyizhao_upgrade/
├── index.html              # 主 HTML 文件
├── manifest.json           # PWA 配置
├── sw.js                   # Service Worker
├── robots.txt              # SEO 配置
├── sitemap.xml             # 网站地图
├── README.md               # 项目说明
├── .gitignore              # Git 忽略文件
├── css/
│   ├── style.css           # 主样式文件（1500+ 行）
│   ├── animation.css       # 动画效果
│   └── responsive.css      # 响应式设计
└── js/
    ├── data.js             # 数据管理模块
    ├── ui.js               # UI 渲染模块
    ├── chart.js            # TradingView 图表集成
    └── pwa.js              # PWA 和主程序逻辑
```

## 快速开始

### 本地开发

```bash
# 克隆项目
git clone https://github.com/gengyizhao213-dot/gengyizhao.git
cd gengyizhao_upgrade

# 启动本地服务器
python3 -m http.server 8000
# 或使用 Node.js
npx http-server

# 访问
http://localhost:8000
```

### 部署到 GitHub Pages

```bash
# 初始化 Git 仓库
git init
git add .
git commit -m "Initial commit"

# 添加远程仓库
git remote add origin https://github.com/gengyizhao213-dot/gengyizhao.git

# 推送到 GitHub
git push -u origin main

# 在 GitHub 仓库设置中启用 GitHub Pages
# Settings > Pages > Source: main branch
```

### 部署到自己的服务器

```bash
# 上传所有文件到服务器
scp -r gengyizhao_upgrade/* user@server:/var/www/html/

# 配置 Web 服务器（Nginx 示例）
server {
    listen 80;
    server_name gengyizhao.com;
    root /var/www/html;
    index index.html;
    
    # 缓存策略
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # 单页应用路由
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## API 集成

### CoinGecko API（免费）

```javascript
// 获取加密货币数据
const response = await fetch(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50'
);
const data = await response.json();
```

### 自定义 API 集成

编辑 `js/data.js` 中的 `DataManager` 对象，替换 API 端点：

```javascript
async getForexData() {
    // 替换为你的 API
    const response = await fetch('https://your-api.com/forex');
    return response.json();
}
```

## 自定义配置

### 修改颜色主题

编辑 `css/style.css` 中的 CSS 变量：

```css
:root {
    --color-primary: #667eea;      /* 主色 */
    --color-secondary: #764ba2;    /* 次色 */
    --color-accent: #e040fb;       /* 强调色 */
    --bg-primary: #0a0a0f;         /* 背景色 */
}
```

### 修改动画速度

编辑 `css/animation.css` 中的动画时间：

```css
.fade-in {
    animation: fade-in 0.3s ease forwards;  /* 修改 0.3s */
}
```

### 添加新的资产类别

编辑 `js/pwa.js` 中的 `App.loadAllData()` 方法：

```javascript
async loadAllData() {
    const newAsset = await DataManager.getNewAssetData();
    this.renderNewAsset(newAsset);
}
```

## 性能优化

- **缓存策略** - 60 秒本地缓存，减少 API 调用
- **懒加载** - 按需加载图片和数据
- **代码分割** - 模块化 JavaScript 文件
- **CSS 优化** - 使用 CSS 变量和简写属性
- **图片优化** - 使用 SVG 和 WebP 格式

## 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- 移动浏览器（iOS Safari 14+, Chrome for Android）

## SEO 优化

- 语义化 HTML5 标签
- Meta 标签和 Open Graph
- Sitemap 和 robots.txt
- 快速加载速度（< 2s）
- 移动友好设计

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 联系方式

- GitHub: [@gengyizhao213-dot](https://github.com/gengyizhao213-dot)
- Email: contact@gengyizhao.com

---

**最后更新**: 2026-06-28
**版本**: 1.0.0
