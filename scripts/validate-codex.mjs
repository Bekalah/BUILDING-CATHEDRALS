#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const schemaPath = path.join(root, 'docs', 'CODEX_SCHEMA.json');
const codexPath = path.join(root, 'data', 'codex.144_99.json');

function loadJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

if (!fs.existsSync(schemaPath)) {
  console.error('Schema missing:', schemaPath);
  process.exit(1);
}
if (!fs.existsSync(codexPath)) {
  console.error('Codex missing:', codexPath);
  process.exit(1);
}

const AjvLike = {
  validateArray(schema, data) {
    if (!Array.isArray(data)) return ['Codex root must be an array'];
    const errors = [];
    data.forEach((node, idx) => {
      if (typeof node !== 'object') errors.push(`Item ${idx} not object`);
      schema.required.forEach(r => { if (!(r in node)) errors.push(`Item ${idx} missing required property ${r}`); });
      Object.keys(node).forEach(k => { if (!schema.properties[k]) errors.push(`Item ${idx} has unknown property ${k}`); });
    });
    return errors;
  }
};

const schema = loadJSON(schemaPath);
let codexRaw = fs.readFileSync(codexPath, 'utf8');
try {
  const parsedRef = JSON.parse(codexRaw);
  if (parsedRef.$ref) {
    const refTarget = path.resolve(path.dirname(codexPath), parsedRef.$ref);
    if (fs.existsSync(refTarget)) codexRaw = fs.readFileSync(refTarget, 'utf8');
  }
} catch {}

const codex = JSON.parse(codexRaw);
const errors = AjvLike.validateArray(schema.items, codex);
if (errors.length) {
  console.error('Codex validation failed with', errors.length, 'errors');
  errors.slice(0, 50).forEach(e => console.error('-', e));
  process.exit(2);
}
console.log('Codex validation passed. Items:', codex.length);
