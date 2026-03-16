# Security Review - Cipherwill

Date: 2026-03-17
Reviewer: Codex automated + manual code audit
Scope: full repository review (client app, GraphQL integration, crypto/auth flows, API routes, build/runtime config, dependency audit)

## Executive Summary

I found **6 meaningful security issues**:

1. **Critical**: Hardcoded server-style authorization header in SSR GraphQL link.
2. **High**: Stored XSS path in executor note rendering.
3. **High**: Weak factor key derivation enables practical offline brute-force attacks.
4. **Medium**: Missing CSP while using inline scripts and HTML injection sinks.
5. **High**: Multiple critical/high transitive dependency vulnerabilities (mainly via MetaMask SDK dependency tree).
6. **Low**: Real secrets exist in local `.env*` files (ignored by git, but still operationally risky on shared/dev machines).

---

## Findings

### 1) Critical - Hardcoded authorization bypass token in SSR GraphQL link

**Impact**
- The code sends a constant authorization value (`"ratrio-srr-server"`) for SSR GraphQL requests.
- If backend accepts this value as trusted auth, it creates a bypass/backdoor path.
- Even if currently unused, leaving this in code is high-risk because future usage can silently re-enable privileged access.

**Evidence**
- `graphql/links/uploadLink.ts:26`

**Recommendation**
- Remove this hardcoded header immediately.
- Require short-lived, verifiable service credentials (server-only secret, signed JWT, mTLS, or private network identity).
- Add backend deny-rule for this literal token so it can never authenticate.
- Add a CI rule to block hardcoded auth headers/tokens.

---

### 2) High - Stored XSS in note execution view

**Impact**
- Note content is rendered via `dangerouslySetInnerHTML` without sanitization.
- Notes are authored/stored as HTML (`editor.getHTML()`), then later rendered for executor views.
- Malicious note HTML could execute script in user context, exfiltrate sensitive data, or perform account actions.

**Evidence**
- `app/executor/[id]/notes/[noteId]/page.tsx:71-73` (`dangerouslySetInnerHTML` sink)
- `app/app/data/notes/[id]/PodDetails.tsx:52` and `:74-78` (HTML generation + persistence)

**Recommendation**
- Sanitize before storage and/or before rendering (e.g., strict allowlist sanitizer like DOMPurify with locked config).
- Prefer rendering a structured rich-text model instead of raw HTML.
- Add CSP (see Finding #4) and test payloads for `<script>`, `onerror`, `javascript:` URLs, SVG payloads.

---

### 3) High - Authentication factor derivation is cryptographically weak

**Impact**
- Factor material is derived with single-round SHA-256 over low-entropy inputs, enabling offline guessing.
- Master password factor allows 4-character passwords and uses predictable 6-digit nonce space.
- MetaMask factor truncates signature to last 8 characters (about 32 bits), significantly reducing effective entropy.
- Factor `publicKey` + `nonce` are returned by API, enabling offline attack attempts if metadata leaks.

**Evidence**
- Master password creation: `components/app/factors/add/AddMasterPassword.tsx:65-70`, `:83`
- Master password verify: `contexts/SessionContext/MasterPassword.tsx:30-33`
- MetaMask creation: `components/app/factors/add/AddMetamask.tsx:67`, `:72-79`
- MetaMask verify: `contexts/SessionContext/Metamask.tsx:51-58`
- Exposed factor metadata query: `graphql/ops/auth/queries/AVAILABLE_AUTH_FACTORS.ts:9-10`

**Recommendation**
- Replace direct SHA-256 derivation with memory-hard KDF (Argon2id preferred; scrypt acceptable) and strong parameters.
- Enforce strong master password policy (length + entropy checks).
- Never truncate wallet signature entropy; use full cryptographic proof flow.
- Revisit factor protocol with formal threat model (offline DB leak scenario should not permit efficient key recovery).

---

### 4) Medium - Missing Content Security Policy (CSP) with inline scripts and HTML sinks

**Impact**
- Security headers are present, but CSP is absent.
- App uses inline scripts and has at least one HTML injection sink (`dangerouslySetInnerHTML`), increasing XSS blast radius.

**Evidence**
- Headers list does not include `Content-Security-Policy`: `next.config.js:13-34`
- Inline scripts present: `app/layout.tsx:58-90`

**Recommendation**
- Add strict CSP using nonces/hashes for required inline scripts.
- Start with report-only mode, then enforce.
- Restrict `script-src`, `connect-src`, `img-src`, `frame-ancestors`, `object-src`, `base-uri`.

---

### 5) High - Dependency vulnerabilities (critical/high) in transitive tree

**Impact**
- `yarn audit` reports multiple critical/high vulnerabilities in runtime dependencies (notably via `@metamask/sdk-react` -> `crypto-browserify` stack).
- Not all advisories are necessarily reachable in your exact execution paths, but the quantity/severity is too high to ignore.

**Evidence**
- `yarn audit --groups dependencies --level critical --json`
- Summary observed: `critical: 9`, `high: 29`, `moderate: 18`, `low: 9`
- Examples flagged: `pbkdf2`, `sha.js`, `minimatch`, `semver`, `bn.js`, `elliptic`

**Recommendation**
- Prioritize upgrades for critical advisories in runtime graph.
- Use `resolutions`/`overrides` to force patched subdeps where upstream lag exists.
- Add automated dependency scanning in CI and fail builds for critical vulns in production dependency tree.

---

### 6) Low - Real credentials in local env files (gitignored but present)

**Impact**
- The workspace contains real tokens/keys in `.env*` files.
- `git ls-files` shows these are currently **not tracked**, which is good, but they remain sensitive material on disk.

**Evidence**
- `.env.production:18-20`
- `.env.development:18-20`
- `.env.sentry-build-plugin:5`, `:11`
- Verified not tracked: `git ls-files .env.development .env.production .env.test .env.sentry-build-plugin` returned empty.

**Recommendation**
- Rotate exposed local secrets that were ever shared externally.
- Keep only `.env.example` in repo; never commit real values.
- Enforce pre-commit secret scanning (gitleaks/trufflehog) and CI secret scanning.

---

## Additional Notes

- The `dangerouslySetInnerHTML` use in careers page appears to serialize internal JSON-LD (`JSON.stringify`) and is lower risk than the note renderer path.
- I did not find evidence that ignored `.env` files are currently committed to git history in this working copy; if concerned, run a full secret-history scan on remote history.

## Suggested Remediation Order

1. Remove hardcoded SSR authorization token (Finding #1).
2. Fix stored XSS path + deploy CSP (Findings #2 and #4).
3. Redesign factor derivation/auth crypto (Finding #3).
4. Patch critical/high dependency vulnerabilities (Finding #5).
5. Rotate and harden secrets handling process (Finding #6).
