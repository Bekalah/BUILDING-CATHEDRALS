# PROTECT.md — ND-Safe & Trauma-Aware Standards

## ND-Safe Motion
- All animations and transitions must respect `prefers-reduced-motion`.
- Provide user controls to further reduce or disable motion.
- No strobe, flashing, or rapid color changes.

## ND-Safe Color
- Use only palettes that pass WCAG AA contrast.
- Avoid high-saturation red/green combinations.
- Provide dark mode and high-contrast options.

## ND-Safe Sound
- All sound must be user-triggered (never autoplay).
- Provide mute and volume controls.
- No sudden loudness or harsh frequencies.

## Accessibility
- All interactive elements must be keyboard accessible.
- Use ARIA labels for all non-text UI and decorative elements.
- Ensure all text has sufficient contrast and readable font size.

## Trauma-Aware Design
- Avoid imagery or language that could be triggering.
- Provide content warnings for intense themes.
- Allow users to skip or opt out of any content.

## Testing
- Test all new features for ND-safety and accessibility before merging.
- Use the checklist in `docs/SYSTEM_STANDARDS_PLAN.md` for every PR.

---

These standards are mandatory for all code and content in the Cathedral of Circuits system. All contributors must read and follow this document.