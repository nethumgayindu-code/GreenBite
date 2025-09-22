const CACHE = 'greenbite-v1';
const CORE = [
  './index.html','./styles.css','./utils.js','./offline.html',
  './scripts/home.js',
  './assets/icons/logo.svg'
];

self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate', (e)=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', (e)=>{
  const req = e.request;
  e.respondWith(
    caches.match(req).then(res=> res || fetch(req).catch(()=>{
      if(req.mode === 'navigate'){ return caches.match('./offline.html'); }
    }))
  );
});
