import React, { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  Clock,
  Headphones,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Square,
  Wind
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { NSDR_SCRIPT, PMR_QUICK_STEPS, PRE_SLEEP_STORY, SHUFFLE_WORDS, SOUND_PRESETS } from '../data/protocols';
import { STATE_THEME } from '../data/stateTheme';
import { ProtocolKind, StateSurfaceConfig } from '../types';

interface StateSurfaceProps {
  state: StateSurfaceConfig;
}

type SoundPreset = (typeof SOUND_PRESETS)[keyof typeof SOUND_PRESETS];

const protocolSteps: Record<ProtocolKind, string[]> = {
  'activation-breath': ['Stand tall', 'Inhale sharply', 'Exhale cleanly', 'Eyes up'],
  'physiological-sigh': ['Inhale', 'Top-up inhale', 'Long exhale', 'Settle'],
  nsdr: ['Contact points', 'Right side', 'Left side', 'Breath'],
  'focus-sound': ['Target', 'Sound on', 'Work block', 'Hold line'],
  'wind-down': ['Inhale', 'Hold', 'Exhale', 'Dim input'],
  'wake-anchor': ['Upright', 'Bright light', 'Move', 'First action']
};

const getSoundPreset = (protocol: ProtocolKind): SoundPreset => {
  if (protocol === 'focus-sound') return SOUND_PRESETS.focus;
  if (protocol === 'nsdr') return SOUND_PRESETS.rest;
  return SOUND_PRESETS.sleep;
};

const formatWakeTime = (cycles: number) => {
  const wake = new Date();
  wake.setMinutes(wake.getMinutes() + 15 + cycles * 90);
  return wake.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const createSoundscape = (preset: SoundPreset) => {
  const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) return null;

  const ctx = new AudioContextCtor();
  const bufferSize = ctx.sampleRate * 4;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0;

  for (let i = 0; i < bufferSize; i += 1) {
    const white = Math.random() * 2 - 1;
    data[i] = preset.noiseType === 'brown' ? (lastOut + 0.02 * white) / 1.02 : (lastOut + 0.05 * white) / 1.05;
    lastOut = data[i];
    if (preset.noiseType === 'brown') data[i] *= 3.5;
  }

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = buffer;
  noiseSource.loop = true;

  const noiseGain = ctx.createGain();
  noiseGain.gain.value = preset.noiseType === 'brown' ? 0.14 : 0.11;
  noiseSource.connect(noiseGain).connect(ctx.destination);

  const leftOsc = ctx.createOscillator();
  const rightOsc = ctx.createOscillator();
  const leftPan = ctx.createStereoPanner();
  const rightPan = ctx.createStereoPanner();
  const beatGain = ctx.createGain();

  leftOsc.frequency.value = preset.baseFreq;
  rightOsc.frequency.value = preset.baseFreq + preset.beatFreq;
  leftPan.pan.value = -1;
  rightPan.pan.value = 1;
  beatGain.gain.value = 0.035;

  leftOsc.connect(leftPan).connect(beatGain);
  rightOsc.connect(rightPan).connect(beatGain);
  beatGain.connect(ctx.destination);

  noiseSource.start();
  leftOsc.start();
  rightOsc.start();

  return {
    ctx,
    stop: () => {
      noiseSource.stop();
      leftOsc.stop();
      rightOsc.stop();
      ctx.close();
    }
  };
};

const SecondaryDetail: React.FC<{ title: string; state: StateSurfaceConfig }> = ({ title, state }) => {
  if (title.includes('Shuffle')) {
  return (
      <div className="ps-card-passive p-5 text-center">
        <p className="ps-type-brand ps-muted mb-4">Serial imagery</p>
        <div className="ps-type-hero ps-accent-text">{SHUFFLE_WORDS[Math.floor(Math.random() * SHUFFLE_WORDS.length)]}</div>
      </div>
    );
  }

  if (title.includes('PMR')) {
    return (
      <div className="ps-card-passive space-y-2 p-5">
        {PMR_QUICK_STEPS.map((step, index) => (
          <div key={step} className="flex gap-3 ps-type-body text-[var(--ps-text-secondary)]">
            <span className="font-mono text-xs ps-muted">{index + 1}</span>
            <span>{step}</span>
          </div>
        ))}
      </div>
    );
  }

  if (title.includes('Sleep timing')) {
    return (
      <div className="ps-card-passive grid grid-cols-2 gap-3 p-5">
        {[5, 6].map((cycle) => (
          <div key={cycle} className="ps-card-secondary p-4 text-center">
            <div className="font-serif text-xl ps-accent-text">{formatWakeTime(cycle)}</div>
            <div className="ps-type-brand ps-muted mt-1">{cycle === 5 ? '7.5 hours' : '9 hours'}</div>
          </div>
        ))}
      </div>
    );
  }

  if (title.includes('story')) {
    return (
      <div className="ps-card-passive p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="ps-type-title ps-accent-text">{PRE_SLEEP_STORY.title}</h3>
          <span className="ps-type-meta ps-muted">{PRE_SLEEP_STORY.duration}</span>
        </div>
        <div className="space-y-4 font-serif text-lg leading-relaxed text-[var(--ps-text-secondary)]">
          {PRE_SLEEP_STORY.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="ps-card-passive ps-accent-border p-5 ps-type-body text-[var(--ps-text-secondary)]">
      <div className="ps-type-brand ps-accent-text mb-2">Action cue</div>
      Start this outside the app. Keep it physical, short, and obvious enough that you can complete it without another decision.
    </div>
  );
};

const ProtocolHero: React.FC<{ state: StateSurfaceConfig }> = ({ state }) => {
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const soundRef = useRef<ReturnType<typeof createSoundscape> | null>(null);
  const steps = protocolSteps[state.hero.protocol];
  const soundPreset = getSoundPreset(state.hero.protocol);
  const usesSound = state.hero.protocol === 'focus-sound';

  useEffect(() => {
    setActive(false);
    setStepIndex(0);
    setElapsed(0);
    soundRef.current?.stop();
    soundRef.current = null;
  }, [state.route]);

  useEffect(() => {
    if (!active) return undefined;

    const interval = window.setInterval(() => {
      setElapsed((value) => value + 1);
      setStepIndex((value) => (value + 1) % steps.length);
    }, state.hero.protocol === 'focus-sound' ? 15000 : 5000);

    return () => window.clearInterval(interval);
  }, [active, state.hero.protocol, steps.length]);

  useEffect(() => {
    return () => {
      soundRef.current?.stop();
    };
  }, []);

  const toggle = () => {
    const nextActive = !active;
    setActive(nextActive);

    if (usesSound) {
      if (nextActive && !soundRef.current) {
        soundRef.current = createSoundscape(soundPreset);
      } else if (!nextActive) {
        soundRef.current?.stop();
        soundRef.current = null;
      }
    }
  };

  const reset = () => {
    setActive(false);
    setStepIndex(0);
    setElapsed(0);
    soundRef.current?.stop();
    soundRef.current = null;
  };

  const minutes = Math.floor(elapsed / 60);
  const seconds = String(elapsed % 60).padStart(2, '0');

  return (
    <section className={`ps-card-primary p-6 ${active ? 'ps-is-active' : ''}`}>
      <div className="ps-accent-bg absolute -right-16 -top-20 h-48 w-48 rounded-full opacity-[0.075] blur-3xl" />
      <div className="relative z-10">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="ps-type-brand ps-accent-text mb-2 flex items-center gap-2">
              <Wind size={14} />
              {state.hero.duration}
            </div>
            <h2 className="ps-type-title">{state.hero.title}</h2>
            <p className="ps-type-body mt-2">{state.hero.subtitle}</p>
          </div>
          <div className="ps-pill px-3 py-1 font-mono text-xs">
            {minutes}:{seconds}
          </div>
        </div>

        <div className="mb-6 flex min-h-56 items-center justify-center">
          <div className="relative flex h-52 w-52 items-center justify-center">
            <motion.div
              animate={active ? { scale: [0.82, 1.08, 0.9], opacity: [0.3, 0.95, 0.45] } : { scale: 0.86, opacity: 0.25 }}
              transition={{ duration: 5, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
              className="ps-accent-border absolute h-full w-full rounded-full border"
            />
            <motion.div
              animate={active ? { scale: [0.72, 1, 0.78] } : { scale: 0.78 }}
              transition={{ duration: 5, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
              className="ps-accent-soft absolute h-40 w-40 rounded-full"
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={`${state.route}-${stepIndex}-${active}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="relative z-10 px-6 text-center"
              >
                <div className="ps-type-protocol">{active ? steps[stepIndex] : 'Ready'}</div>
                <div className="ps-type-brand ps-muted mt-2">
                  {active ? state.hero.cta : 'One tap protocol'}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {state.hero.protocol === 'nsdr' && active && (
          <div className="ps-card-passive mb-5 p-4">
            <div className="ps-type-brand ps-accent-text mb-2">Self-guided script</div>
            <p className="ps-type-body text-[var(--ps-text-secondary)]">{NSDR_SCRIPT[stepIndex % NSDR_SCRIPT.length]}</p>
          </div>
        )}

        {usesSound && (
          <div className="ps-card-passive mb-5 p-4">
            <div className="ps-type-section flex items-center gap-2">
              <Headphones size={16} className="ps-accent-text" />
              <span>{soundPreset.name}</span>
            </div>
            <p className="ps-type-meta mt-1">{soundPreset.description}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={toggle}
            className={`ps-control-primary flex flex-1 items-center justify-center gap-2 px-5 py-4 font-medium transition-transform active:scale-[0.98] ${active ? 'ps-is-active' : ''}`}
          >
            {active ? <Pause size={18} /> : <Play size={18} />}
            {active ? 'Pause' : state.hero.cta}
          </button>
          <button
            type="button"
            onClick={reset}
            className="ps-control-secondary flex h-14 w-14 items-center justify-center transition-colors hover:text-[var(--ps-text-secondary)]"
            aria-label="Reset protocol"
          >
            {active ? <Square size={17} /> : <RotateCcw size={17} />}
          </button>
        </div>
      </div>
    </section>
  );
};

const StateSurface: React.FC<StateSurfaceProps> = ({ state }) => {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const currentHour = useMemo(() => new Date().getHours(), [state.route]);
  const theme = STATE_THEME[state.accent];
  const stateStyle = { '--ps-state-rgb': theme.rgb } as CSSProperties;

  return (
    <motion.div
      className="ps-state-scope space-y-5 pb-10"
      style={stateStyle}
      data-theme-mode={theme.mode}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      <header className="space-y-3">
        <div className="ps-pill ps-pill-accent ps-type-brand px-3 py-1">
          {state.eyebrow}
        </div>
        <div>
          <h1 className="ps-type-hero">{state.label}</h1>
          <p className="ps-type-body mt-2 max-w-sm">{state.goal}</p>
        </div>
      </header>

      <ProtocolHero state={state} />

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="ps-type-section">Secondary actions</h2>
          <span className="ps-type-meta ps-subtle">Max 3 choices</span>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {state.secondaryActions.map((action) => {
            const isSelected = selectedAction === action.title;
            return (
              <button
                key={action.title}
                type="button"
                onClick={() => setSelectedAction(isSelected ? null : action.title)}
                className={`group flex items-center justify-between gap-4 p-4 text-left transition-all ${
                  isSelected ? 'ps-card-secondary-selected' : 'ps-card-secondary hover:border-[var(--ps-border-strong)]'
                }`}
              >
                <span>
                  <span className="ps-type-section block">{action.title}</span>
                  <span className="ps-type-meta mt-1 block">{action.description}</span>
                </span>
                {isSelected ? <Check size={17} className="ps-accent-text" /> : <ArrowRight size={17} className="ps-subtle group-hover:text-[var(--ps-text-muted)]" />}
              </button>
            );
          })}
        </div>
      </section>

      <AnimatePresence>
        {selectedAction && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <SecondaryDetail title={selectedAction} state={state} />
          </motion.div>
        )}
      </AnimatePresence>

      <section className="ps-card-passive p-5">
        <div className="ps-type-brand ps-muted mb-2 flex items-center gap-2">
          <Clock size={14} />
          State note
        </div>
        <h3 className="ps-type-section">{state.note.title}</h3>
        <p className="ps-type-body mt-1">{state.note.body}</p>
        {(state.route === 'POST_WAKE' || state.route === 'PRE_SLEEP') && (
          <p className="ps-type-meta ps-subtle mt-3">
            Bio-time: {currentHour < 12 ? 'morning activation window' : currentHour < 18 ? 'daytime stability window' : 'evening wind-down window'}.
          </p>
        )}
      </section>

      <div className="ps-type-brand ps-subtle flex items-center justify-center gap-2 pt-2">
        <Sparkles size={12} />
        Fast state shifts, no tracking
      </div>
    </motion.div>
  );
};

export default StateSurface;
