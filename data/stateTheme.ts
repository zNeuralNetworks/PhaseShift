import { AccentName } from '../types';

export type StateThemeMode = 'day' | 'night' | 'neutral';

export interface StateTheme {
  rgb: string;
  mode: StateThemeMode;
}

export const STATE_THEME: Record<AccentName, StateTheme> = {
  amber: { rgb: '245 158 11', mode: 'day' },
  rose: { rgb: '225 87 115', mode: 'night' },
  cyan: { rgb: '45 212 191', mode: 'neutral' },
  emerald: { rgb: '52 211 153', mode: 'day' },
  violet: { rgb: '167 139 250', mode: 'night' },
  yellow: { rgb: '234 179 8', mode: 'day' }
};
