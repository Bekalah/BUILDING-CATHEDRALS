# README: Cathedral of Circuits — ND-Safe Modular System

## Overview
This repository implements the Cathedral of Circuits system, a trauma-aware, ND-safe, modular, and accessible art/game/research engine. It is organized as a monorepo with apps, shared packages, and strict standards for accessibility, ND-safety, and modularity.

## Structure
- `apps/` — Main applications (e.g., liber-arcanae, stone-grimoire, circuitum99, cosmogenesis)
- `packages/` — Shared code (hooks, UI, fractals, synths, data models, palettes)
- `docs/` — Documentation, standards, guides, architecture
- `scripts/` — Automation scripts (build, deploy, lint, etc.)
- `.github/` — CI/CD workflows for GitHub & Azure

## Key Standards
- **ND-Safe & Trauma-Aware:** All motion and sound respects user settings and ND-safety. Color palettes are ND-safe. No strobe or harsh transitions.
- **Accessibility:** Keyboard navigation, ARIA labels, and color contrast are enforced.
- **Modularity:** All UI and logic is componentized and reusable. Data is stored in JSON, not hardcoded.
- **Persistence:** Outputs are saved to localStorage and/or cloud (Azure Blob Storage).
- **Documentation:** All modules have a README and usage/standards notes. See `docs/SYSTEM_STANDARDS_PLAN.md` and `docs/PROTECT.md`.

## How to Contribute
1. Fork and clone the repo.
2. Add or update code in the appropriate app or package.
3. Ensure all code is ND-safe, accessible, and modular.
4. Add or update tests and documentation.
5. Submit a pull request. All PRs require code review for standards compliance.

## Testing & Linting
- Run `npm run test` for unit tests (Vitest/Jest).
- Run `npm run lint` for linting (ESLint/Prettier).
- Use Storybook for UI component testing.

## Deployment
- Use GitHub Actions for CI/CD to GitHub Pages, Azure Static Web Apps, and Cloudflare Pages.
- All deployments must pass CI checks.

## Maintenance
- Review standards quarterly (see `docs/SYSTEM_STANDARDS_PLAN.md`).
- Audit codebase for compliance.

---

For more, see the full standards plan in `docs/SYSTEM_STANDARDS_PLAN.md` and ND/trauma-safe details in `docs/PROTECT.md`.
