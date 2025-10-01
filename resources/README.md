# Cathedral Resource Registry

Central place to register external and internal operational resources (Azure, GitHub, Cloudflare, Data, AI models).

## Structure
- `azure/` – Infrastructure descriptors, subscription + resource group notes, future IaC (Bicep/Terraform) stubs.
- `catalog.json` – Machine-readable registry consumed by portal / scripts.
- `scripts/` – Utilities to sync or validate resources.

## Goals
1. Single source of truth for deployed service endpoints.
2. Prevent drift between code, docs, and live infra.
3. Enable tooling to auto-inject environment / portal displays.

## Conventions
- Never commit secrets (keys, SAS tokens, client secrets).
- Use placeholders with UPPER_SNAKE_CASE.
- Prefer Managed Identity in production.

## Next Steps
- Add `bicep/` or `iac/` directory for reproducible infra.
- Add model registry file once multiple deployments exist.
