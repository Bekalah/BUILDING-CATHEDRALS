# Cathedral Development Workspace

**🏗️ BUILDING CATHEDRALS** → **🌐 bekalah.github.io/cathedral**

This is your development workspace that builds and deploys to your actual cathedral website.

## ⚡ Technology Stack

- **Vite**: Lightning-fast build tool
- **React**: Component framework
- **Three.js**: 3D graphics and interactions
- **NEVER**: Flat HTML, SVG-only designs
- **ALWAYS**: Interactive 3D, ND-safe experiences

## 🚀 Quick Start

```bash
# Start development
./cathedral-manager.sh dev

# Build for production
./cathedral-manager.sh build

# Deploy to live site
./cathedral-manager.sh deploy

# Check status
./cathedral-manager.sh status
```

## 📁 Workspace → Production Flow

```
BUILDING CATHEDRALS/     (Development)
├─ src/                  → Build with Vite
├─ apps/                 → React + Three.js components
├─ packages/             → Shared modules
└─ dist/                 → Built output

    ↓ Deploy Script ↓

bekalah.github.io/cathedral/  (Live Site)
└─ Interactive 3D experience
```

## Overview

This repository implements the Cathedral of Circuits system, a trauma-aware, ND-safe, modular, and accessible art/game/research engine. It is organized as a monorepo with apps, shared packages, and strict standards for accessibility, ND-safety, and modularity.

## Repository Structure

### Main Repository (BUILDING-CATHEDRALS)

- `apps/` — Main applications (arcanae-lab, cathedral-of-circuits, stone-grimoire)
- `packages/` — Shared code (hooks, sound-kernel, UI components)
- `src/` — Core application source code
- `public/` — Static assets and exported sites
- `exports/` — Generated sites and artifacts

### Separate Specialized Repositories

- **[cathedral-research](https://github.com/Bekalah/cathedral-research)** — Research materials, papers, and experimental code
- **[cathedral-technical](https://github.com/Bekalah/cathedral-technical)** — Technical components, engines, scripts, and processors
- **[cathedral-docs](https://github.com/Bekalah/cathedral-docs)** — Documentation, instructions, and guides

### CI/CD

- `.github/` — GitHub Actions workflows for deployment to GitHub Pages & Azure

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
