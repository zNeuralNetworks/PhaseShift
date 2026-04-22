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
