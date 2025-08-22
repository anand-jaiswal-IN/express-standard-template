import { build } from 'esbuild';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json to get import maps
const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
const importMaps = packageJson.imports || {};

// Convert import maps to esbuild alias format
const alias = {};
for (const [key, value] of Object.entries(importMaps)) {
  if (key.startsWith('#')) {
    const aliasKey = key.replace('#', '');
    alias[aliasKey] = resolve(__dirname, value.replace('./src', './src'));
  }
}

// Build configuration
const buildConfig = {
  entryPoints: ['src/server.ts'],
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'esm',
  outdir: 'dist',
  sourcemap: true,
  minify: false,
  alias,
  external: [
    // External dependencies that shouldn't be bundled
    'express',
    'compression',
    'cors',
    'helmet',
    'morgan',
    'express-rate-limit',
    'winston',
    'winston-daily-rotate-file',
    'uuid',
  ],
};

// Run the build
try {
  await build(buildConfig);
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
