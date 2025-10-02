#!/usr/bin/env node
// Lint chatmode files for required canonical sections.
import fs from 'fs';
import path from 'path';
const dir = path.join(process.cwd(),'.github','chatmodes');
const required = ['Mode Overview','Source Priority','Style Guidelines'];
let issues = [];
if(!fs.existsSync(dir)) { console.log('[chatmode-lint] no chatmodes directory'); process.exit(0);} 
for (const f of fs.readdirSync(dir)) {
  if(!f.endsWith('.chatmode.md')) continue;
  const content = fs.readFileSync(path.join(dir,f),'utf8');
  const missing = required.filter(h => !content.includes('## '+h));
  if(missing.length) issues.push(`${f}: missing ${missing.join(', ')}`);
  if(content.length > 15000) issues.push(`${f}: file too large (${content.length} chars)`);
}
if(issues.length){
  console.warn('[chatmode-lint] issues:');
  issues.forEach(i=>console.warn(' -',i));
  process.exit(2);
} else {
  console.log('[chatmode-lint] OK');
}
