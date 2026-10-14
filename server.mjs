import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { resolve, sep } from 'node:path';
import { handleChat } from './server/chat.mjs';
import { serveStatic } from './server/static.mjs';

const root = fileURLToPath(new URL('.', import.meta.url));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.pdf': 'application/pdf', '.xml': 'application/xml', '.txt': 'text/plain' };
const visitors = new Map();
const server = createServer(async (req, res) => {
  const send = (status, text) => { res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end(text); };
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname === '/api/chat') {
      if (req.method !== 'POST') return send(405, 'Método no permitido');
      const now = Date.now(), ip = req.socket.remoteAddress;
      for (const [key, entry] of visitors) if (entry.until < now) visitors.delete(key);
      const entry = visitors.get(ip) || { count: 0, until: now + 60000 };
      visitors.set(ip, entry);
      if (++entry.count > 12) { res.writeHead(429, { 'Content-Type': 'application/json', 'Retry-After': '60' }); return res.end(JSON.stringify({ error: 'Demasiadas consultas. Espera un minuto.' })); }
      const chunks = []; let size = 0;
      for await (const chunk of req) { size += chunk.length; if (size > 24000) return send(413, 'Solicitud demasiado grande'); chunks.push(chunk); }
      const protocol = process.env.PUBLIC_ORIGIN ? new URL(process.env.PUBLIC_ORIGIN).protocol : 'http:';
      const origin = process.env.PUBLIC_ORIGIN || `${protocol}//${req.headers.host}`;
      const result = await handleChat(new Request(`${origin}/api/chat`, { method: 'POST', headers: req.headers, body: Buffer.concat(chunks) }));
      res.writeHead(result.status, Object.fromEntries(result.headers)); return res.end(await result.text());
    }
    if (!['GET', 'HEAD'].includes(req.method)) return send(405, 'Método no permitido');
    const name = pathname === '/' ? 'index.html' : pathname.slice(1);
    if (!/^(index\.html|404\.html|sw\.js|manifest\.json|robots\.txt|sitemap\.xml|(?:assets|css|js)\/[^\\]+)$/.test(name)) return send(404, 'No encontrado');
    const path = resolve(root, name);
    if (!path.startsWith(root + sep) && !path.startsWith(root)) return send(404, 'No encontrado');
    // resolve impide acceder a cualquier archivo fuera de las carpetas públicas.
    const relative = path.slice(root.length).replaceAll('\\', '/');
    if (relative.includes('..') || !/^(index\.html|404\.html|sw\.js|manifest\.json|robots\.txt|sitemap\.xml|(?:assets|css|js)\/)/.test(relative)) return send(404, 'No encontrado');
    await serveStatic(req,res,path,types);
  } catch { send(404, 'No encontrado'); }
});
server.requestTimeout = 30000;
server.listen(Number(process.env.PORT || 8080), '127.0.0.1', () => console.log(`Portafolio: http://localhost:${process.env.PORT || 8080}`));
