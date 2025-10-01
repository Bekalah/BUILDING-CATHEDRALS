#!/usr/bin/env node
// Syncs resource catalog timestamps and validates presence of referenced paths.
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const catalogPath = path.join(root, 'resources', 'catalog.json');

if (!fs.existsSync(catalogPath)) {
  console.error('catalog.json not found.');
  process.exit(1);
}

const raw = fs.readFileSync(catalogPath, 'utf-8');
let data;
try { data = JSON.parse(raw); } catch (e) {
  console.error('Invalid JSON in catalog.json');
  process.exit(1);
}

// Update timestamp
data.updated = new Date().toISOString();

// Validate app paths
const issues = [];
for (const app of data.apps || []) {
  if (!fs.existsSync(path.join(root, app.path))) {
    issues.push(`Missing path for app: ${app.name} (${app.path})`);
  }
}

fs.writeFileSync(catalogPath, JSON.stringify(data, null, 2));

if (issues.length) {
  console.warn('Resource catalog sync completed with issues:');
  for (const i of issues) console.warn(' -', i);
  process.exitCode = 2;
} else {
  console.log('Resource catalog sync OK');
}
