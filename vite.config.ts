import react from '@vitejs/plugin-react';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const packageJson = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf8')) as {
  version: string;
};

function gitValue(command: string, fallback: string) {
  try {
    return execSync(command, { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return fallback;
  }
}

const base = process.env.VITE_APP_BASE ?? '/localingo/';
const commit = gitValue('git rev-parse --short HEAD', 'dev');
const builtAt = new Date().toISOString();

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      base,
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'version.json'],
      manifest: {
        name: 'Localingo',
        short_name: 'Localingo',
        description:
          'A private, gamified language tutor with local speech, review, grammar, and lesson generation.',
        theme_color: '#0f766e',
        background_color: '#f8fafc',
        display: 'standalone',
        scope: base,
        start_url: base,
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,json,webmanifest}'],
        navigateFallback: `${base}index.html`
      }
    })
  ],
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
    __BUILD_COMMIT__: JSON.stringify(commit),
    __BUILT_AT__: JSON.stringify(builtAt),
    __GITHUB_REPO__: JSON.stringify(process.env.VITE_GITHUB_REPO ?? 'baditaflorin/localingo')
  },
  build: {
    outDir: 'docs',
    emptyOutDir: false,
    sourcemap: false,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        manualChunks(id) {
          if (id.includes('@duckdb/duckdb-wasm')) {
            return 'duckdb-lab';
          }
          if (id.includes('lucide-react')) {
            return 'icons';
          }
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.ts'],
    exclude: ['tests/e2e/**', 'test/integration/**', 'node_modules/**'],
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      include: [
        'src/features/analytics/progress.ts',
        'src/features/generation/**/*.ts',
        'src/features/grammar/**/*.ts',
        'src/features/review/**/*.ts',
        'src/features/speech/scoring.ts',
        'src/lib/exportImport.ts',
        'src/lib/normalize.ts'
      ],
      exclude: [
        'src/**/*.test.ts',
        'src/features/analytics/duckdbLab.ts',
        'src/features/speech/useSpeechCapture.ts'
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70
      }
    }
  }
});
