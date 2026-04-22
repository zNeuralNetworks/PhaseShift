import React from 'react';
import {
  CheckCircle2,
  Circle,
  Eye,
  Focus,
  Gauge,
  Layers,
  Map,
  Moon,
  PanelTopOpen,
  Palette,
  Route,
  ShieldCheck,
  SlidersHorizontal,
  Sunrise,
  TestTube2,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const milestones = [
  {
    status: 'live',
    title: 'State-Based IA',
    description: 'Six user states are the primary navigation model, keeping the app organized around what the user needs now.',
    icon: Map,
    phase: 'Phase 1'
  },
  {
    status: 'live',
    title: 'Action-First Surfaces',
    description: 'Each state opens on one primary protocol and capped secondary actions, with no dashboard prerequisite.',
    icon: Zap,
    phase: 'Phase 1'
  },
  {
    status: 'live',
    title: 'PhaseShift Visual System',
    description: 'Shared tokens, state accents, and primary/secondary/passive surfaces create a cohesive calm-performance identity.',
    icon: Palette,
    phase: 'Phase 1'
  },
  {
    status: 'live',
    title: 'Static Privacy Model',
    description: 'The current app remains local, static, and free of accounts, analytics, backend calls, or runtime secrets.',
    icon: ShieldCheck,
    phase: 'Phase 1'
  },
  {
    status: 'planned',
    title: 'Protocol Engine v1',
    description: 'Create a shared session model for start, pause, reset, elapsed time, active step, and cleanup behavior.',
    icon: Gauge,
    phase: 'Phase 2'
  },
  {
    status: 'planned',
    title: 'State-Specific Protocol Variants',
    description: 'Deepen activation, downshift, recovery, focus-entry, wind-down, and wake-anchor protocols without adding a tool catalog.',
    icon: Layers,
    phase: 'Phase 2'
  },
  {
    status: 'planned',
    title: 'Deep Work Blocks',
    description: 'Add practical 25/50 minute focus blocks with restrained sound, one target, and clear stop/resume behavior.',
    icon: Focus,
    phase: 'Phase 2'
  },
  {
    status: 'planned',
    title: 'Low-Light Accessibility Pass',
    description: 'Audit contrast, tap targets, reduced motion, and night-safe readability for low-cognition use.',
    icon: Eye,
    phase: 'Phase 2'
  },
  {
    status: 'planned',
    title: 'Pre-Sleep / Post-Wake Depth',
    description: 'Expand sleep timing, room audit, light exposure, caffeine timing, and wake inertia cues as one bounded state cluster.',
    icon: Sunrise,
    phase: 'Phase 2'
  },
  {
    status: 'concept',
    title: 'Local Preferences',
    description: 'Store optional local-only defaults for wake time, preferred protocols, theme mode, and sound volume.',
    icon: SlidersHorizontal,
    phase: 'Phase 3'
  },
  {
    status: 'concept',
    title: 'Quick Switch Actions',
    description: 'Offer fast pivots like too much, need focus, wind down, and wake up without turning the state rail into a menu maze.',
    icon: Route,
    phase: 'Phase 3'
  },
  {
    status: 'concept',
    title: 'PWA Install + Offline Cache',
    description: 'Improve repeat access and offline resilience while preserving the no-setup, static privacy posture.',
    icon: PanelTopOpen,
    phase: 'Phase 3'
  },
  {
    status: 'concept',
    title: 'OLED Midnight Mode',
    description: 'Add a true-black Pre-Sleep variant for users who need lower photon output at night.',
    icon: Moon,
    phase: 'Phase 3'
  },
  {
    status: 'concept',
    title: 'Playwright Smoke Tests',
    description: 'Cover state routes, hero protocols, secondary expansions, Deep Work audio, and Roadmap rendering.',
    icon: TestTube2,
    phase: 'Phase 3'
  }
];

const Roadmap: React.FC = () => {
  return (
    <motion.div
      className="pb-12"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      <header className="mb-8">
        <div className="ps-pill ps-pill-accent ps-type-brand mb-3 px-3 py-1">
          Product direction
        </div>
        <h1 className="ps-type-hero">PhaseShift Roadmap</h1>
        <p className="ps-type-body mt-2">
          A focused path toward faster state shifts, stronger protocols, and a calmer performance system.
        </p>
      </header>

      <div className="relative ml-4 space-y-8 border-l border-[var(--ps-border-subtle)]">
        {milestones.map((item) => (
          <motion.div
            key={item.title}
            className="relative pl-8"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div
              className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 ${
                item.status === 'live'
                  ? 'border-emerald-500/60 bg-emerald-950'
                  : item.status === 'planned'
                    ? 'border-orange-400/55 bg-orange-950'
                    : 'border-[var(--ps-border-subtle)] bg-[var(--ps-bg-elevated)]'
              }`}
            />
            <div
              className={`ps-card-secondary p-5 ${
                item.status === 'live' ? 'border-emerald-700/25 bg-emerald-950/10' : ''
              }`}
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <div className={`rounded-xl p-2 ${item.status === 'live' ? 'bg-emerald-950/40 text-emerald-200' : 'bg-[var(--ps-surface-passive)] text-[var(--ps-text-muted)]'}`}>
                  <item.icon size={20} />
                </div>
                <span
                  className={`ps-pill px-2 py-1 ps-type-brand ${
                    item.status === 'live'
                      ? 'border-emerald-700/30 bg-emerald-950/25 text-emerald-200'
                      : item.status === 'planned'
                        ? 'border-orange-700/30 bg-orange-950/25 text-orange-200'
                        : ''
                  }`}
                >
                  {item.status === 'live' ? 'Released' : item.phase}
                </span>
              </div>
              <h2 className="ps-type-title text-xl">{item.title}</h2>
              <p className="ps-type-body mt-2">{item.description}</p>
              {item.status === 'planned' && (
                <div className="ps-type-meta mt-4 flex items-center gap-2 text-orange-200/80">
                  <Circle size={8} className="fill-current" />
                  Planned
                </div>
              )}
            </div>
          </motion.div>
        ))}

        <motion.div className="relative pl-8 opacity-60" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 0.6, x: 0 }}>
          <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-emerald-900 bg-[var(--ps-bg-elevated)]">
            <CheckCircle2 size={12} className="-ml-[1px] -mt-[1px] text-emerald-700" />
          </div>
          <div className="p-5 pt-1">
            <h3 className="ps-type-section line-through decoration-stone-600">Feature-tab model</h3>
            <p className="ps-type-meta ps-subtle">Replaced by state-first PhaseShift IA.</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Roadmap;
