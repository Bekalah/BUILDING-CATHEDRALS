#!/usr/bin/env node
// Export a trimmed core distribution of the Cathedral system.
// Includes canonical codex, standards, apps minimal surface, packages, scripts, and docs.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'dist-core');

const includeFiles = [
  'README.md',
  'CATHEDRAL_NODE_STANDARDS.md',
  'package.json',
  'structure.json',
  'alchemy.json',
  'angels72.json',
  'scripts/auto-fix.js',
  'docs/PROTECT.md',
  'docs/SYSTEM_STANDARDS_PLAN.md'
];

const codexCandidates = [
  'data/codex.144_99.json',
  'codex_144_nodes_template.json'
];

const appRoot = path.join(root, 'apps');

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }
function copyFileRel(rel) {
  const src = path.join(root, rel);
  if (!fs.existsSync(src)) return false;
  const dest = path.join(outDir, rel);
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  return true;
}

function writeJSON(rel, obj) {
  const dest = path.join(outDir, rel);
  ensureDir(path.dirname(dest));
  fs.writeFileSync(dest, JSON.stringify(obj, null, 2));
}

function hashFile(p) {
  const h = crypto.createHash('sha256');
  h.update(fs.readFileSync(p));
  return h.digest('hex');
}

function discoverApps() {
  if (!fs.existsSync(appRoot)) return [];
  return fs.readdirSync(appRoot)
    .map(n => path.join(appRoot, n))
    .filter(p => fs.existsSync(path.join(p, 'package.json')));
}

// Clean output
if (fs.existsSync(outDir)) fs.rmSync(outDir, { recursive: true, force: true });
ensureDir(outDir);

// Copy base include files
const copied = [];
includeFiles.forEach(f => { if (copyFileRel(f)) copied.push(f); });

// Handle codex
const codex = codexCandidates.find(c => fs.existsSync(path.join(root, c)));
if (codex) {
  const target = 'data/codex.144_99.json';
  const srcPath = path.join(root, codex);
  const destPath = path.join(outDir, target);
  ensureDir(path.dirname(destPath));
  fs.copyFileSync(srcPath, destPath);
  copied.push(target);
}

// Apps minimal export (package.json, README.md, data/codex.144_99.json if exists)
const apps = discoverApps();
const appExports = [];
apps.forEach(appPath => {
  const relApp = path.relative(root, appPath);
  ['package.json', 'README.md'].forEach(f => {
    const src = path.join(appPath, f);
    if (fs.existsSync(src)) {
      const dest = path.join(outDir, relApp, f);
      ensureDir(path.dirname(dest));
      fs.copyFileSync(src, dest);
      appExports.push(path.join(relApp, f));
    }
  });
  const dataCodex = path.join(appPath, 'data', 'codex.144_99.json');
  if (fs.existsSync(dataCodex)) {
    const dest = path.join(outDir, relApp, 'data', 'codex.144_99.json');
    ensureDir(path.dirname(dest));
    fs.copyFileSync(dataCodex, dest);
    appExports.push(path.join(relApp, 'data/codex.144_99.json'));
  }
});

// Packages (only hooks for now)
const hooksDir = path.join(root, 'packages', 'hooks');
if (fs.existsSync(hooksDir)) {
  const files = fs.readdirSync(hooksDir).filter(f => f.endsWith('.js'));
  files.forEach(f => {
    const src = path.join(hooksDir, f);
    const dest = path.join(outDir, 'packages', 'hooks', f);
    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);
    copied.push(path.join('packages/hooks', f));
  });
}

// Integrity manifest
const manifest = {};
function collectHashes(baseDir, relPrefix = '') {
  const entries = fs.readdirSync(baseDir);
  entries.forEach(entry => {
    const full = path.join(baseDir, entry);
    const rel = path.join(relPrefix, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      collectHashes(full, rel);
    } else {
      manifest[rel] = hashFile(full);
    }
  });
}
collectHashes(outDir);
writeJSON('INTEGRITY_MANIFEST.json', manifest);

console.log('Core export complete ->', outDir);
console.log('Files exported:', Object.keys(manifest).length);
console.log('Apps exported:', apps.map(a => path.basename(a)));
