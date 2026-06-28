/* ========================================
   Digital Finance Center - Service Worker
   离线支持和缓存策略
   ======================================== */

const CACHE_NAME = 'dfc-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/style.css',
    '/css/animation.css',
    '/css/responsive.css',
    '/js/data.js',
    '/js/ui.js',
    '/js/chart.js',
    '/js/pwa.js',
    '/manifest.json',
];

// 安装事件
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE).catch(() => {
                console.log('某些资源缓存失败，但 Service Worker 仍然可用');
            });
        })
    );
    self.skipWaiting();
});

// 激活事件
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// 获取事件 - 缓存优先策略
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // 只缓存 GET 请求
    if (request.method !== 'GET') {
        return;
    }

    // API 请求使用网络优先策略
    if (url.hostname !== location.hostname) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // 缓存成功的响应
                    if (response && response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // 网络失败，返回缓存
                    return caches.match(request);
                })
        );
        return;
    }

    // 本地资源使用缓存优先策略
    event.respondWith(
        caches.match(request).then((response) => {
            if (response) {
                return response;
            }

            return fetch(request).then((response) => {
                // 缓存新的响应
                if (response && response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                }
                return response;
            });
        })
    );
});

// 处理后台同步
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-data') {
        event.waitUntil(
            fetch('/api/sync')
                .then(() => console.log('后台同步成功'))
                .catch(() => console.log('后台同步失败'))
        );
    }
});

// 处理推送通知
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const options = {
        body: data.body || '您有新的市场动态',
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        tag: 'market-update',
        requireInteraction: false,
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Digital Finance Center', options)
    );
});
