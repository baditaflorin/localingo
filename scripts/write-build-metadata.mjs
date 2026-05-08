import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const packageJson = JSON.parse(readFileSync(resolve('package.json'), 'utf8'));
const metadata = {
  name: packageJson.name,
  version: packageJson.version,
  commitSource: 'https://api.github.com/repos/baditaflorin/localingo/commits/main',
  repository: 'https://github.com/baditaflorin/localingo',
  liveUrl: 'https://baditaflorin.github.io/localingo/'
};

mkdirSync('docs', { recursive: true });
writeFileSync(resolve('docs/version.json'), `${JSON.stringify(metadata, null, 2)}\n`);
