import { useCallback, useEffect, useMemo, useState } from 'react';
import { PhaseRoute } from '../types';

interface ProtocolSessionOptions {
  route: PhaseRoute;
  durationSeconds: number;
  stepCount: number;
  stepIntervalSeconds: number;
}

export const useProtocolSession = ({
  route,
  durationSeconds,
  stepCount,
  stepIntervalSeconds
}: ProtocolSessionOptions) => {
  const [active, setActive] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setActive(false);
    setCompleted(false);
    setElapsed(0);
  }, [route, durationSeconds]);

  useEffect(() => {
    if (!active) return undefined;

    const interval = window.setInterval(() => {
      setElapsed((value) => {
        const next = Math.min(value + 1, durationSeconds);
        if (next >= durationSeconds) {
          setActive(false);
          setCompleted(true);
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [active, durationSeconds]);

  const toggle = useCallback(() => {
    setActive((value) => {
      if (completed && !value) {
        setCompleted(false);
        setElapsed(0);
      }
      return !value;
    });
  }, [completed]);

  const reset = useCallback(() => {
    setActive(false);
    setCompleted(false);
    setElapsed(0);
  }, []);

  const stepIndex = useMemo(() => {
    if (stepCount <= 0) return 0;
    return Math.floor(elapsed / stepIntervalSeconds) % stepCount;
  }, [elapsed, stepCount, stepIntervalSeconds]);

  const progress = durationSeconds > 0 ? elapsed / durationSeconds : 0;

  return {
    active,
    completed,
    elapsed,
    progress,
    stepIndex,
    toggle,
    reset
  };
};
