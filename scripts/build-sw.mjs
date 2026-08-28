import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile('dist/.vite/manifest.json', 'utf8'));
const files = new Set(['/', '/index.html', '/demo', '/game', '/privacy', '/terms', '/favicon.svg', '/apple-touch-icon.svg']);
for (const entry of Object.values(manifest)) {
  if (entry.file) files.add(`/${entry.file}`);
  for (const css of entry.css || []) files.add(`/${css}`);
  for (const asset of entry.assets || []) files.add(`/${asset}`);
}
const shell = [...files].sort();
const cacheId = createHash('sha256').update(shell.join('\n')).digest('hex').slice(0, 12);
const source = `// Generated after every production build. Do not edit by hand.\nconst CACHE = 'number-motion-duet-${cacheId}';\nconst SHELL = ${JSON.stringify(shell)};\n\nself.addEventListener('install', (event) => {\n  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));\n});\nself.addEventListener('activate', (event) => event.waitUntil((async () => {\n  const names = await caches.keys();\n  await Promise.all(names.filter((name) => name.startsWith('number-motion-duet-') && name !== CACHE).map((name) => caches.delete(name)));\n  await self.clients.claim();\n})()));\nself.addEventListener('fetch', (event) => {\n  if (event.request.method !== 'GET') return;\n  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {\n    const copy = response.clone();\n    if (new URL(event.request.url).origin === self.location.origin) caches.open(CACHE).then((cache) => cache.put(event.request, copy));\n    return response;\n  }).catch(() => caches.match('/index.html'))));\n});\n`;
await writeFile('dist/sw.js', source);
