import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const port = Number.parseInt(process.argv[2] ?? '4173', 10);
const root = resolve('docs');
const base = '/localingo/';

const contentTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.webmanifest', 'application/manifest+json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.wasm', 'application/wasm']
]);

const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host ?? '127.0.0.1'}`);
  let pathname = decodeURIComponent(requestUrl.pathname);

  if (pathname === '/') {
    response.writeHead(302, { Location: base });
    response.end();
    return;
  }

  if (!pathname.startsWith(base)) {
    response.writeHead(404);
    response.end('Not found');
    return;
  }

  pathname = pathname.slice(base.length);
  const relativePath = pathname === '' ? 'index.html' : pathname;
  const safePath = normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, '');
  const filePath = join(root, safePath);

  try {
    const body = await readFile(filePath);
    response.writeHead(200, {
      'Content-Type': contentTypes.get(extname(filePath)) ?? 'application/octet-stream'
    });
    response.end(body);
  } catch {
    const body = await readFile(join(root, '404.html'));
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(body);
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Localingo static server: http://127.0.0.1:${port}${base}`);
});
