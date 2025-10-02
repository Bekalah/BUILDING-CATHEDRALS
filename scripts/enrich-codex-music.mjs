#!/usr/bin/env node
// Enrich codex with adaptive music bindings derived from audio-map motifs.
// Writes data/codex.music.enriched.json (non‑destructive).
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const candidateSources = [
  path.join(root,'data','codex.144_99.json'),
  path.join(root,'docs','research','codex_144_nodes_template.json')
];
const source = candidateSources.find(p=>fs.existsSync(p));
if(!source){
  console.error('[enrich] No codex source found. Looked in:', candidateSources); process.exit(1);
}
let raw;
try { raw = JSON.parse(fs.readFileSync(source,'utf8')); } catch(err){
  console.error('[enrich] Failed to parse codex JSON:', err.message); process.exit(1);
}
let nodes = raw;
// Handle $ref wrapper pattern {"$ref":"../codex_..."}
if(!Array.isArray(nodes) && raw && typeof raw === 'object' && raw.$ref){
  const refCandidates = [
    path.resolve(path.dirname(source), raw.$ref),
    path.join(root, raw.$ref.replace(/^\.\//,'')),
    path.join(root,'docs','research', path.basename(raw.$ref)),
    path.join(root,'data', path.basename(raw.$ref))
  ];
  const refHit = refCandidates.find(p=>fs.existsSync(p));
  if(!refHit){
    console.error('[enrich] Failed to resolve $ref', raw.$ref, 'candidates:', refCandidates); process.exit(1);
  }
  try { nodes = JSON.parse(fs.readFileSync(refHit,'utf8')); }
  catch(err){
    console.error('[enrich] Failed to parse resolved $ref', refHit, err.message); process.exit(1);
  }
}
if(!Array.isArray(nodes)) { console.error('[enrich] Codex root is not an array after $ref resolution'); process.exit(1); }

const audioMapPath = path.join(root,'resources','audio-map.json');
let motifs = [];
try { const raw = JSON.parse(fs.readFileSync(audioMapPath,'utf8')); motifs = raw.motifs || []; } catch {}
const fallbacks = ['primordial-seed','ascending-veil','threshold-heart','fractal-fire'];
const motifIds = motifs.length ? motifs.map(m=>m.id) : fallbacks;

function pickMotif(idx, numerology){
  const base = numerology || (idx+1);
  return motifIds[ base % motifIds.length ];
}

const scaleModes = ['aeolian','dorian','phrygian','lydian','mixolydian'];

const enriched = nodes.map((node, idx) => {
  if(node && typeof node === 'object') {
    if(!node.music){
      const numerology = node.numerology || node.node_id || (idx+1);
      const motif = pickMotif(idx, numerology);
      const motifMeta = motifs.find(m=>m.id===motif) || {};
      node.music = {
        motif,
        energy_hint: (numerology % 9) + 1,
        mode: motifMeta.mode || scaleModes[numerology % scaleModes.length],
        instrumentation_tags: motifMeta.palette || motifMeta.layers || ['pad','texture'],
        adaptive: {
          rise: numerology % 3 === 0,
          pulse: numerology % 2 === 0,
          fractalLayer: numerology % 7 === 0
        }
      };
    }
  }
  return node;
});

const outDir = path.join(root,'data');
if(!fs.existsSync(outDir)) fs.mkdirSync(outDir,{recursive:true});
const outFile = path.join(outDir,'codex.music.enriched.json');
fs.writeFileSync(outFile, JSON.stringify(enriched,null,2));
console.log('[enrich] wrote', outFile, 'nodes:', enriched.length);
