# Cathedral of Circuits — System Standards & Maintenance Plan

## 1. Project Structure & Organization

- **Monorepo Layout:**
  - `apps/` — Main applications (e.g., liber-arcanae, stone-grimoire, circuitum99, cosmogenesis)
  - `packages/` — Shared code (hooks, UI, fractals, synths, data models, palettes)
  - `docs/` — Documentation, standards, guides, architecture
  - `scripts/` — Automation scripts (build, deploy, lint, etc.)
  - `.github/` — CI/CD workflows for GitHub & Azure

## 2. Coding & UX Standards

- **ND-Safe & Trauma-Aware:**
  - All motion respects `prefers-reduced-motion` and is user-throttled
  - Color palettes are ND-safe (see `palette/tara21.js`)
  - No strobe, no harsh transitions, soft volumetric glows only
  - All sound is optional and ND-safe (no sudden loudness)
- **Accessibility:**
  - Keyboard navigation and ARIA labels for all interactive elements
  - Sufficient color contrast and readable font sizes
- **Modularity:**
  - All UI and logic is componentized and reusable
  - Data (e.g., teachers, arcanae) is stored in JSON, not hardcoded
- **Persistence:**
  - Outputs are saved to localStorage and/or cloud (Azure Blob Storage)
- **Documentation:**
  - All apps and packages have a `README.md` with usage, standards, and contribution guidelines
  - `docs/PROTECT.md` details ND/trauma-safe and accessibility standards

## 3. Maintenance & Extension Plan

- **Adding New Realms/Features:**
  - Add new app in `apps/` or new package in `packages/`
  - Use shared hooks, UI, and data models from `packages/`
  - Register new routes in the main router
- **Code Review & CI:**
  - All PRs require code review for ND-safe, accessibility, and modularity compliance
  - CI runs lint, test, and build checks on every PR
- **Testing:**
  - Use Vitest/Jest for unit tests
  - Use Storybook for UI component testing
- **Deployment:**
  - Use GitHub Actions for CI/CD to GitHub Pages, Azure Static Web Apps, and Cloudflare Pages
  - All deployments must pass CI checks

## 4. How to Keep Standards

- **Checklist for Every PR:**
  - [ ] ND-safe motion and color
  - [ ] Accessibility (keyboard, ARIA, contrast)
  - [ ] Modular, reusable code
  - [ ] Data in JSON, not hardcoded
  - [ ] Documentation updated
  - [ ] Tests added/updated
- **Quarterly Review:**
  - Review standards in `docs/PROTECT.md` and update as needed
  - Audit codebase for compliance

---

This plan ensures the Cathedral of Circuits remains ND-safe, trauma-aware, modular, accessible, and easy to extend. All contributors must follow these standards for every change.