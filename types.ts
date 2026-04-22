export enum PhaseRoute {
  LOW_ENERGY = 'LOW_ENERGY',
  OVERSTIMULATED = 'OVERSTIMULATED',
  MENTALLY_FATIGUED = 'MENTALLY_FATIGUED',
  DEEP_WORK = 'DEEP_WORK',
  PRE_SLEEP = 'PRE_SLEEP',
  POST_WAKE = 'POST_WAKE',
  ROADMAP = 'ROADMAP'
}

export type AccentName = 'amber' | 'rose' | 'cyan' | 'emerald' | 'violet' | 'yellow';

export type ProtocolKind =
  | 'activation-breath'
  | 'physiological-sigh'
  | 'nsdr'
  | 'focus-sound'
  | 'wind-down'
  | 'wake-anchor';

export interface SecondaryAction {
  title: string;
  description: string;
}

export interface StateSurfaceConfig {
  route: PhaseRoute;
  label: string;
  shortLabel: string;
  eyebrow: string;
  goal: string;
  accent: AccentName;
  hero: {
    title: string;
    subtitle: string;
    duration: string;
    protocol: ProtocolKind;
    cta: string;
  };
  secondaryActions: SecondaryAction[];
  note: {
    title: string;
    body: string;
  };
}
