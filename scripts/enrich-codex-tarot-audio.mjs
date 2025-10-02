#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
const root = process.cwd();
const enrichedPath = path.join(root,'data','codex.music.enriched.json');
const basePath = path.join(root,'data','codex.144_99.json');
const profilesPath = path.join(root,'resources','tarot-audio-profiles.json');
if(!fs.existsSync(profilesPath)) { console.error('[tarot-audio] profiles missing'); process.exit(1);} 
const profiles = JSON.parse(fs.readFileSync(profilesPath,'utf8')).profiles || [];
const index = new Map(profiles.map(p=>[p.tarot.toLowerCase(), p]));
function loadCodex(){
  if(fs.existsSync(enrichedPath)) return JSON.parse(fs.readFileSync(enrichedPath,'utf8'));
  if(fs.existsSync(basePath)) return JSON.parse(fs.readFileSync(basePath,'utf8'));
  console.error('[tarot-audio] no codex file'); process.exit(1);
}
let codex = loadCodex();
if(!Array.isArray(codex)) { console.error('[tarot-audio] codex not array'); process.exit(1);} 
let updated=0;
codex = codex.map(node=>{
  if(!node || typeof node!=='object') return node;
  const tarotList = Array.isArray(node.tarot_card)? node.tarot_card : [];
  const profile = tarotList.map(t=> (t||'').toLowerCase()).map(t=> index.get(t)).find(Boolean);
  if(profile){
    node.music = node.music || {};
    node.music.solfeggioHz = profile.solfeggioHz;
    node.music.beatPattern = profile.beatPattern;
    node.music.synthPreset = profile.synthPreset;
    if(profile.motifBias && !node.music.motif) node.music.motif = profile.motifBias;
    updated++;
  }
  return node;
});
fs.writeFileSync(enrichedPath, JSON.stringify(codex,null,2));
console.log(`[tarot-audio] updated ${updated} nodes`);