# PhaseShift Security Best Practices Report

Date: 2026-04-22

## Executive Summary

Security audit completed for the static React/Vite PhaseShift app before publishing to GitHub. No critical or high-severity application issues were found. Dependency audit reports zero known vulnerabilities. The repo contains no backend, auth, database, runtime secrets, network API path, or client-side storage of sensitive data.

One low-severity deployment hardening gap was identified and fixed: the nginx container now sends baseline browser security headers, including CSP, clickjacking protection, content-type sniffing protection, referrer policy, and permissions policy.

## Audit Scope

- React 19 + TypeScript frontend code.
- Vite static build entrypoints.
- Docker/nginx runtime configuration.
- Cloud Build deployment configuration.
- Repo content for secrets, risky DOM sinks, public env exposure, cross-window messaging, storage, redirects, and dependency vulnerabilities.

## Checks Run

```bash
npm audit --audit-level=low
rg -n "dangerouslySetInnerHTML|innerHTML|outerHTML|insertAdjacentHTML|document\\.write|eval\\(|new Function|postMessage|localStorage|sessionStorage|import\\.meta\\.env|process\\.env|VITE_|apiKey|secret|token|password|window\\.location|window\\.open" -g '!*node_modules*' -g '!dist'
find . -maxdepth 3 -type f \( -name '.env*' -o -name '*.pem' -o -name '*.key' -o -name '*secret*' -o -name '*token*' \) -not -path './node_modules/*' -not -path './dist/*'
npm run check
docker build -t phaseshift:local .
docker run --rm -p 8081:8080 phaseshift:local
curl -sI http://localhost:8081
```

## Critical Findings

None.

## High Findings

None.

## Medium Findings

None.

## Low Findings

### SEC-001: Missing Browser Security Headers In Static Container

- Rule ID: REACT-HEADERS-001
- Severity: Low
- Location: `nginx.conf`, server and location blocks
- Evidence before fix: nginx only emitted cache headers and did not define CSP, clickjacking, content sniffing, referrer, or permissions policy headers.
- Impact: The app has a low attack surface, but missing defense-in-depth headers weakens browser enforcement if a future XSS sink, third-party script, or embedding risk is introduced.
- Fix applied: Added `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`.
- Mitigation notes: CSP allows `style-src 'unsafe-inline'` because the current React/Framer Motion UI relies on inline style attributes and Google Fonts. Script execution remains restricted to `'self'`; no `unsafe-inline` or `unsafe-eval` is allowed for scripts.

## Informational Notes

- `npm audit --audit-level=low` returned `found 0 vulnerabilities`.
- `npm run check` passed.
- `docker build -t phaseshift:local .` passed and also reported `found 0 vulnerabilities` during `npm ci`.
- Runtime header smoke test against the local nginx container confirmed the expected CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy` headers.
- No committed `.env`, key, PEM, token, or secret-like files were found in the repo scan.
- No `dangerouslySetInnerHTML`, direct HTML injection sinks, `eval`, `new Function`, string timers, `postMessage`, browser storage, public env vars, or open redirect patterns were found in app source.
- `cloudbuild.yaml` deploys with `--allow-unauthenticated`, which is expected for a public static web app.
- `dist/` exists locally as generated output and should remain uncommitted.
