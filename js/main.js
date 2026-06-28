/* ========================================
   Digital Finance Center - 主程序入口
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Application starting...');
    
    // 检查 App 对象是否存在（定义在 pwa.js 中）
    if (typeof App !== 'undefined') {
        App.init();
    } else {
        console.error('App object not found. Make sure pwa.js is loaded correctly.');
        
        // 紧急降级处理：如果 pwa.js 没加载成功，至少隐藏加载器
        setTimeout(() => {
            const loader = document.getElementById('pageLoader');
            if (loader) loader.classList.add('hidden');
        }, 2000);
    }
});
