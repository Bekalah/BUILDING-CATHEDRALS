#!/usr/bin/env node
// Drift detection between resources/catalog.json, workflows, and env templates.
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const issues = [];

function read(p){
  try { return fs.readFileSync(p,'utf-8'); } catch { return null; }
}

// Load catalog
const catalogPath = path.join(root,'resources','catalog.json');
let catalog;
try { catalog = JSON.parse(read(catalogPath)); } catch { issues.push('catalog.json missing or invalid'); }

// Check workflow tokens referenced
const workflow = read(path.join(root,'.github','workflows','azure-swa-matrix.yml')) || '';
if (catalog?.apps) {
  for (const app of catalog.apps) {
    if (!workflow.includes(app.swa)) {
      issues.push(`Workflow missing reference to secret placeholder: ${app.swa}`);
    }
  }
}

// Check env example endpoints
const envEx = read(path.join(root,'.env.example')) || '';
if (catalog?.azure?.openai?.endpoint && !envEx.includes(catalog.azure.openai.endpoint)) {
  issues.push('Endpoint in catalog not present in .env.example');
}

// Timestamp freshness (warn if > 24h old)
if (catalog?.updated) {
  const ageMs = Date.now() - Date.parse(catalog.updated);
  if (ageMs > 24*3600*1000) issues.push('Resource catalog timestamp older than 24h');
}

if (!issues.length) {
  console.log('Drift check: OK');
  process.exit(0);
} else {
  console.warn('Drift check found issues:');
  for (const i of issues) console.warn(' -', i);
  process.exit(2);
}
