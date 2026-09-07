import {
  DEFAULT_SYNTH_PATCH,
  cloneSynthPatch,
  type SynthPatch,
} from './Synth';

export interface SynthPreset {
  id: string;
  name: string;
  patch: SynthPatch;
}

export const SYNTH_PRESETS: SynthPreset[] = [
  {
    id: 'init',
    name: 'Init',
    patch: cloneSynthPatch(DEFAULT_SYNTH_PATCH),
  },

  {
    id: 'deep-bass',
    name: 'Deep Bass',

    patch: {
      oscillators: {
        A: {
          type: 'sawtooth',
          level: 0.75,
          detune: 0,
          octave: 0,
        },

        B: {
          type: 'square',
          level: 0.4,
          detune: -7,
          octave: -1,
        },
      },

      filter: {
        cutoff: 120,
        resonance: 4,

        envelope: {
          attack: 0.01,
          decay: 0.25,
          sustain: 0.15,
          release: 0.4,
          octaves: 3,
        },
      },

      amplitudeEnvelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0.7,
        release: 0.45,
      },

      lfo: {
        type: 'sine',
        rate: 5,

        pitch: {
          enabled: false,
          depth: 10,
        },

        filter: {
          enabled: false,
          depth: 300,
        },

        pulseWidth: {
          enabled: false,
          depth: 0.15,
        },
      },
    },
  },

  {
    id: 'soft-lead',
    name: 'Soft Lead',

    patch: {
      oscillators: {
        A: {
          type: 'sawtooth',
          level: 0.6,
          detune: 0,
          octave: 0,
        },

        B: {
          type: 'square',
          level: 0.35,
          detune: 7,
          octave: 0,
        },
      },

      filter: {
        cutoff: 1800,
        resonance: 2.5,

        envelope: {
          attack: 0.04,
          decay: 0.35,
          sustain: 0.4,
          release: 0.7,
          octaves: 2,
        },
      },

      amplitudeEnvelope: {
        attack: 0.03,
        decay: 0.25,
        sustain: 0.65,
        release: 0.6,
      },

      lfo: {
        type: 'sine',
        rate: 5.2,

        pitch: {
          enabled: true,
          depth: 8,
        },

        filter: {
          enabled: false,
          depth: 500,
        },

        pulseWidth: {
          enabled: false,
          depth: 0.1,
        },
      },
    },
  },

  {
    id: 'pwm-pad',
    name: 'PWM Pad',

    patch: {
      oscillators: {
        A: {
          type: 'square',
          level: 0.55,
          detune: -5,
          octave: 0,
        },

        B: {
          type: 'square',
          level: 0.45,
          detune: 5,
          octave: 0,
        },
      },

      filter: {
        cutoff: 900,
        resonance: 1.5,

        envelope: {
          attack: 0.8,
          decay: 1.2,
          sustain: 0.65,
          release: 2.5,
          octaves: 2.5,
        },
      },

      amplitudeEnvelope: {
        attack: 0.9,
        decay: 1.1,
        sustain: 0.75,
        release: 2.8,
      },

      lfo: {
        type: 'triangle',
        rate: 0.3,

        pitch: {
          enabled: false,
          depth: 6,
        },

        filter: {
          enabled: true,
          depth: 250,
        },

        pulseWidth: {
          enabled: true,
          depth: 0.2,
        },
      },
    },
  },
];