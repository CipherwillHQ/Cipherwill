# Security Remediation TODOs

Source: `security.md` (2026-03-17)

## Priority Queue

- [x] **Issue 1 (Critical)**: Remove hardcoded SSR GraphQL authorization token and replace with secure server credential flow.
- [ ] **Issue 2 (High)**: Eliminate stored XSS path in executor note rendering (`dangerouslySetInnerHTML` without sanitization).
- [ ] **Issue 3 (High)**: Redesign factor derivation (master-password / metamask / passkey) with strong KDF and stronger entropy guarantees.
- [ ] **Issue 4 (Medium)**: Add and enforce CSP with nonce/hash strategy for required inline scripts.
- [ ] **Issue 5 (High)**: Patch critical/high runtime dependency vulnerabilities and pin transitive packages where needed.
- [ ] **Issue 6 (Low)**: Harden secret handling workflow (rotation + `.env.example` + secret scanning hooks/CI).

## Issue 1 Plan (Completed)

- [x] Identify hardcoded token usage in SSR GraphQL path.
- [x] Replace literal token with server-only environment variable.
- [x] Ensure no insecure fallback path remains.
- [x] Verify no runtime regressions for changed file (`yarn lint --file graphql/links/uploadLink.ts`).
- [x] Set `SSR_API_AUTH_TOKEN` in deployment secrets and remove any backend acceptance of legacy token value.
