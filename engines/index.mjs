// Engine Registry (Auto-generated style; extend with metadata)
// Provides a central descriptive map of available foundational engines.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

function fileMeta(rel) {
  const abs = path.join(root, rel);
  const stat = fs.existsSync(abs) ? fs.statSync(abs) : null;
  return {
    path: rel,
    bytes: stat ? stat.size : 0,
    modified: stat ? stat.mtime.toISOString() : null
  };
}

export const engines = [
  {
    id: 'alchemy',
    label: 'Alchemy Transformation Engine',
    purpose: 'Symbolic transmutation + archetype blending',
    ndSafe: true,
    entry: 'engines/alchemy-engine.js',
    meta: fileMeta('engines/alchemy-engine.js')
  },
  {
    id: 'ambient',
    label: 'Ambient Harmonics Engine',
    purpose: 'Museum-grade adaptive sound scaffold',
    ndSafe: true,
    entry: 'engines/ambient-engine.js',
    meta: fileMeta('engines/ambient-engine.js')
  },
  {
    id: 'cymatic',
    label: 'Cymatic Geometry Engine',
    purpose: 'Procedural harmonic pattern visualization',
    ndSafe: true,
    entry: 'engines/cymatic-engine.js',
    meta: fileMeta('engines/cymatic-engine.js')
  },
  {
    id: 'muse',
    label: 'Muse Circuit Engine',
    purpose: 'Inspiration sequencing + registry traversal',
    ndSafe: true,
    entry: 'engines/muse-engine.js',
    meta: fileMeta('engines/muse-engine.js')
  },
  {
    id: 'style',
    label: 'Style Engine',
    purpose: 'Declarative fashion / palette / ornament pipeline',
    ndSafe: true,
    entry: 'engines/style-engine.js',
    meta: fileMeta('engines/style-engine.js')
  }
];

export function list() { return engines.map(e => ({ id: e.id, entry: e.entry })); }
export function find(id) { return engines.find(e => e.id === id) || null; }
export function summary() {
  return engines.map(e => ({ id: e.id, sizeKb: (e.meta.bytes/1024).toFixed(1), updated: e.meta.modified }));
}

if (import.meta.url === `file://${__filename}`) {
  console.table(summary());
}
