// Auto-fix script for Cathedral modularization and standards
// Run with: node scripts/auto-fix.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Cathedral automation utility: dynamically enforce standards across apps.
// Safe, idempotent, and verbose in summary only.

// Example: Update README with ND-safe, trauma-aware, provenance standards
function updateReadme(appPath) {
  const readmePath = path.join(appPath, 'README.md');
  let changed = false;
  let content = '';
  if (fs.existsSync(readmePath)) {
    content = fs.readFileSync(readmePath, 'utf8');
  } else {
    content = `# ${path.basename(appPath)}\n`;
    changed = true;
  }
  const marker = 'ND-safe, trauma-aware, museum-grade standards enforced';
  if (!content.includes(marker)) {
    content += '\n\n---\nND-safe, trauma-aware, museum-grade standards enforced. All art, music, and code must be public domain, open source, or fully documented for provenance.\n';
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(readmePath, content, 'utf8');
    return { updated: true, path: readmePath };
  }
  return { updated: false, path: readmePath };
}

// Example: Mirror codex schema to all apps
function mirrorCodexSchema(codexPath, appPaths) {
  if (!fs.existsSync(codexPath)) return [];
  let codex = fs.readFileSync(codexPath, 'utf8');
  // Resolve JSON $ref pointer style: {"$ref":"../codex_144_nodes_template.json"}
  try {
    const parsed = JSON.parse(codex);
    if (parsed && parsed.$ref && typeof parsed.$ref === 'string') {
      const refPath = path.resolve(path.dirname(codexPath), parsed.$ref);
      if (fs.existsSync(refPath)) {
        codex = fs.readFileSync(refPath, 'utf8');
      } else {
        console.warn('Codex $ref target not found:', refPath);
      }
    }
  } catch { /* ignore parse errors, treat as raw */ }
  const results = [];
  appPaths.forEach(appPath => {
    const dataDir = path.join(appPath, 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    const dest = path.join(dataDir, 'codex.144_99.json');
    let action = 'skipped';
    if (!fs.existsSync(dest) || fs.readFileSync(dest, 'utf8') !== codex) {
      fs.writeFileSync(dest, codex, 'utf8');
      action = 'updated';
    }
    results.push({ app: path.basename(appPath), file: dest, action });
  });
  return results;
}

// Example usage
// Resolve proper file system paths (avoid percent-encoding issues)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Discover real app directories under apps/* (only those containing a package.json)
function discoverApps(root) {
  const base = path.join(root, 'apps');
  if (!fs.existsSync(base)) return [];
  return fs.readdirSync(base)
    .map(name => path.join(base, name))
    .filter(p => {
      try { return fs.statSync(p).isDirectory(); } catch { return false; }
    })
    .filter(p => fs.existsSync(path.join(p, 'package.json')));
}

// Project root is parent of the scripts directory
const projectRoot = path.resolve(__dirname, '..');
const apps = discoverApps(projectRoot);
if (apps.length === 0) {
  console.warn('No apps discovered. Ensure structure: apps/<appName>/package.json');
}

// Apply README updates
const readmeResults = apps.map(updateReadme);

// Mirror codex
const codexSourceCandidates = [
  path.join(projectRoot, 'data', 'codex.144_99.json'),
  path.join(projectRoot, 'codex.144_99.json'),
  path.join(projectRoot, 'codex_144_nodes_template.json')
];
const codexSource = codexSourceCandidates.find(p => fs.existsSync(p));
const codexResults = codexSource ? mirrorCodexSchema(codexSource, apps) : [];

// Summary
// Command-line flags
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

console.log('\n=== Cathedral Automation Summary ===');
console.table(readmeResults.map(r => ({ file: path.basename(r.path), updated: r.updated })));
if (codexSource) {
  console.log('Codex source:', codexSource);
  console.table(codexResults.map(r => ({ app: r.app, action: r.action })));
} else {
  console.log('No codex source file found. Expected one of:', codexSourceCandidates);
}
console.log('Dry run:', dryRun);
console.log('====================================\n');

if (dryRun) {
  console.log('Dry run complete. No further actions.');
  process.exit(0);
}

// Placeholder: could invoke integrity generation automatically if script exists
const integrityScript = path.join(projectRoot, 'scripts', 'gen-integrity.mjs');
if (fs.existsSync(integrityScript)) {
  // Defer to separate run (not importing here to keep auto-fix lightweight)
  console.log('Integrity script detected (scripts/gen-integrity.mjs) – run manually if needed.');
}

// Attempt optional codex validation
try {
  const validateScript = path.join(projectRoot, 'scripts', 'validate-codex.mjs');
  if (fs.existsSync(validateScript)) {
    const { spawnSync } = await import('child_process');
    const result = spawnSync(process.execPath, [validateScript], { stdio: 'pipe' });
    if (result.status === 0) {
      console.log('[codex-validation] success');
    } else {
      console.warn('[codex-validation] failed or warnings issued');
      process.stderr.write(result.stdout.toString());
      process.stderr.write(result.stderr.toString());
    }
  }
} catch (e) {
  console.warn('Codex validation step error (non-fatal):', e.message);
}

// Add more automation steps as needed (modularization, artifact linking, provenance docs, etc.)
