#!/usr/bin/env node
// Migrate selective assets from nested Cathedral0fCircuits/ARTIFACTS-RESEARCH into current monorepo structure.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const nested = path.join(root, 'Cathedral0fCircuits', 'ARTIFACTS-RESEARCH');
if (!fs.existsSync(nested)) {
  console.error('Nested repo not found at', nested);
  process.exit(1);
}

// Mapping of legacy single-file engines into monorepo engines dir (future refinement)
const engineTargets = [
  'alchemy-engine.js',
  'ambient-engine.js',
  'cymatic-engine.js',
  'style-engine.js',
  'muse-engine.js'
];

const copyPlan = [];
engineTargets.forEach(f => {
  const src = path.join(nested, f);
  if (fs.existsSync(src)) {
    const destDir = path.join(root, 'engines');
    fs.mkdirSync(destDir, { recursive: true });
    copyPlan.push({ src, dest: path.join(destDir, f) });
  }
});

// Data artifacts
const dataFiles = [
  'alchemy.json',
  'angels72.json',
  'structure.json',
  'muse-circuit-registry.json',
  'v3synth-stations-complete.json'
];

dataFiles.forEach(f => {
  const src = path.join(nested, f);
  if (fs.existsSync(src)) {
    const destDir = path.join(root, 'data', 'legacy');
    fs.mkdirSync(destDir, { recursive: true });
    copyPlan.push({ src, dest: path.join(destDir, f) });
  }
});

// Execute plan
copyPlan.forEach(({ src, dest }) => {
  fs.copyFileSync(src, dest);
  console.log('Copied', path.relative(root, src), '->', path.relative(root, dest));
});

console.log('Migration complete. Items copied:', copyPlan.length);
if (copyPlan.length === 0) {
  console.warn('No legacy files were copied. Review mapping if expected content missing.');
}
