const CACHE_NAME="student-app-v6";
const FILES_TO_CACHE=[
  "./","./index.html","./manifest.json",
  "./icon-192.png","./icon-512.png",
  "./login.png","./diredawa university.png"
];

// Install
self.addEventListener("install",e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(FILES_TO_CACHE)));
});

// Activate
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(key=>{ if(key!==CACHE_NAME) return caches.delete(key);}))));
  self.clients.claim();
});

// Fetch
self.addEventListener("fetch",e=>{
  if(e.request.method==="POST" && e.request.url.includes("script.google.com")){
    e.respondWith(fetch(e.request).catch(()=>new Response(JSON.stringify({error:"offline"}),{headers:{"Content-Type":"application/json"}})));
    return;
  }
  e.respondWith(caches.match(e.request).then(res=>res||fetch(e.request).then(net=>{
    return caches.open(CACHE_NAME).then(cache=>{cache.put(e.request,net.clone()); return net;});
  })).catch(()=>caches.match("./index.html")));
});
