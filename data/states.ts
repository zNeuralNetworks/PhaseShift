import { PhaseRoute, StateSurfaceConfig } from '../types';

export const STATE_SURFACES: StateSurfaceConfig[] = [
  {
    route: PhaseRoute.LOW_ENERGY,
    label: 'Low Energy',
    shortLabel: 'Energy',
    eyebrow: 'Activate without spiking',
    goal: 'Raise alertness with light, breath, and posture before reaching for more inputs.',
    accent: 'amber',
    hero: {
      title: '90-second activation breath',
      subtitle: 'Upright posture, nasal inhale, crisp exhale. Build energy without turning the app into a dashboard.',
      duration: '1.5 min',
      protocol: 'activation-breath',
      cta: 'Activate'
    },
    secondaryActions: [
      { title: 'Bright light', description: 'Face a window or step outside for two minutes.' },
      { title: 'Posture reset', description: 'Stand tall, unlock knees, pull shoulders down.' },
      { title: 'First task', description: 'Pick one visible next action before checking feeds.' }
    ],
    note: {
      title: 'Use when',
      body: 'You feel underpowered but not sleep-deprived enough to need a full recovery protocol.'
    }
  },
  {
    route: PhaseRoute.OVERSTIMULATED,
    label: 'Overstimulated',
    shortLabel: 'Downshift',
    eyebrow: 'Discharge excess arousal',
    goal: 'Lower physiological load quickly and reduce external input.',
    accent: 'rose',
    hero: {
      title: 'Physiological sigh set',
      subtitle: 'Two-part inhale, long exhale. A fast mechanical downshift for acute stress.',
      duration: '60 sec',
      protocol: 'physiological-sigh',
      cta: 'Downshift'
    },
    secondaryActions: [
      { title: 'PMR quick release', description: 'Tense hands and shoulders, then release completely.' },
      { title: 'Brown noise', description: 'Mask sudden sound while you reduce input.' },
      { title: 'Shuffle words', description: 'Use simple imagery to interrupt looping thoughts.' }
    ],
    note: {
      title: 'Avoid',
      body: 'Do not add analysis here. This state needs fewer decisions, dimmer input, and one obvious action.'
    }
  },
  {
    route: PhaseRoute.MENTALLY_FATIGUED,
    label: 'Mentally Fatigued',
    shortLabel: 'Recover',
    eyebrow: 'Recover cognitive capacity',
    goal: 'Step out of effort and run a short recovery protocol before more thinking.',
    accent: 'cyan',
    hero: {
      title: 'Rapid NSDR reset',
      subtitle: 'Eyes closed, body scan, no performance target. Designed for a short cognitive reset.',
      duration: '5 min',
      protocol: 'nsdr',
      cta: 'Recover'
    },
    secondaryActions: [
      { title: 'Alpha wash', description: 'Use a lighter focus/rest soundscape.' },
      { title: 'Walk cue', description: 'Two minutes outside with no phone input.' },
      { title: 'Body scan', description: 'Move attention from hands to shoulders to breath.' }
    ],
    note: {
      title: 'Boundary',
      body: 'This is recovery, not bedtime. Keep it short enough to return to useful work.'
    }
  },
  {
    route: PhaseRoute.DEEP_WORK,
    label: 'Deep Work',
    shortLabel: 'Focus',
    eyebrow: 'Lock in the next work block',
    goal: 'Protect attention with a short entry routine and low-motion focus surface.',
    accent: 'emerald',
    hero: {
      title: 'Focus sound block',
      subtitle: 'Start a restrained alpha soundscape and commit to one work target.',
      duration: '25 min',
      protocol: 'focus-sound',
      cta: 'Lock In'
    },
    secondaryActions: [
      { title: 'Single target', description: 'Write the deliverable in one sentence.' },
      { title: 'Input shutdown', description: 'Close chat, mail, and noisy tabs.' },
      { title: '50-minute block', description: 'Use only when the task is already clear.' }
    ],
    note: {
      title: 'Rule',
      body: 'Deep Work should not feel relaxing or sleepy. It should reduce choices and preserve attention.'
    }
  },
  {
    route: PhaseRoute.PRE_SLEEP,
    label: 'Pre-Sleep',
    shortLabel: 'Sleep',
    eyebrow: 'Prepare for sleep onset',
    goal: 'Wind down without turning bedtime into a control panel.',
    accent: 'violet',
    hero: {
      title: 'Wind-down breath',
      subtitle: 'Use a slow 4-7-8 rhythm, then let the screen become optional.',
      duration: '3 min',
      protocol: 'wind-down',
      cta: 'Wind Down'
    },
    secondaryActions: [
      { title: 'Pre-sleep story', description: 'Read a low-stimulation story in the dark reader.' },
      { title: 'Sleep timing', description: 'Check two full-cycle wake windows.' },
      { title: 'Room audit', description: 'Cool, dark, quiet. Fix only the obvious blocker.' }
    ],
    note: {
      title: 'Sleep stays core',
      body: 'Pre-Sleep owns sleep onset, but PhaseShift is broader than sleep hygiene.'
    }
  },
  {
    route: PhaseRoute.POST_WAKE,
    label: 'Post-Wake',
    shortLabel: 'Wake',
    eyebrow: 'Clear sleep inertia',
    goal: 'Anchor the day with light, movement, and a clean first action.',
    accent: 'yellow',
    hero: {
      title: 'Light anchor sequence',
      subtitle: 'Get upright, find bright light, and breathe into the first useful action.',
      duration: '2 min',
      protocol: 'wake-anchor',
      cta: 'Wake Cleanly'
    },
    secondaryActions: [
      { title: 'Caffeine timing', description: 'Delay if you can; avoid stacking caffeine on inertia.' },
      { title: 'Movement cue', description: 'Walk, stairs, or ten slow squats.' },
      { title: 'Circadian anchor', description: 'Same wake time beats perfect bedtime consistency.' }
    ],
    note: {
      title: 'Use when',
      body: 'You are awake but not online yet. Keep the first two minutes physical and simple.'
    }
  }
];

export const STATE_ROUTE_ORDER = [
  PhaseRoute.LOW_ENERGY,
  PhaseRoute.OVERSTIMULATED,
  PhaseRoute.MENTALLY_FATIGUED,
  PhaseRoute.DEEP_WORK,
  PhaseRoute.PRE_SLEEP,
  PhaseRoute.POST_WAKE,
  PhaseRoute.ROADMAP
];

export const getStateSurface = (route: PhaseRoute) =>
  STATE_SURFACES.find((state) => state.route === route);
