import { execSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

function gitValue(command, fallback) {
  try {
    return execSync(command, { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return fallback;
  }
}

const packageJson = JSON.parse(readFileSync(resolve('package.json'), 'utf8'));
const metadata = {
  name: packageJson.name,
  version: packageJson.version,
  commit: gitValue('git rev-parse --short HEAD', 'dev'),
  fullCommit: gitValue('git rev-parse HEAD', 'dev'),
  builtAt: new Date().toISOString(),
  repository: 'https://github.com/baditaflorin/localingo',
  liveUrl: 'https://baditaflorin.github.io/localingo/'
};

mkdirSync('docs', { recursive: true });
writeFileSync(resolve('docs/version.json'), `${JSON.stringify(metadata, null, 2)}\n`);
