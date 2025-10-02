# The Hitchhiker’s Guide to the Cathedral Realms (Field Edition)

> Compiled (and aggressively debated) by Professor Alys (Fractal Systems), Doctor Vorn (Temporal Memory Architect), Archivist Sen (Ethical Provenance), and Matriarch Quill (Keeper of Accessibility), with unauthorized margin jokes by Minor Sprite #442.

---
## 0. Read This Before Touching the Codex
DON'T PANIC. The Codex is a living lattice of archetypal nodes (144 + iterative harmonic expansions). You do not “edit” the mirrored copies— you tend the canonical source (`data/codex.144_99.json`). All app copies are botanical grafts renewed by `scripts/auto-fix.js`.

---
## 1. Realm Topology (or: Why Everything Is a Module)
Each realm/app (e.g. `arcanae-lab`, `stone-grimoire`, `cathedral-of-circuits`) is a facet. They share:
- Codex Mirror (`data/codex.144_99.json`)
- ND-Safety & Accessibility Covenant
- Provenance & Ethical Source Mandate
- Declarative Data (no hard-coded magical constants)

> Alys: “If you hard-code a symbol mapping, I will invert your gradients.”

---
## 2. The Prime Scripts (Engines of Ritual)
| Script | Function | Tone |
|--------|----------|------|
| `scripts/auto-fix.js` | Mirrors codex, standardizes READMEs, validates structure | Stern but fair |
| `scripts/validate-codex.mjs` | Ensures codex schema purity | Fastidious |
| `scripts/gen-integrity.mjs` | Hashes artifact lineage | Obsessive |
| `scripts/export-core.mjs` | Distills a distributable essence | Alchemical |

> Vorn: “Automation is just time travel with repeatable coordinates.”

---
## 3. ND-Safe / Trauma-Aware Ethos
Matriarch Quill insists:
- Motion honors `prefers-reduced-motion`.
- No strobe > 3 Hz.
- Audio must never ambush; give forewarning.
- Sensory intensity tunable: hooks like `useNDsafeMotion` expose meta states.

> Quill: “If the system disregards a sensitivity flag, it is excommunicated.”

---
## 4. Provenance & Ethical Fabric
Archivist Sen requires every non-original asset to have:
```
ASSET_PROVENANCE.md (or inline README block)
- origin: URL or citation
- license: public-domain | CC0 | permissive | owned-original
- checksum: <sha256>
- justification: (one line)
```
> Sen: “Attribution or oblivion.”

---
## 5. The Codex Node Anatomy
A node (simplified):
```json
{
  "node_id": 42,
  "numerology": 6,
  "geometry": "stellated-octagon",
  "element": "aether",
  "planet": "Venus",
  "chakra": "heart",
  "color_ray": "emerald",
  "sound": "F#",
  "tarot_card": ["The Lovers"],
  "teaching_function": "Relational harmonic coherence",
  "related_gates": [12, 77],
  "daemon_guardian": "Ophiel",
  "notes": "Experimental overlay permissible on equinox cycles."
}
```
Validated by `docs/CODEX_SCHEMA.json`.

---
## 6. Deployment Constellations
- GitHub Workflows: guard standards, export core, deploy Azure Static Web Apps (matrix).
- Secrets per app: `SWA_TOKEN_<appName>`.
- Post-export artifact: `cathedral-core` (inspect integrity manifest for drift).

> Vorn: “A failing standards guard is not a bug; it’s a chronal warning.”

---
## 7. Extending a Realm (Safe Recipe)
1. Add new component or dataset under correct `apps/<realm>/` directory.
2. Document sensory footprint in the component README.
3. Run `node scripts/auto-fix.js`.
4. If codex semantics changed: update schema + version bump in release notes.
5. Generate integrity manifest; commit.

> Alys: “Skipping documentation is thaumaturgically unstable.”

---
## 8. Integrity Ritual
```
node scripts/gen-integrity.mjs
cat INTEGRITY_MANIFEST.json | head
```
Compare across tagged releases to ensure no clandestine mutation.

---
## 9. Hitchhiker Field Survival Tips
- If something breaks after pull: run auto-fix first.
- Never manually patch mirrored codex files inside apps.
- Tools complaining about actions version locally? Push—GitHub resolves them.
- Use `--dry-run` before committing broad structural changes.

> Sprite #442: “If you see a TODO left by a daemon guardian, DO NOT delete it.”

---
## 10. Cultural Glossary
| Term | Meaning |
|------|---------|
| Lattice | The emergent relationship web of codex nodes |
| Harmonic Pack | Future bundle of themed node overlays |
| Safety Meta | Declarative description of sensory footprint |
| Integrity Delta | Diff of manifest hashes between releases |

---
## 11. Quick Start Spell
```bash
node scripts/auto-fix.js --dry-run
node scripts/auto-fix.js
node scripts/validate-codex.mjs
node scripts/export-core.mjs
node scripts/gen-integrity.mjs
```

DON'T PANIC. The Cathedral remembers.

_Compiled under the Lantern of Version 1.0.0_ ✨
