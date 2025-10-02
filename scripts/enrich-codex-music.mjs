#!/usr/bin/env node
// Enrich codex template with music binding fields without mutating original file.
// Output: data/codex.music.enriched.json
import fs from 'fs';
import path from 'path';
const root = process.cwd();
const sources = [
  path.join(root,'docs','research','codex_144_nodes_template.json'),
  path.join(root,'codex_144_nodes_template.json')
];
const src = sources.find(p=>fs.existsSync(p));
if(!src){
  console.error('Codex template not found. Looked in:', sources); process.exit(1);
}
let data = JSON.parse(fs.readFileSync(src,'utf8'));
if(!Array.isArray(data)){ console.error('Codex template not array'); process.exit(1);} 

// Simple motif assignment cycles through audio-map motifs by numerology.
const audioMapPath = path.join(root,'resources','audio-map.json');
let motifs = [];
try { motifs = JSON.parse(fs.readFileSync(audioMapPath,'utf8')).motifs || []; } catch {}
const motifIds = motifs.map(m=>m.id);
function pickMotif(n){ if(!motifIds.length) return 'primordial-seed'; return motifIds[(n-1)%motifIds.length]; }

const enriched = data.map(node => {
  const clone = { ...node };
  if(!clone.music){
    clone.music = {
      motif: pickMotif(clone.numerology || clone.node_id || 1),
      energy_hint: (clone.numerology||1),
      mode: ['aeolian','dorian','phrygian','lydian','mixolydian'][ (clone.numerology||1) % 5 ],
      instrumentation_tags: [ 'pad','texture','safety' ],
      adaptive: {
        rise: (clone.numerology % 3) === 0,
        pulse: (clone.numerology % 2) === 0,
        fractalLayer: (clone.node_id % 7) === 0
      }
    };
  }
  return clone;
});

const outDir = path.join(root,'data');
if(!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive:true});
const outFile = path.join(outDir,'codex.music.enriched.json');
fs.writeFileSync(outFile, JSON.stringify(enriched,null,2));
console.log('Enriched codex written to', outFile,'nodes:', enriched.length);
