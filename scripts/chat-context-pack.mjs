#!/usr/bin/env node
// Build reduced chat context pack for assistants.
import fs from 'fs';
import path from 'path';
const root = process.cwd();
const docs = path.join(root,'docs');
const outDir = path.join(root,'dist');
if(!fs.existsSync(outDir)) fs.mkdirSync(outDir,{recursive:true});

function collect(dir, limit=8){
  if(!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f=>/\.(md|txt)$/i.test(f))
    .slice(0,limit)
    .map(f=>{
      const full = path.join(dir,f);
      return { file: path.relative(root, full), content: fs.readFileSync(full,'utf8').slice(0,8000) };
    });
}

const pack = {
  generated: new Date().toISOString(),
  instructions: collect(path.join(docs,'instructions')),
  research: collect(path.join(docs,'research')),
  index: fs.existsSync(path.join(docs,'INDEX.md')) ? fs.readFileSync(path.join(docs,'INDEX.md'),'utf8').slice(0,10000) : null,
  audioMap: fs.existsSync(path.join(root,'resources','audio-map.json')) ? JSON.parse(fs.readFileSync(path.join(root,'resources','audio-map.json'),'utf8')) : null
};
const outFile = path.join(outDir,'chat-pack.json');
fs.writeFileSync(outFile, JSON.stringify(pack,null,2));
console.log('[chat-pack] wrote', outFile);
