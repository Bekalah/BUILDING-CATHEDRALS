#!/usr/bin/env node
// Cathedral Materials Migration Script
// Moves (or copies) legacy instructional / research materials into structured docs hierarchy.
// Usage:
//   node scripts/migrate-materials.mjs --mode=move   (default)
//   node scripts/migrate-materials.mjs --mode=copy
//   node scripts/migrate-materials.mjs --dry-run
//   node scripts/migrate-materials.mjs --mode=hybrid (copy + rename original with .migrated suffix)
// idempotent: skips if target already has identical file hash.

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const root = process.cwd();
const docsRoot = path.join(root, 'docs');
const dirs = {
  instructions: path.join(docsRoot, 'instructions'),
  research: path.join(docsRoot, 'research'),
  archive: path.join(docsRoot, 'archive'),
  assets: path.join(docsRoot, 'assets')
};
Object.values(dirs).forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

const args = process.argv.slice(2);
const getArg = (k, def=null) => {
  const pref = `--${k}=`;
  const found = args.find(a => a.startsWith(pref));
  if (found) return found.slice(pref.length);
  if (args.includes(`--${k}`)) return true;
  return def;
};
const mode = getArg('mode', 'move'); // move | copy | hybrid
const dryRun = args.includes('--dry-run') || getArg('dry-run', false) === true;

function hashFile(p) {
  try {
    const buf = fs.readFileSync(p);
    return crypto.createHash('sha256').update(buf).digest('hex');
  } catch { return null; }
}

// Classification heuristics
const patterns = [
  { category: 'instructions', match: /instruction|instruct|scroll|canon|seed/i },
  { category: 'research', match: /liber|codex|fusion|kink|net of indra|tarot|biometric|cymatic|archetype|fractal/i },
  { category: 'archive', match: /patch|backup|full|final|copy|registry|timeline|zip/i }
];

// Candidate top-level files (exclude obvious code/assets directories)
const topLevelFiles = fs.readdirSync(root)
  .filter(f => fs.statSync(path.join(root, f)).isFile())
  .filter(f => !f.startsWith('.git'));

function classify(name) {
  for (const p of patterns) {
    if (p.match.test(name)) return p.category;
  }
  return 'research';
}

const manifest = [];
for (const file of topLevelFiles) {
  const src = path.join(root, file);
  const ext = path.extname(file).toLowerCase();
  if (['.js','.json','.md','.txt','.pdf','.html','.svg',''].includes(ext)) {
    // Already in docs? skip
    if (src.startsWith(docsRoot)) continue;
    // Skip core project config files
    if (/^package\.json$|^package-lock\.json$|^README|^\.env|^jsconfig\.json$|^structure\.json$|^CATHEDRAL_NODE_STANDARDS\.md$/.test(file)) continue;
    const category = classify(file);
    const targetDir = dirs[category] || dirs.research;
    // Normalize filename (replace spaces)
    const safeName = file.replace(/\s+/g,'_');
    const dest = path.join(targetDir, safeName);
    const srcHash = hashFile(src);
    const destHash = hashFile(dest);
    let action = 'skip-identical';
    if (srcHash && srcHash === destHash) {
      // no op
    } else if (!destHash) {
      action = mode === 'copy' || mode === 'hybrid' ? 'copy' : 'move';
    } else if (srcHash !== destHash) {
      // versioned naming
      const dated = safeName.replace(/(\.[^.]+)?$/, h => `.${Date.now()}${h}`);
      action = (mode === 'copy' || mode === 'hybrid') ? 'copy-versioned' : 'move-versioned';
      manifest.push({ source: src, destination: path.join(targetDir, dated), category, action });
      continue; // push custom entry, skip default push below
    }
    manifest.push({ source: src, destination: dest, category, action });
  }
}

if (dryRun) {
  console.log('=== DRY RUN: Materials Migration Plan ===');
  console.table(manifest.map(m => ({ file: path.basename(m.source), category: m.category, action: m.action })));
  console.log('Total candidates:', manifest.length);
  process.exit(0);
}

for (const entry of manifest) {
  if (entry.action.startsWith('skip')) continue;
  const { source, destination, action } = entry;
  const finalDest = destination;
  const destDir = path.dirname(finalDest);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  if (action.startsWith('copy')) {
    fs.copyFileSync(source, finalDest);
  } else if (action.startsWith('move')) {
    fs.renameSync(source, finalDest);
  }
  if (mode === 'hybrid' && action.startsWith('copy')) {
    const migratedMarker = source + '.migrated';
    if (!fs.existsSync(migratedMarker)) fs.writeFileSync(migratedMarker, 'migrated', 'utf8');
  }
}

// Generate INDEX.md
const indexPath = path.join(docsRoot, 'INDEX.md');
const byCategory = manifest.reduce((acc,m)=>{ (acc[m.category] ||= []).push(m); return acc; },{});
const lines = ['# Cathedral Knowledge Index','',`Generated: ${new Date().toISOString()}`,''];
for (const cat of Object.keys(byCategory).sort()) {
  lines.push(`## ${cat}`,'');
  byCategory[cat].forEach(m => {
    const rel = path.relative(docsRoot, m.destination);
    lines.push(`- ${path.basename(m.source)} -> ${rel} (${m.action})`);
  });
  lines.push('');
}
fs.writeFileSync(indexPath, lines.join('\n'),'utf8');

// Write curation manifest JSON
const curationPath = path.join(docsRoot, 'curation-manifest.json');
fs.writeFileSync(curationPath, JSON.stringify({ generated: new Date().toISOString(), mode, entries: manifest }, null, 2));

console.log('Migration complete. Index at docs/INDEX.md');
