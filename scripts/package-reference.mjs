#!/usr/bin/env node
// Package the exported cathedral-site bundle into a hash-stamped .tar.gz archive
// Usage: node scripts/package-reference.mjs
// (Optional) add an npm script: "reference:package": "node scripts/package-reference.mjs"

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';

const root = process.cwd();
const exportDir = path.join(root,'exports','cathedral-site');

function fail(msg){ console.error('[package-reference] ERROR:', msg); process.exit(1); }

if(!fs.existsSync(exportDir)) {
  console.log('[package-reference] export directory missing — running export script...');
  try { execSync('node scripts/export-cathedral-site.mjs', { stdio:'inherit' }); } catch(err){ fail('export script failed'); }
}

const manifestPath = path.join(exportDir,'reference-manifest.json');
if(!fs.existsSync(manifestPath)) fail('reference-manifest.json not found (run export script).');

let manifest; try { manifest = JSON.parse(fs.readFileSync(manifestPath,'utf8')); } catch { fail('invalid manifest JSON'); }
const rootHash = manifest.rootHash || crypto.createHash('sha256').update(JSON.stringify(manifest)).digest('hex').slice(0,16);

const distDir = path.join(root,'dist');
if(!fs.existsSync(distDir)) fs.mkdirSync(distDir,{recursive:true});

const packName = `cathedral-reference-${rootHash}.tar.gz`;
const packPath = path.join(distDir, packName);

// Use system tar for simplicity
try {
  execSync(`tar -czf ${JSON.stringify(packPath)} -C ${JSON.stringify(path.join(root,'exports'))} cathedral-site`, { stdio:'inherit' });
} catch (err) {
  fail('tar command failed (ensure tar is available)');
}

// Write a small descriptor JSON for programmatic consumption
const descriptor = {
  created: new Date().toISOString(),
  file: packName,
  bytes: fs.statSync(packPath).size,
  rootHash,
  manifestSummary: {
    instructions: manifest.instructions?.length || 0,
    engines: manifest.engines?.length || 0,
    hasAudioMap: !!manifest.audioMap,
    demo: !!manifest.demo
  }
};
fs.writeFileSync(path.join(distDir, `cathedral-reference-${rootHash}.json`), JSON.stringify(descriptor,null,2));

console.log('[package-reference] created', packPath, 'hash:', rootHash);