# PhaseShift Agent Notes

## Project Shape

- Vite + React + TypeScript single-page app.
- Styling is Tailwind CSS v4 through `@tailwindcss/vite`; do not reintroduce the browser CDN.
- App is offline/static today. There is no backend, auth, database, API call path, or runtime secret requirement.
- Target deployment path is GitHub `zNeuralNetworks/PhaseShift` to GCP Cloud Build, building a container and deploying to Cloud Run. The current Cloud Run service and Artifact Registry defaults are `phaseshift`.

## Product Direction

- PhaseShift is a state-based performance app built around fast, actionable state shifts.
- Primary IA is user state: Low Energy, Overstimulated, Mentally Fatigued, Deep Work, Pre-Sleep, Post-Wake, Roadmap.
- Do not turn the app into a recommendation dashboard, scoring system, generic wellness catalog, or productivity suite.
- Each state should start with one hero action and no more than three secondary actions.
- Sleep remains one core function through Pre-Sleep and Post-Wake, not the whole product identity.

## Key Files

- `App.tsx`: app shell, active `PhaseRoute`, lazy-loaded state surfaces, roadmap integration.
- `components/Navigation.tsx`: horizontal top state rail plus compact quick-switch actions.
- `components/StateSurface.tsx`: shared action-first state page, protocol UI, secondary details, and local preference controls.
- `components/Roadmap.tsx`: in-app PhaseShift roadmap/status content.
- `data/states.ts`: state IA, hero actions, secondary actions, and state notes.
- `data/protocols.ts`: protocol definitions, static content, story excerpt, shuffle words, NSDR script, action details, sound presets, and default preferences.
- `hooks/useProtocolSession.ts`: shared session timing for start, pause, reset, progress, step index, and completion.
- `hooks/usePhaseShiftPreferences.ts`: local-only preference persistence through `localStorage`.
- `public/manifest.webmanifest` + `public/sw.js`: install metadata and static offline cache.
- `tests/smoke.spec.ts`: Playwright mobile smoke coverage for routing, protocol controls, preferences, and roadmap.
- `index.css`: Tailwind import plus custom global theme, scrollbar, safe-area, animation, and prose utilities.
- `cloudbuild.yaml`: Artifact Registry build/push and Cloud Run deploy.
- `Dockerfile` + `nginx.conf`: production static build served by nginx on port `8080`.
- `docs/ARCHITECTURE.md`: runtime boundaries, module topology, deployment flow, and architecture guardrails.
- `docs/PRODUCT_DESIGN.md`: product goals, state model, UX requirements, roadmap, and product risks.
- `docs/TECHNICAL_DESIGN.md`: implementation design, build/deploy mechanics, testing, and technical debt.

## Code Review Graph

- This project has a local code-review graph at `.code-review-graph/graph.db`.
- Prefer the code-review-graph MCP tools before broad file scans when exploring, reviewing, or tracing impact.
- Rebuild the graph after meaningful source changes:

```bash
uvx code-review-graph build --repo .
```

- Check graph status with:

```bash
uvx code-review-graph status --repo .
```

- Keep `.code-review-graph/` out of git. It is generated local state.

## Working Rules

- Keep changes small and app-local. This is a mobile-first state-shift utility, not a marketing site.
- Prefer functional React components, typed data structures, and local constants for static content.
- Keep copy medically conservative: PhaseShift can support state shifts and relaxation, not diagnosis or treatment claims.
- Avoid adding services, environment variables, or network calls unless the feature explicitly needs them.
- Use lucide-react icons for UI controls when available.
- Preserve the action-first hierarchy: state header, hero protocol, secondary actions, short note.

## Verification

Run before handing off code changes:

```bash
npm run check
npm run test:smoke
```

For container/deploy changes, also run:

```bash
docker build -t phaseshift:local .
docker run --rm -p 8080:8080 phaseshift:local
```

Then open `http://localhost:8080`.

## Known Follow-Ups

- Split `components/StateSurface.tsx` into dedicated protocol components if protocol depth expands.
- Add an ESLint/Prettier policy before broad refactors.
- Split `components/StateSurface.tsx` further if secondary action depth keeps growing.
