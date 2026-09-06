export type OscillatorId = 'A' | 'B';

export type OscillatorType =
  | 'sine'
  | 'triangle'
  | 'square'
  | 'sawtooth';

export interface OscillatorSettings {
  type: OscillatorType;
  level: number;
  detune: number;
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

export const DEFAULT_OSCILLATORS: Record<
  OscillatorId,
  OscillatorSettings
> = {
  A: {
    type: 'sawtooth',
    level: 0.65,
    detune: 0,
  },
  B: {
    type: 'square',
    level: 0.25,
    detune: 7,
  },
};

export const DEFAULT_ENVELOPE: EnvelopeSettings = {
  attack: 0.02,
  decay: 0.2,
  sustain: 0.5,
  release: 1,
};

export const DEFAULT_FILTER_ENVELOPE: FilterEnvelopeSettings = {
  attack: 0.01,
  decay: 0.3,
  sustain: 0.2,
  release: 0.8,
  octaves: 4,
};