export type OscillatorType =
  | 'sine'
  | 'triangle'
  | 'square'
  | 'sawtooth';

export interface EnvelopeSettings {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export const DEFAULT_ENVELOPE: EnvelopeSettings = {
  attack: 0.02,
  decay: 0.2,
  sustain: 0.5,
  release: 1,
};