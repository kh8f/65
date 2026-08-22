// Service Worker بسيط لـ MASOUB STORE
// الغرض الرئيسي: تفعيل شرط "التثبيت من المتصفح" (Add to Home Screen / تثبيت التطبيق)
// + كاش خفيف لملفات الموقع الأساسية عشان يفتح بسرعة حتى بدون إنترنت.

const CACHE_NAME = 'masoub-store-v1';
const CORE_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((names) =>
            Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
        )
    );
    self.clients.claim();
});

// استراتيجية: الشبكة أولاً، وإذا فشلت نرجع للكاش (عشان التحديثات تظهر بسرعة
// بس الموقع يفضل يشتغل حتى بدون نت)
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                const copy = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});
