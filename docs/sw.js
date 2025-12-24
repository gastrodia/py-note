// Service Worker for caching CDN resources
// 缓存策略：Cache First (缓存优先，适合不经常变化的大文件)
const CACHE_NAME = 'cache-v1';

// 需要缓存的 CDN 列表（可以是域名或 URL 模式）
const CACHE_PATTERNS = [
    'cdn.jsdelivr.net/npm/pyodide',
    // 可以添加更多 CDN，例如：
    // 'unpkg.com',
    // 'cdnjs.cloudflare.com',
    // 'cdn.bootcdn.net',
];

// 安装 Service Worker
self.addEventListener('install', (event) => {
    console.log('[SW] Service Worker: Installing...');
    // 跳过等待，立即激活
    self.skipWaiting();
    
    // 不预缓存，等首次使用时再缓存，避免首次加载过慢
    event.waitUntil(Promise.resolve());
});

// 激活 Service Worker
self.addEventListener('activate', (event) => {
    console.log('[SW] Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // 清理旧缓存
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Clearing old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[SW] Service Worker activated and ready!');
            // 立即接管所有页面
            return self.clients.claim();
        })
    );
});

// 拦截网络请求 - Cache First 策略（优先使用缓存）
self.addEventListener('fetch', (event) => {
    const url = event.request.url;
    
    // 检查是否匹配任何一个 CDN 模式
    const shouldCache = CACHE_PATTERNS.some(pattern => url.includes(pattern));
    
    if (shouldCache) {
        console.log('[SW] 🎯 拦截请求:', url.split('/').pop(), '| 类型:', event.request.destination || 'unknown');
        
        event.respondWith(
            (async () => {
                try {
                    const cache = await caches.open(CACHE_NAME);
                    
                    // 使用 ignoreSearch: true 来忽略 URL 参数差异
                    // 使用 ignoreVary: true 来忽略 Vary 头部差异
                    const cacheOptions = {
                        ignoreSearch: true,
                        ignoreVary: true
                    };
                    
                    // 先查询缓存
                    let cachedResponse = await cache.match(event.request, cacheOptions);
                    
                    // 如果还是找不到，尝试用 URL 字符串直接匹配
                    if (!cachedResponse) {
                        cachedResponse = await cache.match(url, cacheOptions);
                    }
                    
                    if (cachedResponse) {
                        // 有缓存，立即返回
                        console.log('[SW] ✓ 从缓存返回:', url.split('/').pop());
                        return cachedResponse;
                    }
                    
                    // 无缓存，从网络获取
                    console.log('[SW] ⬇ 从网络下载:', url.split('/').pop());
                    const response = await fetch(event.request);
                    
                    // 检查响应是否有效
                    // 允许缓存：status 200-299 或 opaque response (status 0)
                    const shouldCache = response && (
                        (response.status >= 200 && response.status < 300) ||
                        response.type === 'opaque'
                    );
                    
                    if (shouldCache) {
                        // 克隆响应并缓存
                        const responseToCache = response.clone();
                        
                        try {
                            // 使用 URL 作为缓存键，更稳定
                            await cache.put(url, responseToCache);
                            console.log('[SW] ✓ 已缓存:', url.split('/').pop(), 
                                       '| 类型:', response.type, 
                                       '| 状态:', response.status);
                            
                            // 验证是否真的缓存成功
                            const verify = await cache.match(url, cacheOptions);
                            if (verify) {
                                console.log('[SW] ✓ 缓存验证成功:', url.split('/').pop());
                            } else {
                                console.error('[SW] ✗ 缓存验证失败:', url.split('/').pop());
                            }
                        } catch (cacheError) {
                            console.error('[SW] ✗ 缓存失败:', url.split('/').pop(), cacheError);
                        }
                    } else {
                        console.warn('[SW] ⚠ 响应无效，未缓存:', url.split('/').pop(), 
                                   '| 状态:', response?.status, 
                                   '| 类型:', response?.type);
                    }
                    
                    return response;
                } catch (error) {
                    console.error('[SW] ✗ 请求失败:', error);
                    // 尝试返回缓存（离线情况）
                    const cachedResponse = await caches.match(event.request);
                    if (cachedResponse) {
                        console.log('[SW] ✓ 使用离线缓存:', url.split('/').pop());
                        return cachedResponse;
                    }
                    throw error;
                }
            })()
        );
    }
});

// 监听消息，支持手动清理缓存
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.delete(CACHE_NAME).then(() => {
                console.log('Service Worker: Cache cleared');
                event.ports[0].postMessage({ success: true });
            })
        );
    }
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

