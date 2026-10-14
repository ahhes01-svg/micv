/* Generado por scripts/generate-cache.mjs. No editar sw.js manualmente. */
const VERSION='f21f7579f83b';
const BASE=new URL('./',self.location.href);
const PREFIX=`zahir-${encodeURIComponent(BASE.pathname)}-`;
const CORE=`${PREFIX}core-${VERSION}`,RUNTIME=`${PREFIX}images-${VERSION}`;
const URLS=[
  "index.html",
  "assets/images/backgrounds/favicon.svg?v=f982bb9dd8cb",
  "manifest.json?v=7dcc19a6850c",
  "assets/images/profile/zahir-profile-mirada-natural.png?v=04031127ea87",
  "assets/vendor/swiper-bundle.min.css?v=ef7ee2f59686",
  "css/styles.css?v=bb3005900f06",
  "css/animations.css?v=97c95008de0c",
  "css/responsive.css?v=b42cdf898208",
  "css/chatbot.css?v=acae199645c9",
  "css/refinements.css?v=9e71bf1c87de",
  "css/ux-polish.css?v=309c27e484ec",
  "assets/images/technologies/powerbi.svg?v=f9541e3456e5",
  "assets/images/technologies/microsoftexcel.svg?v=3764dfce856c",
  "assets/images/technologies/lucidchart.svg?v=a8fb9f61eeea",
  "assets/images/technologies/javascript.svg?v=673a6f54d078",
  "assets/images/technologies/react.svg?v=37c8c23bc6ea",
  "assets/images/technologies/typescript.svg?v=662b9b049a06",
  "assets/images/technologies/css3.svg?v=af97ceb9d71e",
  "assets/images/technologies/html5.svg?v=6dbc134a2c0e",
  "assets/images/technologies/claude.svg?v=5119ef950a0d",
  "assets/images/technologies/openai.svg?v=a46b5cb87e47",
  "assets/images/technologies/python.svg?v=a762008752dc",
  "assets/images/technologies/wordpress.svg?v=0d45778b7cb8",
  "assets/images/technologies/php.svg?v=73160274ce28",
  "assets/images/backgrounds/zahir-assistant.svg?v=e84c65fa7722",
  "assets/vendor/lucide.min.js?v=3411692820cb",
  "assets/vendor/typed.umd.js?v=58424467abb3",
  "assets/vendor/gsap.min.js?v=28033e449a31",
  "assets/vendor/ScrollTrigger.min.js?v=ad33c2df9ada",
  "assets/vendor/swiper-bundle.min.js?v=517e6bfba591",
  "js/translations.js?v=6075cd7b7e97",
  "js/certificates.js?v=24801a12a135",
  "js/animations.js?v=81713cd66446",
  "js/main.js?v=0403f932f7d6",
  "js/contact.js?v=b2f94372f95f",
  "js/project-cases.js?v=f0ae2d6a5d52",
  "js/chatbot.js?v=609a05a01763",
  "js/ux.js?v=435668563713",
  "js/performance.js?v=50264748f844"
];
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
