#!/usr/bin/env node
// Lint chatmode files for required sections & size hints.
import fs from 'fs';
import path from 'path';
const dir = path.join(process.cwd(),'.github','chatmodes');
const required = ['Mode','Source','Style','Refusal'];
let issues = [];
if(!fs.existsSync(dir)) { console.log('No chatmodes directory'); process.exit(0);} 
for (const f of fs.readdirSync(dir)) {
  if(!f.endsWith('.chatmode.md')) continue;
  const content = fs.readFileSync(path.join(dir,f),'utf8');
  for (const r of required) {
    if(!new RegExp(`#.*${r}`,'i').test(content)) {
      issues.push(`${f}: missing section containing '${r}'`);
    }
  }
  if(content.length > 12000) issues.push(`${f}: file too large (${content.length} chars)`);
}
if(issues.length){
  console.warn('Chatmode lint issues:');
  issues.forEach(i=>console.warn(' -',i));
  process.exit(2);
} else {
  console.log('Chatmode lint: OK');
}
