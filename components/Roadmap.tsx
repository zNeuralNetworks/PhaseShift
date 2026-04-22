import React from 'react';
import {
  Activity,
  BatteryCharging,
  Brain,
  CheckCircle2,
  Circle,
  Focus,
  Map,
  Moon,
  Move,
  Palette,
  Sunrise,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const milestones = [
  {
    status: 'live',
    title: 'State-Based IA',
    description: 'PhaseShift now uses user states as primary navigation: Low Energy, Overstimulated, Mentally Fatigued, Deep Work, Pre-Sleep, and Post-Wake.',
    icon: Map,
    phase: 'Phase 1'
  },
  {
    status: 'live',
    title: 'Fast Protocol Surfaces',
    description: 'Each state opens on one hero action with no dashboard prerequisite, preserving the original low-friction utility model.',
    icon: Zap,
    phase: 'Phase 1'
  },
  {
    status: 'live',
    title: 'Pre-Sleep Preserved',
    description: 'Sleep remains a core function through wind-down breathing, story content, sleep timing, and room audit cues.',
    icon: Moon,
    phase: 'Phase 1'
  },
  {
    status: 'live',
    title: 'Recovery Protocols',
    description: 'NSDR, PMR, shuffle imagery, and generated soundscapes are reframed as state-shift tools instead of a generic relaxation catalog.',
    icon: Brain,
    phase: 'Phase 1'
  },
  {
    status: 'planned',
    title: 'Protocol Component Split',
    description: 'Move breathing, soundscape, NSDR, story, and timing logic into dedicated child components and hooks as interaction depth grows.',
    icon: Activity,
    phase: 'Phase 2'
  },
  {
    status: 'planned',
    title: 'State-Specific Protocol Variants',
    description: 'Add richer activation, downshift, focus-entry, recovery, wind-down, and wake-anchor variants while keeping one primary action per state.',
    icon: BatteryCharging,
    phase: 'Phase 2'
  },
  {
    status: 'planned',
    title: 'Deep Work Timer',
    description: 'Add 25/50 minute work blocks with restrained audio and clear stop/resume behavior, without turning PhaseShift into a productivity suite.',
    icon: Focus,
    phase: 'Phase 2'
  },
  {
    status: 'concept',
    title: 'Visual State System',
    description: 'Refine accents, contrast, and motion so daytime states feel clear while Pre-Sleep remains night-safe.',
    icon: Palette,
    phase: 'Phase 3'
  },
  {
    status: 'concept',
    title: 'Post-Wake Depth',
    description: 'Explore local-only wake anchors, caffeine timing guidance, and light exposure prompts without adding tracking or accounts.',
    icon: Sunrise,
    phase: 'Phase 3'
  },
  {
    status: 'concept',
    title: 'Motion Hardening',
    description: 'Tune transitions and active protocol animation for low-cognition use across mobile viewports.',
    icon: Move,
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
        <div className="mb-3 inline-flex rounded-full border border-orange-500/30 bg-orange-950/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-orange-200">
          Product direction
        </div>
        <h1 className="text-4xl font-serif text-stone-100">PhaseShift Roadmap</h1>
        <p className="mt-2 text-sm leading-relaxed text-stone-500">
          The roadmap stays in-app, but it now tracks the shift from a sleep utility to a state-based performance tool.
        </p>
      </header>

      <div className="relative ml-4 space-y-10 border-l-2 border-stone-800">
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
                  ? 'border-green-500 bg-green-900'
                  : item.status === 'planned'
                    ? 'border-orange-500 bg-orange-950'
                    : 'border-stone-700 bg-stone-900'
              }`}
            />
            <div
              className={`rounded-2xl border p-5 ${
                item.status === 'live' ? 'border-green-900/30 bg-green-950/10' : 'border-stone-800 bg-stone-900/40'
              }`}
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <div className={`rounded-xl p-2 ${item.status === 'live' ? 'bg-green-900/20 text-green-300' : 'bg-stone-800 text-stone-300'}`}>
                  <item.icon size={20} />
                </div>
                <span
                  className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                    item.status === 'live'
                      ? 'border-green-900/40 bg-green-900/20 text-green-300'
                      : item.status === 'planned'
                        ? 'border-orange-900/40 bg-orange-900/20 text-orange-300'
                        : 'border-stone-700 bg-stone-800 text-stone-500'
                  }`}
                >
                  {item.status === 'live' ? 'Released' : item.phase}
                </span>
              </div>
              <h2 className={`font-serif text-lg ${item.status === 'live' ? 'text-green-100' : 'text-stone-100'}`}>{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-stone-500">{item.description}</p>
              {item.status === 'planned' && (
                <div className="mt-4 flex items-center gap-2 text-xs text-orange-300/80">
                  <Circle size={8} className="fill-current" />
                  Planned
                </div>
              )}
            </div>
          </motion.div>
        ))}

        <motion.div className="relative pl-8 opacity-60" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 0.6, x: 0 }}>
          <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-green-900 bg-stone-800">
            <CheckCircle2 size={12} className="-ml-[1px] -mt-[1px] text-green-700" />
          </div>
          <div className="p-5 pt-1">
            <h3 className="text-sm font-medium text-stone-400 line-through decoration-stone-600">Feature-tab model</h3>
            <p className="text-xs text-stone-600">Replaced by state-first PhaseShift IA.</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Roadmap;
