import {mkdir,writeFile} from 'node:fs/promises';
const root=new URL('../assets/vendor/',import.meta.url);await mkdir(root,{recursive:true});
const files=[
 ['lucide.min.js','https://cdn.jsdelivr.net/npm/lucide@0.468.0/dist/umd/lucide.min.js'],
 ['typed.umd.js','https://cdn.jsdelivr.net/npm/typed.js@2.1.0/dist/typed.umd.js'],
 ['gsap.min.js','https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js'],
 ['ScrollTrigger.min.js','https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js'],
 ['swiper-bundle.min.js','https://cdn.jsdelivr.net/npm/swiper@11.2.6/swiper-bundle.min.js'],
 ['swiper-bundle.min.css','https://cdn.jsdelivr.net/npm/swiper@11.2.6/swiper-bundle.min.css']
];
const results=await Promise.allSettled(files.map(async([name,url])=>{const response=await fetch(url);if(!response.ok)throw Error(`${name}: HTTP ${response.status}`);await writeFile(new URL(name,root),await response.text());return name;}));
for(const result of results)console.log(result.status==='fulfilled'?`Guardado: ${result.value}`:result.reason.message);
await writeFile(new URL('sources.json',root),JSON.stringify(files.map(([file,url])=>({file,url})),null,2));
if(results.some(result=>result.status==='rejected'))process.exitCode=1;
