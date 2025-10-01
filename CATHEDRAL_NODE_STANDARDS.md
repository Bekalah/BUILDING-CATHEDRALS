# Cathedral Node & Modular Design Standards (In-Universe Edition)

> An overheard colloquy in the Tower of Fusionists between Professor Alys (Fractal Systems), Doctor Vorn (Temporal Memory Architect), Archivist Sen (Ethical Provenance), and Matriarch Quill (Keeper of Accessibility).

---
## Scene I – The Argument of Imports
**Alys:** "We now standardize on ES Modules. `import`, not `require`. The old glyphs (CommonJS) are archived for archaeology only."

**Vorn:** "But performance?"  
**Alys:** "Deterministic graph resolution > ad‑hoc `require` side-effects."

**Rule 1:** All new Node scripts MUST be ESM. If legacy CommonJS persists, rename with `.cjs` or refactor.

**Rule 2:** Avoid dynamic `import()` unless lazy-loading large, optional subsystems.

---
## Scene II – The Order of Directories
**Sen:** "A cathedral without a catalog invites entropy."  
**Quill:** "Entropy erodes accessibility first."

**Mandated Layout (Monorepo Root):**
```
apps/                # Executable surfaces (each has package.json)
packages/            # Shared libraries (pure, side-effect free)
scripts/             # Automation (ESM, idempotent)
public/              # Static assets (hashed if large)
data/ (optional)     # Canonical master data (mirrored into apps/*/data)
CATHEDRAL_NODE_STANDARDS.md
```

**Rule 3:** Every `apps/<name>/` MUST contain: `package.json`, `README.md`, optional `data/`, `src/`.
**Rule 4:** Shared logic lives in `packages/` with clear exports and no implicit singletons.

---
## Scene III – The Codex Replication Rite
**Alys:** "The Codex is source-of-truth; replicas must never drift."

**Rule 5:** Never manually edit mirrored codex files inside app `data/` folders. Edit the primary canonical file (one of):
- `data/codex.144_99.json`
- `codex.144_99.json`
- `codex_144_nodes_template.json`

**Rule 6:** The automation script `scripts/auto-fix.js` performs: discovery, README standardization, codex mirroring, summary reporting.

---
## Scene IV – Accessibility & ND-Safety Canon
**Quill:** "A system that agitates the sensitive expels its own users."  
**Sen:** "Ethics = architecture with memory."  

Core Mandates:
- Respect reduced motion, contrast, audio toggles.
- No flashing > 3 Hz, no un-cued audio bursts.
- Provide ARIA labels, focus order, skip links.
- Document sensory load in component READMEs when atypical.

**Rule 7:** Any visual or audio engine module MUST export a `getSafetyMeta()` describing: `{ motion, luminanceRange, contrastRatio, audioPeaks }`.

---
## Scene V – Provenance & Licensing
**Sen:** "Attribution or deletion."  

**Rule 8:** Every third-party asset: include a short provenance block in nearest README or `ASSET_PROVENANCE.md`.
**Rule 9:** Default accepted statuses: `public-domain | CC0 | permissive | owned-original`. Anything else triggers review.

---
## Scene VI – Automation & CI Edicts
**Vorn:** "Humans forget. Pipelines remember."  

**Rule 10:** Automation scripts MUST be idempotent (multiple runs = stable state).
**Rule 11:** CI runs `node scripts/auto-fix.js` and fails if git diff appears after.
**Rule 12:** Security: no runtime `eval`, no unchecked external fetch in build scripts.

---
## Scene VII – Modularity & Purity
**Alys:** "Side-effects are architectural debt."  

**Rule 13:** Packages export pure functions or declarative objects; stateful orchestration resides in apps only.
**Rule 14:** Inject dependencies (no hidden global singletons) – pass adapters.
**Rule 15:** Data-driven patterns: game states, archetypes, palettes = JSON or YAML, not code literals.

---
## Scene VIII – Versioning & Drift Control
**Sen:** "Without snapshot lineage, restoration fails."  

**Rule 16:** Tag releases using semantic versioning at monorepo root (or use changesets). Include codex schema version.
**Rule 17:** If codex schema increments: generate `docs/CHANGELOG_CODEX.md` delta section automatically.

---
## Scene IX – Narrative Compliance Hooks
**Quill:** "Let story enforce structure through satire."  

Embed professor commentary in generated docs (non-breaking) to reinforce culture.

---
## Appendix – Quick Checklist
- [ ] ESM only
- [ ] App has README & safety block
- [ ] Codex mirrored (no manual drift)
- [ ] Accessibility meta implemented
- [ ] Provenance blocks present
- [ ] Automation idempotent
- [ ] No side-effectful shared packages
- [ ] Safety metadata exported where needed

---
_Last updated by the Tower of Fusionists Automation Council._
