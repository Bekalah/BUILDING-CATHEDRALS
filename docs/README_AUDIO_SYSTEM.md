# Cathedral Audio & Motif System

## Purpose
Defines a lightweight adaptive layer tying Codex nodes to musical motifs for ambient generative scoring and ND-safe regulation cues.

## Key Artifacts
- `resources/audio-map.json` (registry of motifs & instrument palettes)
- `scripts/enrich-codex-music.mjs` (injects `music` blocks onto codex nodes -> `data/codex.music.enriched.json`)
- `packages/sound-kernel` (runtime helper for applying motifs via Tone.js)
- `dist/chat-pack.json` (contains audioMap snapshot for assistants)
- `exports/cathedral-site/motif-demo.html` (static browser audition of motifs)
- `exports/cathedral-site/motif-demo-tone.html` (advanced layered Tone.js demo)
- `resources/tarot-audio-profiles.json` (tarot → solfeggio / beat / synth preset / motif bias)
- `scripts/enrich-codex-tarot-audio.mjs` (overlay tarot audio data onto codex music blocks)

## Update Flow
1. Edit or append motifs in `resources/audio-map.json` (keep energy ranges overlapping minimally).
2. Run enrichment:
   ```bash
   npm run codex:enrich:music
   ```
3. Rebuild chat pack & site export:
   ```bash
   npm run chat:pack
   npm run export:site
   ```
   The export now includes integrity hashes and `motif-demo.html`.
4. (Optional) Build kernel package:
   ```bash
   npm --workspace @cathedral/sound-kernel run build
   ```

## Motif Guidelines
- energy: two-element array `[low, high]` within 1–9 scale.
- mode: musical flavor hint (aeolian, dorian, lydian, etc.).
- palette: instrument palette keys declared under `instrumentPalettes`.
- safety=true motifs should be calm, low dynamic, no abrupt transients.

## Adding a New Motif
1. Add entry under `motifs` with unique `id`.
2. Add any new palette definitions under `instrumentPalettes`.
3. Re-run enrichment & export.

## Troubleshooting
| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Enrichment script: "Codex root is not an array" | Source file wrapped in `$ref` | Script now resolves; ensure ref points to template file. |
| Tone types missing | No published types | Rely on local `types.d.ts` shim or add richer declarations. |
| Assistant not seeing new motif | `chat-pack` not regenerated | Run `npm run chat:pack`. |
| Schema warning | Missing schema file | Provided at `resources/internal/audio-map.schema.json`. |
| Tone demo silent | Audio not unlocked | Click "Enable Audio" button first. |
| Tone demo loops endlessly | Loop checkbox enabled | Uncheck loop. |
| Tarot audio not applied | No matching tarot_card entries | Ensure codex nodes have `tarot_card` values matching a profile. |

### Tarot Audio Overlay
Each profile adds:
- `solfeggioHz`: base frequency anchor.
- `beatPattern`: symbolic rhythm (use k=kick, sn=snare, hh=hat, - or . = rest, | = bar split).
- `synthPreset`: semantic instrument hint for runtime mapping.
- `motifBias`: fallback motif if original node lacked one.

Run after base motif enrichment:
```bash
npm run codex:enrich:tarot
```

## Future Extensions
- Dynamic intensity crossfades.
- Live codex-to-audio websocket bridge.
- Probability-weighted motif transitions.

---
Generated automatically as part of stabilization pass (Oct 1 2025).
