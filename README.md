# PhaseShift

PhaseShift is an offline, mobile-first React app for fast state shifts across energy, arousal, fatigue, focus, pre-sleep, and post-wake contexts. It is intentionally not a recommendation dashboard, tracker, or generic wellness catalog.

Production target:

- GitHub repo: `https://github.com/zNeuralNetworks/PhaseShift`
- GCP build system: Cloud Build
- Runtime: Cloud Run
- Container registry: Artifact Registry

Core interaction:

1. Pick the state you are in.
2. Start the primary protocol.
3. Use at most three secondary actions if needed.

## App Stack

| Layer | Technology |
| --- | --- |
| UI | React 19 |
| Build | Vite 6 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite` |
| Motion | Framer Motion |
| Icons | lucide-react |
| Runtime server | nginx on port `8080` |

The app has no backend, database, auth, analytics, or runtime secrets. Current protocols and content run client-side.

## Repository Layout

| Path | Purpose |
| --- | --- |
| `App.tsx` | App shell, state-route selection, lazy-loaded surfaces |
| `components/Navigation.tsx` | Horizontal state rail navigation |
| `components/StateSurface.tsx` | Shared state-page layout and local protocol interactions |
| `components/Roadmap.tsx` | In-app PhaseShift roadmap |
| `data/states.ts` | State IA, hero actions, secondary actions, and notes |
| `data/protocols.ts` | Static protocol content, story, words, scripts, and sound presets |
| `types.ts` | Shared route, accent, protocol, and state config types |
| `index.css` | Tailwind import, font theme, global utilities |
| `cloudbuild.yaml` | Cloud Build pipeline for Artifact Registry and Cloud Run |
| `Dockerfile` + `nginx.conf` | Static production image served by nginx |

## State Model

| State | Primary Action |
| --- | --- |
| Low Energy | Activation breath |
| Overstimulated | Physiological sigh |
| Mentally Fatigued | Rapid NSDR reset |
| Deep Work | Focus sound block |
| Pre-Sleep | Wind-down breath |
| Post-Wake | Light anchor sequence |
| Roadmap | Product direction |

## Local Development

Prerequisite: Node.js 20+

```bash
npm install
npm run dev
```

Default dev URL:

```text
http://localhost:3000
```

## Local Verification

Run before handoff:

```bash
npm run check
```

This runs TypeScript validation and a production Vite build.

For container/deploy changes:

```bash
docker build -t phaseshift:local .
docker run --rm -p 8080:8080 phaseshift:local
```

Open:

```text
http://localhost:8080
```

## Product Guardrails

- Keep states action-first.
- Do not add a generic dashboard, scoring engine, or recommendation workflow.
- Keep sleep as one core state cluster, not the whole product.
- Keep copy conservative: PhaseShift can support state shifts, not diagnose or treat conditions.
- Preserve the static/offline privacy posture unless a feature explicitly needs backend state.
