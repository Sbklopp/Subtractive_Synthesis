export type OscillatorId = 'A' | 'B';

export type OscillatorType =
  | 'sine'
  | 'triangle'
  | 'square'
  | 'sawtooth';

export type OscillatorOctave = -2 | -1 | 0 | 1 | 2;

export interface OscillatorSettings {
  type: OscillatorType;
  level: number;
  detune: number;
  octave: OscillatorOctave;
}

export interface EnvelopeSettings {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export interface FilterEnvelopeSettings
  extends EnvelopeSettings {
  octaves: number;
}

export interface FilterSettings {
  cutoff: number;
  resonance: number;
  envelope: FilterEnvelopeSettings;
}

export interface LfoDestinationSettings {
  enabled: boolean;
  depth: number;
}

export interface LfoSettings {
  type: OscillatorType;
  rate: number;
  pitch: LfoDestinationSettings;
  filter: LfoDestinationSettings;
  pulseWidth: LfoDestinationSettings;
}

export interface SynthPatch {
  oscillators: Record<
    OscillatorId,
    OscillatorSettings
  >;
  filter: FilterSettings;
  amplitudeEnvelope: EnvelopeSettings;
  lfo: LfoSettings;
}

export const DEFAULT_OSCILLATORS: Record<
  OscillatorId,
  OscillatorSettings
> = {
  A: {
    type: 'sawtooth',
    level: 0.65,
    detune: 0,
    octave: 0,
  },

  B: {
    type: 'square',
    level: 0.25,
    detune: 7,
    octave: 0,
  },
};

export const DEFAULT_ENVELOPE: EnvelopeSettings = {
  attack: 0.02,
  decay: 0.2,
  sustain: 0.5,
  release: 1,
};

export const DEFAULT_FILTER_ENVELOPE: FilterEnvelopeSettings =
  {
    attack: 0.01,
    decay: 0.3,
    sustain: 0.2,
    release: 0.8,
    octaves: 4,
  };

export const DEFAULT_FILTER: FilterSettings = {
  cutoff: 200,
  resonance: 2,
  envelope: DEFAULT_FILTER_ENVELOPE,
};

export const DEFAULT_LFO: LfoSettings = {
  type: 'sine',
  rate: 5,

  pitch: {
    enabled: false,
    depth: 20,
  },

  filter: {
    enabled: false,
    depth: 800,
  },

  pulseWidth: {
    enabled: false,
    depth: 0.2,
  },
};

export const DEFAULT_SYNTH_PATCH: SynthPatch = {
  oscillators: DEFAULT_OSCILLATORS,
  filter: DEFAULT_FILTER,
  amplitudeEnvelope: DEFAULT_ENVELOPE,
  lfo: DEFAULT_LFO,
};

export const cloneSynthPatch = (
  patch: SynthPatch,
): SynthPatch => {
  return {
    oscillators: {
      A: {
        ...patch.oscillators.A,
      },

      B: {
        ...patch.oscillators.B,
      },
    },

    filter: {
      ...patch.filter,

      envelope: {
        ...patch.filter.envelope,
      },
    },

    amplitudeEnvelope: {
      ...patch.amplitudeEnvelope,
    },

    lfo: {
      ...patch.lfo,

      pitch: {
        ...patch.lfo.pitch,
      },

      filter: {
        ...patch.lfo.filter,
      },

      pulseWidth: {
        ...patch.lfo.pulseWidth,
      },
    },
  };
};