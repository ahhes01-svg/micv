import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url);
const hash=bytes=>createHash('sha256').update(bytes).digest('hex').slice(0,12);
let html=await readFile(new URL('index.html',root),'utf8');
const references=[...html.matchAll(/(?:src|href)="((?:assets|css|js)\/[^"?]+|manifest\.json)(?:\?v=[a-f0-9]+)?"/g)];
const versions=new Map();
for(const match of references){const name=match[1];if(!versions.has(name))versions.set(name,hash(await readFile(new URL(name,root))));}
html=html.replace(/((?:src|href)=")((?:assets|css|js)\/[^"?]+|manifest\.json)(?:\?v=[a-f0-9]+)?"/g,(_,prefix,name)=>`${prefix}${name}?v=${versions.get(name)}"`);
await writeFile(new URL('index.html',root),html);
const essential=['index.html',...versions.keys()].filter(name=>name==='index.html'||/^(css\/|js\/|assets\/vendor\/.*\.(js|css)$|assets\/images\/(profile\/zahir-profile-mirada-natural\.png|technologies\/.*\.svg|backgrounds\/(favicon|zahir-assistant)\.svg)$|manifest\.json$)/.test(name));
const urls=essential.map(name=>name==='index.html'?name:`${name}?v=${versions.get(name)}`);
const template=await readFile(new URL('scripts/sw-template.js',root),'utf8');
const version=hash(html+urls.join('\n')+template);
await writeFile(new URL('sw.js',root),template.replace('__CACHE_VERSION__',version).replace('__PRECACHE_URLS__',JSON.stringify(urls,null,2)));
console.log(`Precaché ${version}: ${urls.length} archivos esenciales. HTML y API se actualizan desde la red.`);
