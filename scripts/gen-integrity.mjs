#!/usr/bin/env node
// Generate or refresh integrity manifest for provenance.
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const OUTPUT = path.join(root, 'INTEGRITY_MANIFEST.json');

const includeRoots = [
  'apps',
  'packages',
  'scripts',
  'docs',
  'data',
  'CATHEDRAL_NODE_STANDARDS.md',
  'structure.json',
  'alchemy.json',
  'angels72.json'
];

function hashFile(p) {
  const h = crypto.createHash('sha256');
  h.update(fs.readFileSync(p));
  return h.digest('hex');
}

function walk(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  const entries = fs.readdirSync(dir);
  entries.forEach(e => {
    const full = path.join(dir, e);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full, list);
    } else {
      list.push(full);
    }
  });
  return list;
}

const manifest = {};
includeRoots.forEach(rel => {
  const full = path.join(root, rel);
  if (fs.existsSync(full)) {
    if (fs.statSync(full).isDirectory()) {
      walk(full).forEach(f => {
        manifest[path.relative(root, f)] = hashFile(f);
      });
    } else {
      manifest[rel] = hashFile(full);
    }
  }
});

fs.writeFileSync(OUTPUT, JSON.stringify(manifest, null, 2));
console.log('Integrity manifest written:', OUTPUT, 'entries:', Object.keys(manifest).length);
