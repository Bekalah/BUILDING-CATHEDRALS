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

// Landing portal HTML (will be written after demos so links exist)
let portalHtml; // postpone writing until after demos

// Copy audio map if present
const audioMapSrc = path.join(root,'resources','audio-map.json');
let audioMapEntry = null;
let audioMapHash = null;
if (fs.existsSync(audioMapSrc)) {
  const dest = path.join(outRoot,'audio-map.json');
  const content = fs.readFileSync(audioMapSrc,'utf8');
  fs.writeFileSync(dest, content, 'utf8');
  audioMapEntry = 'audio-map.json';
  audioMapHash = hash(content);
}

// Add loader module
const loaderJs = `// Dynamic loader for Cathedral reference bundle\nexport async function loadReference(base='.') {\n  const manifest = await (await fetch(base + '/reference-manifest.json')).json();\n  let audioMap = null;\n  try { audioMap = await (await fetch(base + '/audio-map.json')).json(); } catch {}\n  return { manifest, audioMap };\n}\n`;
fs.writeFileSync(path.join(outRoot,'loader.js'), loaderJs,'utf8');

// Motif demo (simple Web Audio audition without external deps)
const motifDemoHtml = `<!doctype html><meta charset=
"utf-8"/><title>Cathedral Motif Demo</title><link rel="stylesheet" href="./style.css"/><body><h1>Motif Demo</h1><p>Lightweight in-browser audition of motif palette mappings. Uses basic Web Audio envelopes (no Tone.js dependency).<br/>Source integrity hashes are in <code>reference-manifest.json</code>.</p><div id="controls"></div><pre id="info"></pre><script type="module">\nimport { loadReference } from './loader.js';\nconst noteFreq = n=>{const m=n.match(/^(?<note>[A-Ga-g])(?<acc>#|b)?(?<oct>\d)$/);if(!m)return 440;const semis={'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11};let s=semis[m.groups.note.toUpperCase()];if(m.groups.acc==='#')s+=1;else if(m.groups.acc==='b')s-=1;const oct=parseInt(m.groups.oct,10);const midi = (oct+1)*12 + s;return 440 * Math.pow(2,(midi-69)/12);};\nconst actx = new (window.AudioContext||window.webkitAudioContext)();\nfunction playPalette(palette){const now=actx.currentTime;palette.slice(0,3).forEach((id,i)=>{const osc=actx.createOscillator();const gain=actx.createGain();let baseFreq=220 + (i*70); if(/^[A-G]/i.test(id)) { baseFreq = noteFreq(id.replace(/[^A-G#b0-9]/gi,'')) || baseFreq; } osc.frequency.value=baseFreq; osc.type='sine'; gain.gain.setValueAtTime(0,now); gain.gain.linearRampToValueAtTime(0.3, now+0.05); gain.gain.exponentialRampToValueAtTime(0.0001, now+1.8); osc.connect(gain).connect(actx.destination); osc.start(now); osc.stop(now+2);});}\nconst { manifest, audioMap } = await loadReference('.');\nconst c=document.getElementById('controls');\nif(!audioMap){c.textContent='No audio-map.json present.';} else { audioMap.motifs.forEach(m=>{ const btn=document.createElement('button'); btn.textContent=m.id + ' ['+ (m.palette||m.layers||[]).slice(0,3).join(',') +']'; btn.style.margin='4px'; btn.onclick=()=>{ playPalette(m.palette||m.layers||[]); document.getElementById('info').textContent=JSON.stringify(m,null,2); }; c.appendChild(btn); }); }\n</script>`;
fs.writeFileSync(path.join(outRoot,'motif-demo.html'), motifDemoHtml,'utf8');

