// Service worker for 家計簿 — アプリ本体をキャッシュして、オフラインでも開けるようにする。
//
// 更新の反映について：
//  - index.html（画面そのもの）は「ネットワーク優先」。オンラインなら常に最新版を取得し、
//    オフラインのときだけキャッシュを使う。サーバーのファイルを置き換えれば、次に開いたときに
//    新しい版が表示される。
//  - アイコンなど、めったに変わらないファイルは「キャッシュ優先」で素早く表示する。
//  - sw.js や アイコン を変えたときは CACHE_VERSION の数字を上げると、古いキャッシュが削除される。
const CACHE_VERSION = 'kakeibo-v3';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

function networkFirst(request, fallbackUrl) {
  return fetch(request)
    .then((response) => {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
      }
      return response;
    })
    .catch(() =>
      caches.match(request).then((cached) => cached || (fallbackUrl ? caches.match(fallbackUrl) : undefined))
    );
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isPage = event.request.mode === 'navigate' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/');

  if (isSameOrigin && isPage) {
    // 画面本体：ネットワーク優先（更新がすぐ反映される）
    event.respondWith(networkFirst(event.request, './index.html'));
  } else if (isSameOrigin) {
    // アイコン・manifestなど：キャッシュ優先
    event.respondWith(
      caches.match(event.request).then((cached) => cached || networkFirst(event.request))
    );
  } else {
    // Google Fontsなど外部ファイル：ネットワーク優先、オフライン時はキャッシュ
    event.respondWith(networkFirst(event.request));
  }
});
