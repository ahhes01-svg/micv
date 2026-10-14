import { cp, mkdir } from 'node:fs/promises';
await import('./generate-cache.mjs');
const root = new URL('../', import.meta.url);
await mkdir(new URL('dist/', root), { recursive: true });
for (const name of ['index.html', '404.html', 'sw.js', 'manifest.json', 'robots.txt', 'sitemap.xml', 'assets', 'css', 'js']) {
  await cp(new URL(name, root), new URL(`dist/${name}`, root), { recursive: true });
}
console.log('Sitio preparado en dist/. La clave y el código del servidor quedan fuera del sitio público.');
