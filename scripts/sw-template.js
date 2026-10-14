/* Generado por scripts/generate-cache.mjs. No editar sw.js manualmente. */
const VERSION='__CACHE_VERSION__';
const BASE=new URL('./',self.location.href);
const PREFIX=`zahir-${encodeURIComponent(BASE.pathname)}-`;
const CORE=`${PREFIX}core-${VERSION}`,RUNTIME=`${PREFIX}images-${VERSION}`;
const URLS=__PRECACHE_URLS__;
const precache=URLS.map(path=>new URL(path,BASE).href);
const critical=new Set(precache);
const INDEX=new URL('index.html',BASE).href;
const ignore=url=>url.origin!==BASE.origin||url.pathname.startsWith(`${BASE.pathname}api/`)||url.pathname.includes('/.netlify/functions/');

self.addEventListener('install',event=>{
  // Primera instalación: reutilizar la caché HTTP, sin descargar duplicados frescos.
  event.waitUntil(caches.open(CORE).then(cache=>cache.addAll(precache.map(url=>new Request(url,{cache:'no-cache'})))));
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const names=await caches.keys();await Promise.all(names.filter(name=>name.startsWith(PREFIX)&&name!==CORE&&name!==RUNTIME).map(name=>caches.delete(name)));
    await self.clients.claim();
  })());
});
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')self.skipWaiting();});

async function navigation(request){
  const cache=await caches.open(CORE);
  try{
    const response=await fetch(request,{signal:AbortSignal.timeout(4000),cache:'no-cache'});
    if(response.ok&&response.headers.get('content-type')?.includes('text/html')){await cache.put(INDEX,response.clone());return response;}
    if(response.status>=500){const saved=await cache.match(INDEX);if(saved)return saved;}
    return response;
  }catch{
    return await cache.match(INDEX)||new Response('Sin conexión. Vuelve a intentarlo cuando tengas internet.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
  }
}
async function coreAsset(request){
  const cache=await caches.open(CORE),saved=await cache.match(request);
  if(saved)return saved;
  const response=await fetch(request);if(response.ok)await cache.put(request,response.clone());return response;
}
async function saveImage(cache,request,response){
  if(!response.ok||!response.headers.get('content-type')?.startsWith('image/'))return;
  if(Number(response.headers.get('content-length')||0)>3*1024*1024)return;
  await cache.put(request,response.clone());
  const keys=await cache.keys();while(keys.length>48)await cache.delete(keys.shift());
}
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);
  // Nunca cachear formularios, respuestas Gemini, credenciales ni servicios externos.
  if(request.method!=='GET'||ignore(url)||request.headers.has('range'))return;
  const home=url.pathname===BASE.pathname||url.pathname===`${BASE.pathname}index.html`;
  if(request.mode==='navigate'&&home){event.respondWith(navigation(request));return;}
  const versioned=/^[a-f0-9]{12}$/.test(url.searchParams.get('v')||'')&&url.pathname.startsWith(BASE.pathname)&&/^(css\/|js\/|assets\/(vendor|images)\/)/.test(url.pathname.slice(BASE.pathname.length));
  // Las URLs de una publicación nueva también se guardan mientras el worker nuevo espera.
  if((critical.has(url.href)&&url.href!==INDEX)||versioned){event.respondWith(coreAsset(request));return;}
  if(!url.pathname.startsWith(`${BASE.pathname}assets/images/`))return;
  const cachePromise=caches.open(RUNTIME);
  const network=cachePromise.then(async cache=>{const response=await fetch(request);await saveImage(cache,request,response);return response;});
  event.waitUntil(network.then(()=>undefined).catch(()=>undefined));
  event.respondWith(cachePromise.then(async cache=>await cache.match(request)||network));
});
