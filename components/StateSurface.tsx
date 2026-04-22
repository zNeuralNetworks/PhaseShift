import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { AccentName, ProtocolKind, StateSurfaceConfig } from '../types';

interface StateSurfaceProps {
  state: StateSurfaceConfig;
}

type SoundPreset = (typeof SOUND_PRESETS)[keyof typeof SOUND_PRESETS];

const accentClasses: Record<AccentName, { text: string; border: string; bg: string; glow: string; button: string; soft: string }> = {
  amber: {
    text: 'text-amber-200',
    border: 'border-amber-500/40',
    bg: 'bg-amber-500',
    glow: 'shadow-[0_0_50px_rgba(245,158,11,0.18)]',
    button: 'from-amber-700/90 to-stone-800 border-amber-500/40 text-amber-50',
    soft: 'bg-amber-950/20'
  },
  rose: {
    text: 'text-rose-200',
    border: 'border-rose-500/40',
    bg: 'bg-rose-500',
    glow: 'shadow-[0_0_50px_rgba(244,63,94,0.16)]',
    button: 'from-rose-800/90 to-stone-800 border-rose-500/40 text-rose-50',
    soft: 'bg-rose-950/20'
  },
  cyan: {
    text: 'text-cyan-200',
    border: 'border-cyan-500/40',
    bg: 'bg-cyan-500',
    glow: 'shadow-[0_0_50px_rgba(34,211,238,0.14)]',
    button: 'from-cyan-800/90 to-stone-800 border-cyan-500/40 text-cyan-50',
    soft: 'bg-cyan-950/20'
  },
  emerald: {
    text: 'text-emerald-200',
    border: 'border-emerald-500/40',
    bg: 'bg-emerald-500',
    glow: 'shadow-[0_0_50px_rgba(16,185,129,0.14)]',
    button: 'from-emerald-800/90 to-stone-800 border-emerald-500/40 text-emerald-50',
    soft: 'bg-emerald-950/20'
  },
  violet: {
    text: 'text-violet-200',
    border: 'border-violet-500/40',
    bg: 'bg-violet-500',
    glow: 'shadow-[0_0_50px_rgba(139,92,246,0.16)]',
    button: 'from-violet-800/90 to-stone-800 border-violet-500/40 text-violet-50',
    soft: 'bg-violet-950/20'
  },
  yellow: {
    text: 'text-yellow-200',
    border: 'border-yellow-500/40',
    bg: 'bg-yellow-500',
    glow: 'shadow-[0_0_50px_rgba(234,179,8,0.16)]',
    button: 'from-yellow-700/90 to-stone-800 border-yellow-500/40 text-yellow-50',
    soft: 'bg-yellow-950/20'
  }
};

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
      <div className="rounded-2xl border border-stone-800 bg-stone-950/40 p-5 text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.2em] text-stone-500">Serial imagery</p>
        <div className="text-4xl font-serif text-orange-100">{SHUFFLE_WORDS[Math.floor(Math.random() * SHUFFLE_WORDS.length)]}</div>
      </div>
    );
  }

  if (title.includes('PMR')) {
    return (
      <div className="space-y-2 rounded-2xl border border-stone-800 bg-stone-950/40 p-5">
        {PMR_QUICK_STEPS.map((step, index) => (
          <div key={step} className="flex gap-3 text-sm text-stone-300">
            <span className="font-mono text-xs text-stone-500">{index + 1}</span>
            <span>{step}</span>
          </div>
        ))}
      </div>
    );
  }

  if (title.includes('Sleep timing')) {
    return (
      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-stone-800 bg-stone-950/40 p-5">
        {[5, 6].map((cycle) => (
          <div key={cycle} className="rounded-xl border border-stone-800 bg-stone-900/60 p-4 text-center">
            <div className="font-serif text-xl text-teal-100">{formatWakeTime(cycle)}</div>
            <div className="mt-1 text-[10px] uppercase tracking-widest text-stone-500">{cycle === 5 ? '7.5 hours' : '9 hours'}</div>
          </div>
        ))}
      </div>
    );
  }

  if (title.includes('story')) {
    return (
      <div className="rounded-2xl border border-stone-800 bg-stone-950/40 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-xl text-orange-100">{PRE_SLEEP_STORY.title}</h3>
          <span className="text-xs text-stone-500">{PRE_SLEEP_STORY.duration}</span>
        </div>
        <div className="space-y-4 font-serif text-lg leading-relaxed text-stone-300">
          {PRE_SLEEP_STORY.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border ${accentClasses[state.accent].border} ${accentClasses[state.accent].soft} p-5 text-sm leading-relaxed text-stone-300`}>
      <div className={`mb-2 text-xs font-semibold uppercase tracking-[0.18em] ${accentClasses[state.accent].text}`}>Action cue</div>
      Start this outside the app. Keep it physical, short, and obvious enough that you can complete it without another decision.
    </div>
  );
};

const ProtocolHero: React.FC<{ state: StateSurfaceConfig }> = ({ state }) => {
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const soundRef = useRef<ReturnType<typeof createSoundscape> | null>(null);
  const accent = accentClasses[state.accent];
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
    <section className={`relative overflow-hidden rounded-[1.75rem] border ${accent.border} bg-stone-900/70 p-6 ${active ? accent.glow : ''}`}>
      <div className={`absolute -right-16 -top-20 h-48 w-48 rounded-full ${accent.bg} opacity-10 blur-3xl`} />
      <div className="relative z-10">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className={`mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] ${accent.text}`}>
              <Wind size={14} />
              {state.hero.duration}
            </div>
            <h2 className="text-2xl font-serif text-stone-100">{state.hero.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-400">{state.hero.subtitle}</p>
          </div>
          <div className="rounded-full border border-stone-800 bg-stone-950/60 px-3 py-1 font-mono text-xs text-stone-400">
            {minutes}:{seconds}
          </div>
        </div>

        <div className="mb-6 flex min-h-56 items-center justify-center">
          <div className="relative flex h-52 w-52 items-center justify-center">
            <motion.div
              animate={active ? { scale: [0.82, 1.08, 0.9], opacity: [0.3, 0.95, 0.45] } : { scale: 0.86, opacity: 0.25 }}
              transition={{ duration: 5, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
              className={`absolute h-full w-full rounded-full border ${accent.border}`}
            />
            <motion.div
              animate={active ? { scale: [0.72, 1, 0.78] } : { scale: 0.78 }}
              transition={{ duration: 5, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
              className={`absolute h-40 w-40 rounded-full ${accent.soft}`}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={`${state.route}-${stepIndex}-${active}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="relative z-10 px-6 text-center"
              >
                <div className="text-3xl font-serif text-stone-100">{active ? steps[stepIndex] : 'Ready'}</div>
                <div className="mt-2 text-xs uppercase tracking-[0.18em] text-stone-500">
                  {active ? state.hero.cta : 'One tap protocol'}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {state.hero.protocol === 'nsdr' && active && (
          <div className="mb-5 rounded-2xl border border-stone-800 bg-stone-950/40 p-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">Self-guided script</div>
            <p className="text-sm leading-relaxed text-stone-300">{NSDR_SCRIPT[stepIndex % NSDR_SCRIPT.length]}</p>
          </div>
        )}

        {usesSound && (
          <div className="mb-5 rounded-2xl border border-stone-800 bg-stone-950/40 p-4">
            <div className="flex items-center gap-2 text-sm text-stone-300">
              <Headphones size={16} className={accent.text} />
              <span>{soundPreset.name}</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-stone-500">{soundPreset.description}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={toggle}
            className={`flex flex-1 items-center justify-center gap-2 rounded-2xl border bg-gradient-to-r px-5 py-4 font-medium transition-transform active:scale-[0.98] ${active ? 'border-stone-700 bg-none text-stone-300' : accent.button}`}
          >
            {active ? <Pause size={18} /> : <Play size={18} />}
            {active ? 'Pause' : state.hero.cta}
          </button>
          <button
            type="button"
            onClick={reset}
            className="flex h-14 w-14 items-center justify-center rounded-2xl border border-stone-800 bg-stone-950/50 text-stone-500 transition-colors hover:text-stone-300"
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
  const accent = accentClasses[state.accent];
  const currentHour = useMemo(() => new Date().getHours(), [state.route]);

  return (
    <motion.div
      className="space-y-5 pb-10"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      <header className="space-y-3">
        <div className={`inline-flex rounded-full border ${accent.border} ${accent.soft} px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] ${accent.text}`}>
          {state.eyebrow}
        </div>
        <div>
          <h1 className="text-4xl font-serif text-stone-100">{state.label}</h1>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-stone-400">{state.goal}</p>
        </div>
      </header>

      <ProtocolHero state={state} />

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-stone-300">Secondary actions</h2>
          <span className="text-xs text-stone-600">Max 3 choices</span>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {state.secondaryActions.map((action) => {
            const isSelected = selectedAction === action.title;
            return (
              <button
                key={action.title}
                type="button"
                onClick={() => setSelectedAction(isSelected ? null : action.title)}
                className={`group flex items-center justify-between gap-4 rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? `${accent.border} ${accent.soft}`
                    : 'border-stone-800 bg-stone-900/35 hover:border-stone-700 hover:bg-stone-900/60'
                }`}
              >
                <span>
                  <span className="block text-sm font-medium text-stone-200">{action.title}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-stone-500">{action.description}</span>
                </span>
                {isSelected ? <Check size={17} className={accent.text} /> : <ArrowRight size={17} className="text-stone-600 group-hover:text-stone-400" />}
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

      <section className="rounded-2xl border border-stone-800 bg-stone-900/30 p-5">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
          <Clock size={14} />
          State note
        </div>
        <h3 className="text-sm font-medium text-stone-200">{state.note.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-stone-500">{state.note.body}</p>
        {(state.route === 'POST_WAKE' || state.route === 'PRE_SLEEP') && (
          <p className="mt-3 text-xs text-stone-600">
            Bio-time: {currentHour < 12 ? 'morning activation window' : currentHour < 18 ? 'daytime stability window' : 'evening wind-down window'}.
          </p>
        )}
      </section>

      <div className="flex items-center justify-center gap-2 pt-2 text-[10px] uppercase tracking-[0.2em] text-stone-700">
        <Sparkles size={12} />
        Fast state shifts, no tracking
      </div>
    </motion.div>
  );
};

export default StateSurface;
