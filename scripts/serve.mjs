import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.pdf': 'application/pdf' };
const server = http.createServer(async (req, res) => {
  try {
    let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    // Support both local root and the existing GitHub Pages /Portfolio/ base path.
    if (pathname.startsWith('/Portfolio/')) pathname = pathname.slice('/Portfolio'.length);
    if (pathname.endsWith('/')) pathname += 'index.html';
    const relative = pathname.replace(/^\/+/, '');
    const allowed = /^[a-z0-9-]+\.html$/i.test(relative) || /^projects\/[a-z0-9-]+\.html$/i.test(relative) || /^assets\/[a-z0-9._-]+$/i.test(relative);
    if (!allowed) throw new Error('Not found');
    const file = path.resolve(root, relative);
    if (!file.startsWith(root + path.sep)) throw new Error('Not found');
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    const page = await readFile(path.join(root, '404.html'), 'utf8').catch(() => 'Page not found');
    res.end(page);
  }
});
server.listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}`));
