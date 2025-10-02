#!/usr/bin/env node
// Export a lightweight static reference bundle for external sites (e.g. bekalah.github.io/cathedral)
// Collects curated instructions, research index, codex template, and engine scripts into exports/cathedral-site
// Usage: node scripts/export-cathedral-site.mjs

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const root = process.cwd();
const outRoot = path.join(root, 'exports', 'cathedral-site');
const docsRoot = path.join(root, 'docs');

function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }
ensureDir(outRoot);

// Utility: simple hash for manifest integrity
const hash = content => crypto.createHash('sha256').update(content).digest('hex').slice(0,16);

// Naive markdown -> html (headings + paragraphs + code fences)
function mdToHtml(md) {
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
  let html = md
    .replace(/```([\s\S]*?)```/g, (_,code)=>`<pre><code>${esc(code.trim())}</code></pre>`) // code blocks
    .replace(/^###\s+(.*)$/gm, '<h3>$1</h3>')
    .replace(/^##\s+(.*)$/gm, '<h2>$1</h2>')
    .replace(/^#\s+(.*)$/gm, '<h1>$1</h1>')
    .replace(/\n{2,}/g,'\n\n')
    .replace(/([^>])\n\n([^<])/g,'$1</p><p>$2');
  html = '<p>' + html + '</p>';
  return `<!doctype html><meta charset="utf-8"/><title>Cathedral Reference</title><link rel="stylesheet" href="./style.css"/><body>${html}</body>`;
}

// Copy instructions markdown -> html pages
const instructionsDir = path.join(docsRoot, 'instructions');
const outInstructions = path.join(outRoot, 'instructions');
ensureDir(outInstructions);
let instructionEntries = [];
if (fs.existsSync(instructionsDir)) {
  for (const f of fs.readdirSync(instructionsDir)) {
    const src = path.join(instructionsDir, f);
    if (!fs.statSync(src).isFile()) continue;
    const content = fs.readFileSync(src, 'utf8');
    const baseName = f.replace(/\.[^.]+$/, '');
    const htmlName = baseName + '.html';
    const html = mdToHtml(content);
    fs.writeFileSync(path.join(outInstructions, htmlName), html, 'utf8');
    instructionEntries.push({ file: f, html: htmlName, hash: hash(content) });
  }
}

// Research index: reuse docs/INDEX.md -> convert
const indexMdPath = path.join(docsRoot, 'INDEX.md');
let indexHtmlName = 'index.html';
if (fs.existsSync(indexMdPath)) {
  const md = fs.readFileSync(indexMdPath,'utf8');
  const html = mdToHtml(md);
  fs.writeFileSync(path.join(outRoot, indexHtmlName), html,'utf8');
}

// Copy codex template (raw JSON)
const codexTemplateCandidates = [
  path.join(docsRoot,'research','codex_144_nodes_template.json'),
  path.join(root,'codex_144_nodes_template.json')
];
let codexTemplateOut = null;
for (const c of codexTemplateCandidates) {
  if (fs.existsSync(c)) {
    const destDir = path.join(outRoot,'codex');
    ensureDir(destDir);
    const dest = path.join(destDir, path.basename(c));
    fs.copyFileSync(c,dest);
    codexTemplateOut = dest;
    break;
  }
}

// Copy engine prototype scripts (ambient & cymatic if present) + dynamic loader
const engineNames = ['ambient-engine.js','cymatic-engine.js'];
const outEngines = path.join(outRoot,'engines');
ensureDir(outEngines);
const engineEntries = [];
for (const name of engineNames) {
  // after migration they reside in docs/research
  const candidatePaths = [
    path.join(docsRoot,'research',name),
    path.join(root,name)
  ];
  const found = candidatePaths.find(p=>fs.existsSync(p));
  if (found) {
    const content = fs.readFileSync(found,'utf8');
    fs.writeFileSync(path.join(outEngines,name), content, 'utf8');
    engineEntries.push({ name, hash: hash(content) });
  }
}

// Basic style
const styleCss = `body{font-family:system-ui,Arial,sans-serif;max-width:960px;margin:2rem auto;padding:0 1rem;line-height:1.5;background:#111;color:#eee}a{color:#6cf}code,pre{background:#222;padding:.25rem .5rem;border-radius:4px}pre{overflow:auto}h1,h2,h3{color:#ffd479;font-weight:600}nav ul{list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:.75rem}nav a{text-decoration:none;background:#222;padding:.5rem .75rem;border-radius:4px}nav a:hover{background:#333}`;
fs.writeFileSync(path.join(outRoot,'style.css'), styleCss,'utf8');

// Landing portal HTML
const portalHtml = `<!doctype html><meta charset="utf-8"/><title>Cathedral Reference Portal</title><link rel="stylesheet" href="./style.css"/><body><h1>Cathedral Reference Portal</h1><p>Generated static bundle for external site embedding. Source repository: BUILDING CATHEDRALS.</p><nav><ul><li><a href="index.html">Index</a></li><li><a href="instructions/">Instructions (raw listing)</a></li><li><a href="codex/${codexTemplateOut?path.basename(codexTemplateOut):''}">Codex Template</a></li></ul></nav><section><h2>Instruction Pages</h2><ul>${instructionEntries.map(e=>`<li><a href="instructions/${e.html}">${e.file}</a></li>`).join('')}</ul><h2>Engines</h2><ul>${engineEntries.map(e=>`<li><a href="engines/${e.name}">${e.name}</a></li>`).join('')}</ul></section></body>`;
fs.writeFileSync(path.join(outRoot,'portal.html'), portalHtml,'utf8');

// Copy audio map if present
const audioMapSrc = path.join(root,'resources','audio-map.json');
let audioMapEntry = null;
if (fs.existsSync(audioMapSrc)) {
  const dest = path.join(outRoot,'audio-map.json');
  fs.copyFileSync(audioMapSrc,dest);
  audioMapEntry = 'audio-map.json';
}

// Add loader module
const loaderJs = `// Dynamic loader for Cathedral reference bundle\nexport async function loadReference(base='.') {\n  const manifest = await (await fetch(base + '/reference-manifest.json')).json();\n  let audioMap = null;\n  try { audioMap = await (await fetch(base + '/audio-map.json')).json(); } catch {}\n  return { manifest, audioMap };\n}\n`;
fs.writeFileSync(path.join(outRoot,'loader.js'), loaderJs,'utf8');

// Manifest
const manifest = {
  generated: new Date().toISOString(),
  instructions: instructionEntries,
  engines: engineEntries,
  codexTemplate: codexTemplateOut ? path.relative(outRoot,codexTemplateOut) : null,
  audioMap: audioMapEntry,
  loader: 'loader.js'
};
fs.writeFileSync(path.join(outRoot,'reference-manifest.json'), JSON.stringify(manifest,null,2));

console.log('[export-cathedral-site] bundle created at', outRoot);
