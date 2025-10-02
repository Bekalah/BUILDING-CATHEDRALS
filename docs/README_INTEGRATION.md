# Integration Guide: Cathedral Reference Bundle → Main Site & Apps

This repository snapshot is a *reference artifact generator* (not your primary application code). Use it to produce a stable, integrity-hashed bundle you can pull into your main GitHub repo / static site / apps.

## 1. Build the Bundle
```bash
node scripts/export-cathedral-site.mjs
node scripts/package-reference.mjs   # produces dist/cathedral-reference-<hash>.tar.gz
```
The `<hash>` is derived from component content (rootHash). Any change to instructions, engines, codex template, or audio map produces a new hash.

## 2. Distribute / Consume Options
### Option A: Submodule
1. In main repo: `git submodule add <this-repo-clone-url> cathedral-reference`
2. Add a build step in main pipeline: `npm --prefix cathedral-reference run export:site`
3. Serve `cathedral-reference/exports/cathedral-site` at `/cathedral`.

### Option B: Artifact Pull (Recommended)
1. Attach `dist/cathedral-reference-<hash>.tar.gz` as a GitHub Release asset.
2. In main repo CI, download by tag/version & extract:
   ```bash
   mkdir -p public/cathedral
   tar -xzf cathedral-reference-<hash>.tar.gz --strip-components=1 -C public/cathedral cathedral-site
   ```

### Option C: CDN Upload
1. After packaging, upload `exports/cathedral-site/*` to object storage (e.g. Azure Blob static container or GitHub Pages branch).
2. Reference loader from your app:
   ```js
   import { loadReference } from 'https://cdn.yoursite.net/cathedral/loader.js';
   const { manifest, audioMap } = await loadReference('https://cdn.yoursite.net/cathedral');
   ```

## 3. Integrity Verification in Main App
You can verify nothing drifted:
```js
async function fetchAndVerify(base){
  const manifest = await (await fetch(base + '/reference-manifest.json')).json();
  const rootHash = manifest.rootHash;
  // (Optional) Compare rootHash against an allow-list baked into your build.
  return manifest;
}
```
Store approved hashes in a JSON config (`cathedral-reference-allow.json`) to prevent loading unreviewed content.

## 4. Linking Motif Demo
Expose `motif-demo.html` for internal QA only (e.g. behind a feature flag) if your production site doesn’t need public access. It’s an educational tool, not a full audio engine.

## 5. Using Enriched Codex in Main Code
If your main repo needs the enriched codex:
```bash
node scripts/enrich-codex-music.mjs
# copy data/codex.music.enriched.json → main-repo/data/codex.music.enriched.json
```
Or add a fetch layer that loads enriched codex from an API or CDN path next to `audio-map.json`.

## 6. Updating Workflow (Suggested Release Steps)
1. Edit content (instructions / audio map / engines).
2. Run: `npm run codex:enrich:music && npm run chat:pack && npm run export:site && node scripts/package-reference.mjs`
3. Commit & tag: `git tag -a catref-vYYMMDD.<n> -m "Cathedral ref bundle"`
4. Push + create release attaching the `.tar.gz`.

## 7. Embedding Loader in a React App Example
```tsx
import { useEffect, useState } from 'react';

export function CathedralRefPanel(){
  const [data,setData] = useState(null);
  useEffect(()=>{ (async()=>{
    const base = '/cathedral';
    const manifest = await (await fetch(base + '/reference-manifest.json')).json();
    setData(manifest);
  })(); },[]);
  if(!data) return <div>Loading Cathedral Reference…</div>;
  return <div>
    <h2>Cathedral Reference</h2>
    <p>Root Hash: {data.rootHash}</p>
    <ul>{data.instructions.map(i=> <li key={i.file}>{i.file} — {i.hash}</li>)}</ul>
  </div>;
}
```

## 8. Sound Kernel Integration Path (Future)
- Move `@cathedral/sound-kernel` into your main monorepo’s `packages/` and publish (optional) as an internal npm package.
- Replace the simple WebAudio motif demo with Tone.js playback referencing `audioMap.instrumentPalettes`.

## 9. Drift Prevention
Keep a `KNOWN_ROOT_HASH` constant in main app; raise a warning or refuse to load if `reference-manifest.json.rootHash` differs. This ensures deliberate upgrades.

## 10. Security / Safety Notes
- All content is static; no secrets embedded.
- Integrity hash prevents silent tampering when served via CDN.
- Avoid mixing dynamic user-supplied HTML into the exported portal to reduce XSS surface.

---
Last updated: Oct 1 2025
