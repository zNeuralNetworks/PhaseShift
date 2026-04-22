# PhaseShift Technical Design

Last updated: 2026-04-22

## Summary

PhaseShift is a client-only React/Vite app. It builds to static assets, copies them into an nginx runtime image, and deploys to Cloud Run. It currently has no runtime Node.js server, backend API, database, auth, analytics, or secret requirement.

Source repository: `https://github.com/zNeuralNetworks/PhaseShift`.

## Core Types

`types.ts` defines:

- `PhaseRoute`: six user states plus Roadmap.
- `ProtocolKind`: primary protocol variants.
- `StateSurfaceConfig`: state page content and action contract.
- `SecondaryAction`: capped secondary action model.

## Main Modules

| File | Responsibility |
| --- | --- |
| `App.tsx` | Active route state, lazy loading, shell composition |
| `components/Navigation.tsx` | Scrollable top state rail |
| `components/StateSurface.tsx` | Hero protocol UI, secondary actions, local timers/audio |
| `components/Roadmap.tsx` | Static roadmap timeline |
| `data/states.ts` | Product IA and state content |
| `data/protocols.ts` | Protocol scripts, story content, words, sound presets |

## Protocol Behavior

| Protocol | Current Implementation |
| --- | --- |
| Activation breath | Timed visual step loop |
| Physiological sigh | Timed visual step loop |
| NSDR | Timed step loop plus self-guided script cue |
| Focus sound | Web Audio generated soundscape with local lifecycle cleanup |
| Wind-down | Timed visual breath loop |
| Wake anchor | Timed visual step loop |

Audio starts only after explicit user action and stops on pause/reset/unmount.

## Build Scripts

| Script | Command |
| --- | --- |
| `dev` | `vite` |
| `build` | `vite build` |
| `typecheck` | `tsc --noEmit` |
| `check` | `npm run typecheck && npm run build` |

## Deployment Defaults

| Setting | Value |
| --- | --- |
| Cloud Run service | `phaseshift` |
| Artifact Registry repo | `phaseshift` |
| Region | `us-central1` |
| Runtime port | `8080` |

## Technical Risks

| Risk | Mitigation |
| --- | --- |
| `StateSurface.tsx` grows too large | Split protocols into child components when adding depth |
| Audio lifecycle regressions | Keep explicit stop on pause, reset, route change, and unmount |
| Navigation crowding | Preserve horizontal state rail; do not return to seven bottom tabs |
| Dashboard creep | Keep state notes below hero action and secondary actions |
| Browser API differences | Feature-detect Web Audio and degrade silently |