// Tone.js rich motif demo
const motifToneDemoHtml = `<!doctype html><meta charset="utf-8"/><title>Cathedral Tone Motif Demo</title><link rel="stylesheet" href="./style.css"/><body><h1>Motif Demo (Tone.js)</h1><p>Layered audition using Tone.js. Click <strong>Enable Audio</strong> first (browser gesture). Loop is optional.</p><div style="margin:.5rem 0;"><button id="start">Enable Audio</button> <label style="margin-left:1rem;font-size:.9rem"><input type="checkbox" id="loop"/> loop</label></div><div id="motifs" style="margin-top:1rem;display:flex;flex-wrap:wrap;gap:.5rem"></div><pre id="details"></pre><script src="https://unpkg.com/tone@15.0.4/build/Tone.js"></script><script type="module">import { loadReference } from './loader.js';
const { audioMap } = await loadReference('.');
const Tone = window.Tone;
const root = document.getElementById('motifs');
const details = document.getElementById('details');
let current = []; let loopFlag=false; const loopChk=document.getElementById('loop'); loopChk.addEventListener('change',()=>loopFlag=loopChk.checked);
function buildVoice(def){ const t=def.type||'synth'; const reverb=new Tone.Reverb({decay:2.5,wet:0.25}).toDestination(); let inst; switch(t){case 'fm': inst=new Tone.FMSynth(); break; case 'mono': inst=new Tone.MonoSynth(); break; case 'drone': inst=new Tone.Oscillator('A2','sine'); break; case 'percussion': inst=new Tone.MembraneSynth(); break; case 'ensemble': inst=new Tone.PolySynth(Tone.Synth,{maxPolyphony:8}); break; default: inst=new Tone.Synth();} if(inst.start){ inst.connect(reverb); } else { inst.connect(reverb); } return inst; }
function schedule(voice, notes, offset){ const now=Tone.now()+offset; notes.forEach((n,i)=>{ if(voice.triggerAttackRelease) voice.triggerAttackRelease(n,'8n', now + i*0.25); }); if(voice.start){ voice.start(now).stop(now+2); }
}
async function playMotif(m){ if(Tone.context.state!=='running') await Tone.start(); current.forEach(v=>{try{v.dispose();}catch{}}); current=[]; const ids=(m.palette||m.layers||[]).slice(0,3); const baseNotes=['C4','E4','G4']; ids.forEach((pid,pi)=>{ const def=audioMap.instrumentPalettes?.[pid]||{}; const voice=buildVoice(def); current.push(voice); const notes=(def.notes&&def.notes.length?def.notes:baseNotes).map(n=> n.replace(/4/, 4+pi)); schedule(voice, notes, 0); }); details.textContent=JSON.stringify(m,null,2); if(loopFlag) setTimeout(()=>playMotif(m), 2400); }
document.getElementById('start').onclick= async ()=>{ await Tone.start(); document.getElementById('start').disabled=true; };
if(audioMap){ audioMap.motifs.forEach(m=>{ const b=document.createElement('button'); b.textContent=m.id; b.style.padding='.4rem .7rem'; b.style.background='#222'; b.style.border='1px solid #444'; b.style.color='#ffd479'; b.style.cursor='pointer'; b.onclick=()=>playMotif(m); root.appendChild(b); }); }
</script>`;
fs.writeFileSync(path.join(outRoot,'motif-demo-tone.html'), motifToneDemoHtml,'utf8');

// Now write portal with links to demos
portalHtml = `<!doctype html><meta charset="utf-8"/><title>Cathedral Reference Portal</title><link rel="stylesheet" href="./style.css"/><body><h1>Cathedral Reference Portal</h1><p>Generated static bundle for external site embedding. Source: BUILDING CATHEDRALS.</p><nav><ul><li><a href="index.html">Index</a></li><li><a href="instructions/">Instructions</a></li><li><a href="codex/${codexTemplateOut?path.basename(codexTemplateOut):''}">Codex Template</a></li><li><a href="motif-demo.html">Motif Demo (Basic)</a></li><li><a href="motif-demo-tone.html">Motif Demo (Tone.js)</a></li></ul></nav><section><h2>Instruction Pages</h2><ul>${instructionEntries.map(e=>`<li><a href="instructions/${e.html}">${e.file}</a></li>`).join('')}</ul><h2>Engines</h2><ul>${engineEntries.map(e=>`<li><a href="engines/${e.name}">${e.name}</a></li>`).join('')}</ul></section></body>`;
fs.writeFileSync(path.join(outRoot,'portal.html'), portalHtml,'utf8');

// Manifest
// Compute codex template hash if present
let codexTemplateHash = null;
if (codexTemplateOut) {
  try { codexTemplateHash = hash(fs.readFileSync(codexTemplateOut,'utf8')); } catch {}
}

// Aggregate integrity object
const integrity = {
  instructions: instructionEntries.map(e=>({ file: e.file, hash: e.hash })),
  engines: engineEntries, // already includes hash
  audioMap: audioMapHash ? { file: audioMapEntry, hash: audioMapHash } : null,
  codexTemplate: codexTemplateHash ? { file: path.basename(codexTemplateOut), hash: codexTemplateHash } : null
};
// Root hash from concatenated component hashes for quick diff detection
const rootHash = hash(JSON.stringify(integrity));

const manifest = {
  generated: new Date().toISOString(),
  loader: 'loader.js',
  demo: 'motif-demo.html',
  instructions: instructionEntries,
  engines: engineEntries,
  codexTemplate: codexTemplateOut ? path.relative(outRoot,codexTemplateOut) : null,
  audioMap: audioMapEntry,
  integrity,
  rootHash
};
fs.writeFileSync(path.join(outRoot,'reference-manifest.json'), JSON.stringify(manifest,null,2));

console.log('[export-cathedral-site] bundle created at', outRoot);
