import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_PREFERENCES } from '../data/protocols';
import { PhaseShiftPreferences } from '../types';

const STORAGE_KEY = 'phaseshift.preferences.v1';

const clampVolume = (value: unknown) => {
  const volume = typeof value === 'number' ? value : DEFAULT_PREFERENCES.soundVolume;
  return Math.min(1, Math.max(0, volume));
};

const normalizePreferences = (value: unknown): PhaseShiftPreferences => {
  if (!value || typeof value !== 'object') return DEFAULT_PREFERENCES;
  const candidate = value as Partial<PhaseShiftPreferences>;

  return {
    theme: candidate.theme === 'midnight' ? 'midnight' : 'standard',
    focusBlockMinutes: candidate.focusBlockMinutes === 50 ? 50 : 25,
    soundVolume: clampVolume(candidate.soundVolume),
    wakeTime: typeof candidate.wakeTime === 'string' && /^\d{2}:\d{2}$/.test(candidate.wakeTime)
      ? candidate.wakeTime
      : DEFAULT_PREFERENCES.wakeTime,
    focusTarget: typeof candidate.focusTarget === 'string' ? candidate.focusTarget.slice(0, 80) : ''
  };
};

export const usePhaseShiftPreferences = () => {
  const [preferences, setPreferencesState] = useState<PhaseShiftPreferences>(() => {
    if (typeof window === 'undefined') return DEFAULT_PREFERENCES;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? normalizePreferences(JSON.parse(raw)) : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  useEffect(() => {
    document.documentElement.dataset.psTheme = preferences.theme;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const setPreferences = useCallback((next: Partial<PhaseShiftPreferences>) => {
    setPreferencesState((current) => normalizePreferences({ ...current, ...next }));
  }, []);

  return { preferences, setPreferences };
};
