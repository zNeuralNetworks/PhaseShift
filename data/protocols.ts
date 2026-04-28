import { PhaseShiftPreferences, ProtocolDefinition, ProtocolKind } from '../types';

export const DEFAULT_PREFERENCES: PhaseShiftPreferences = {
  theme: 'standard',
  focusBlockMinutes: 25,
  soundVolume: 0.65,
  wakeTime: '07:00',
  focusTarget: ''
};

export const PROTOCOL_DEFINITIONS: Record<ProtocolKind, ProtocolDefinition> = {
  'activation-breath': {
    steps: ['Stand tall', 'Inhale sharply', 'Exhale cleanly', 'Eyes up'],
    durationSeconds: 90,
    stepIntervalSeconds: 6,
    activeLabel: 'Build clean activation',
    completeLabel: 'Activated'
  },
  'physiological-sigh': {
    steps: ['Inhale', 'Top-up inhale', 'Long exhale', 'Settle'],
    durationSeconds: 60,
    stepIntervalSeconds: 5,
    activeLabel: 'Reduce input',
    completeLabel: 'Downshifted'
  },
  nsdr: {
    steps: ['Contact points', 'Right side', 'Left side', 'Breath'],
    durationSeconds: 300,
    stepIntervalSeconds: 18,
    activeLabel: 'Stay out of effort',
    completeLabel: 'Recovered',
    soundPreset: 'rest'
  },
  'focus-sound': {
    steps: ['Target', 'Sound on', 'Work block', 'Hold line'],
    durationSeconds: 1500,
    stepIntervalSeconds: 30,
    activeLabel: 'Protect the block',
    completeLabel: 'Block complete',
    soundPreset: 'focus'
  },
  'wind-down': {
    steps: ['Inhale', 'Hold', 'Exhale', 'Dim input'],
    durationSeconds: 180,
    stepIntervalSeconds: 7,
    activeLabel: 'Let the screen become optional',
    completeLabel: 'Wound down',
    soundPreset: 'sleep'
  },
  'wake-anchor': {
    steps: ['Upright', 'Bright light', 'Move', 'First action'],
    durationSeconds: 120,
    stepIntervalSeconds: 8,
    activeLabel: 'Anchor the day',
    completeLabel: 'Wake anchored'
  }
};

export const SHUFFLE_WORDS = [
  'Feather',
  'Brick',
  'Toaster',
  'Cloud',
  'Pebble',
  'Velvet',
  'Acorn',
  'Button',
  'Cactus',
  'Daisy',
  'Compass',
  'Lantern',
  'Marble',
  'Notebook',
  'Origami',
  'Ribbon',
  'Seashell',
  'Teapot',
  'Umbrella',
  'Wheel'
];

export const NSDR_SCRIPT = [
  'Lie down or sit back. Let your eyes close if the environment is safe.',
  'Notice the contact points under your heels, legs, hips, shoulders, and head.',
  'Move attention through the right hand: thumb, fingers, palm, wrist, forearm, elbow, shoulder.',
  'Move attention through the left hand: thumb, fingers, palm, wrist, forearm, elbow, shoulder.',
  'Feel both arms heavy. Let the chest and abdomen move without forcing the breath.',
  'Stay supported for the remaining time. There is no task to solve inside this protocol.'
];

export const PRE_SLEEP_STORY = {
  title: 'The Rain Train',
  duration: '10 min',
  paragraphs: [
    'You are seated in a wide, quiet train cabin. The lights are low, the seat is warm, and rain moves softly across the window.',
    'The wheels make a steady rhythm beneath you. Each sound is predictable enough that your attention can stop searching for the next thing.',
    'Outside, dark trees pass through mist. Inside, there is nothing to manage. The train is moving and you do not need to help it.',
    'With every slow breath, the cabin feels heavier and safer. The destination is simply rest.'
  ]
};

export const SOUND_PRESETS = {
  focus: {
    id: 'focus-alpha',
    name: 'Alpha Focus Wash',
    description: 'Light pink noise and subtle movement for a protected work block.',
    baseFreq: 300,
    beatFreq: 10,
    noiseType: 'pink' as const
  },
  rest: {
    id: 'rest-theta',
    name: 'Theta Recovery Wash',
    description: 'Soft masking for NSDR or short cognitive recovery.',
    baseFreq: 200,
    beatFreq: 6,
    noiseType: 'pink' as const
  },
  sleep: {
    id: 'sleep-brown',
    name: 'Brown Noise Floor',
    description: 'Heavier masking for pre-sleep and overstimulation.',
    baseFreq: 100,
    beatFreq: 2,
    noiseType: 'brown' as const
  }
};

export const PMR_QUICK_STEPS = [
  'Clench both fists and pull shoulders toward ears.',
  'Hold for five seconds without holding your breath.',
  'Release hands, jaw, shoulders, and abdomen at the same time.',
  'Let the next exhale be longer than the inhale.'
];

export const ACTION_DETAILS: Record<string, string[]> = {
  'Bright light': [
    'Face a window or step outside.',
    'Keep the phone down while your eyes adjust.',
    'Stop after two minutes; the goal is activation, not optimization.'
  ],
  'Posture reset': [
    'Stand with feet flat and knees unlocked.',
    'Pull shoulders down, lengthen the back of the neck.',
    'Take three crisp exhales before moving.'
  ],
  'First task': [
    'Name the next visible action in one sentence.',
    'Open only the surface needed for that action.',
    'Do not check feeds before the first move.'
  ],
  'Brown noise': [
    'Use masking only after reducing avoidable input.',
    'Lower volume until it recedes behind attention.',
    'Stop if the sound becomes another thing to manage.'
  ],
  'Alpha wash': [
    'Use this as a short recovery surface, not a bedtime cue.',
    'Keep eyes closed if the room is safe.',
    'Return to work when the body feels less effortful.'
  ],
  'Walk cue': [
    'Two minutes outside or near a window.',
    'No phone input.',
    'Let visual distance do some of the reset.'
  ],
  'Body scan': [
    'Hands, shoulders, jaw, abdomen.',
    'Release each area on the exhale.',
    'Keep it under three minutes.'
  ],
  'Input shutdown': [
    'Close chat, inbox, dashboards, and noisy tabs.',
    'Leave only the work surface and one reference.',
    'Put the phone out of reach before starting.'
  ],
  'Room audit': [
    'Cooler than daytime.',
    'Darker than comfortable reading.',
    'Quiet enough that sudden sound is not the main input.'
  ],
  'Movement cue': [
    'Walk, stairs, or ten slow squats.',
    'Keep it easy enough that it does not become a workout decision.',
    'Start the first useful task immediately after.'
  ],
  'Circadian anchor': [
    'Hold wake time steadier than bedtime when life gets uneven.',
    'Get light early when possible.',
    'Avoid making the morning a sleep-quality review.'
  ]
};
