// يجعل المنصة تعمل كتطبيق: يحفظ الصفحة والخطوط والأشكال لتفتح بسرعة وحتى دون اتصال
const CACHE = 'math-stars-app-v1';
self.addEventListener('install', (e) => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png']))); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  if (e.request.mode === 'navigate' || url.pathname.startsWith('/api/') || !/^\/(fonts|booklet|icons)\//.test(url.pathname)) return;
  e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request).then((r) => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then((x) => x.put(e.request, c)); } return r; })));
});
