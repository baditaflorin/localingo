import { readdirSync, rmSync } from 'node:fs';

const generatedPaths = [
  'docs/404.html',
  'docs/assets',
  'docs/favicon.svg',
  'docs/index.html',
  'docs/manifest.webmanifest',
  'docs/registerSW.js',
  'docs/sw.js',
  'docs/version.json'
];

for (const path of generatedPaths) {
  rmSync(path, { force: true, recursive: true });
}

for (const file of readdirSync('docs', { withFileTypes: true })) {
  if (file.isFile() && file.name.startsWith('workbox-') && file.name.endsWith('.js')) {
    rmSync(`docs/${file.name}`, { force: true });
  }
}
