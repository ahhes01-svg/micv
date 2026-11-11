// Genera assets/vendor/lucide-subset.js solo con los iconos que usa la web.
// La librería completa (lucide.min.js, ~350 KB) pasa a pesar unos pocos KB.
// Se ejecuta en cada build: si agregas un icono nuevo con data-lucide="...", se incluye solo.
import { readFile, writeFile, readdir } from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const full = await readFile(new URL('assets/vendor/lucide.min.js', root), 'utf8');
const sandbox = {};
vm.runInNewContext(full, sandbox);
const lucide = sandbox.lucide;

// Iconos que se eligen dinámicamente en el código (no aparecen literales en data-lucide="...").
const SAFELIST = ['sun', 'moon', 'plus', 'minus'];
const sources = ['index.html', '404.html', ...(await readdir(new URL('js/', root))).filter(f => f.endsWith('.js')).map(f => `js/${f}`)];
const names = new Set(SAFELIST);
for (const file of sources) {
  const text = await readFile(new URL(file, root), 'utf8').catch(() => '');
  for (const [, name] of text.matchAll(/data-lucide=\\?["']([a-z0-9-]+)\\?["']/g)) names.add(name);
}

const pascal = name => name.replace(/(\w)(\w*)(_|-|\s*)/g, (_, first, rest) => first.toUpperCase() + rest.toLowerCase());
const icons = {};
for (const name of [...names].sort()) {
  const key = pascal(name);
  const data = lucide.icons[key] || lucide[key];
  if (!data) throw new Error(`Icono de Lucide no encontrado: ${name}`);
  icons[key] = data[2]; // solo los trazos; el <svg> base se arma en el navegador
}

const out = `/* Subconjunto de lucide v0.468.0 (ISC) generado por scripts/build-lucide-subset.mjs. No editar. */
(function(){"use strict";
var icons=${JSON.stringify(icons)};
function el(tag,attrs,children){var node=document.createElementNS("http://www.w3.org/2000/svg",tag);Object.keys(attrs).forEach(function(k){node.setAttribute(k,String(attrs[k]))});(children||[]).forEach(function(c){node.appendChild(el(c[0],c[1],c[2]))});return node}
function attrsOf(node){return Array.from(node.attributes).reduce(function(acc,a){acc[a.name]=a.value;return acc},{})}
function classList(v){return typeof v=="string"?v:!v||!v.class?"":typeof v.class=="string"?v.class.split(" "):Array.isArray(v.class)?v.class:""}
function mergeClasses(list){return list.flatMap(classList).map(function(c){return c.trim()}).filter(Boolean).filter(function(c,i,a){return a.indexOf(c)===i}).join(" ")}
function pascal(n){return n.replace(/(\\w)(\\w*)(_|-|\\s*)/g,function(_,a,b){return a.toUpperCase()+b.toLowerCase()})}
var base={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};
function replace(node,opts){var name=node.getAttribute(opts.nameAttr);if(name==null)return;var icon=opts.icons[pascal(name)];if(!icon)return console.warn(node.outerHTML+" icon name was not found in the provided icons object.");
var own=attrsOf(node),attrs=Object.assign({},icon[1],{"data-lucide":name},opts.attrs,own),cls=mergeClasses(["lucide","lucide-"+name,own,opts.attrs]);if(cls)attrs.class=cls;
var svg=el(icon[0],attrs,icon[2]);if(node.parentNode)node.parentNode.replaceChild(svg,node)}
function createIcons(o){o=o||{};var opts={icons:o.icons||icons,nameAttr:o.nameAttr||"data-lucide",attrs:o.attrs||{}};
document.querySelectorAll("["+opts.nameAttr+"]").forEach(function(n){replace(n,opts)})}
Object.keys(icons).forEach(function(k){icons[k]=["svg",base,icons[k]]});
window.lucide={icons:icons,createIcons:createIcons,createElement:function(i){return el(i[0],i[1],i[2])}};
})();
`;
await writeFile(new URL('assets/vendor/lucide-subset.js', root), out);
console.log(`Lucide: ${Object.keys(icons).length} iconos (${(out.length / 1024).toFixed(1)} KB en vez de ${(full.length / 1024).toFixed(0)} KB).`);
