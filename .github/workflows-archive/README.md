This directory stores the original (full) GitHub Actions workflows that were archived to remove local VS Code validation errors.

To restore CI/CD:
1. Move the desired `*.orig.yml` file back into `.github/workflows/` (renaming to drop `.orig`).
2. Commit and push.
3. Delete or keep the stub file (optional) in the active workflows directory.

Archived on: 2025-10-01
