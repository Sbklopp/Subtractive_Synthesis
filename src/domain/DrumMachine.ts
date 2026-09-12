export const BASS_DRUM_OSCILLATOR_TYPES = [
  'sine',
  'triangle',
] as const;

export type BassDrumOscillatorType =
  (typeof BASS_DRUM_OSCILLATOR_TYPES)[number];

export interface BassDrumSettings {
  tune: number;
  pitchDrop: number;
  oscillatorType: BassDrumOscillatorType;
  decay: number;
  tone: number;
  level: number;
}

export interface SnareSettings {
  tune: number;
  noiseAmount: number;
  tone: number;
  decay: number;
  level: number;
}

export interface ClapSettings {
  tone: number;
  spread: number;
  decay: number;
  level: number;
}

export interface HiHatSettings {
  tone: number;
  decay: number;
  metallic: number;
  level: number;
}

export interface CymbalSettings {
  tone: number;
  decay: number;
  wash: number;
  level: number;
}

export const DEFAULT_BASS_DRUM_SETTINGS:
  BassDrumSettings = {
    tune: 50,
    pitchDrop: 4,
    oscillatorType: 'triangle',
    decay: 0.6,
    tone: 1200,
    level: 0.75,
  };

export const DEFAULT_SNARE_SETTINGS:
  SnareSettings = {
    tune: 144,
    noiseAmount: 0.65,
    tone: 40,
    decay: 0.36,
    level: 0.85,
  };

export const DEFAULT_CLAP_SETTINGS:
  ClapSettings = {
    tone: 1400,
    spread: 0.015,
    decay: 0.32,
    level: 0.62,
  };

export const DEFAULT_CLOSED_HI_HAT_SETTINGS:
  HiHatSettings = {
    tone: 7200,
    decay: 0.075,
    metallic: 0.8,
    level: 0.65,
  };

export const DEFAULT_OPEN_HI_HAT_SETTINGS:
  HiHatSettings = {
    tone: 6500,
    decay: 0.72,
    metallic: 0.75,
    level: 0.58,
  };

export const DEFAULT_CYMBAL_SETTINGS:
  CymbalSettings = {
    tone: 4800,
    decay: 1.8,
    wash: 0.62,
    level: 0.55,
  };

export const DRUM_VOICE_IDS = [
  'bassDrum',
  'snare',
  'clap',
  'closedHiHat',
  'openHiHat',
  'cymbal',
] as const;

export type DrumVoiceId =
  (typeof DRUM_VOICE_IDS)[number];

export type DrumStepState =
  | 'off'
  | 'normal'
  | 'accent';

export type DrumPattern = Record<
  DrumVoiceId,
  DrumStepState[]
>;

export type DrumMuteState = Record<
  DrumVoiceId,
  boolean
>;

export const SEQUENCER_STEP_COUNT = 64;
export const SEQUENCER_PAGE_SIZE = 32;

export const MIN_SEQUENCE_LENGTH = 1;
export const MAX_SEQUENCE_LENGTH =
  SEQUENCER_STEP_COUNT;

export const DEFAULT_SEQUENCE_LENGTH =
  SEQUENCER_STEP_COUNT;

export const DEFAULT_DRUM_BPM = 120;
export const MIN_DRUM_BPM = 40;
export const MAX_DRUM_BPM = 240;

export const DEFAULT_DRUM_SWING = 0;
export const MIN_DRUM_SWING = 0;
export const MAX_DRUM_SWING = 1;

export const DRUM_STEP_VELOCITIES: Record<
  DrumStepState,
  number
> = {
  off: 0,
  normal: 0.7,
  accent: 1,
};

export function clampSequenceLength(
  length: number,
): number {
  return Math.min(
    MAX_SEQUENCE_LENGTH,
    Math.max(
      MIN_SEQUENCE_LENGTH,
      Math.round(length),
    ),
  );
}

function createEmptySteps(): DrumStepState[] {
  return Array.from(
    { length: SEQUENCER_STEP_COUNT },
    () => 'off',
  );
}

export function createEmptyDrumPattern():
  DrumPattern {
  return {
    bassDrum: createEmptySteps(),
    snare: createEmptySteps(),
    clap: createEmptySteps(),
    closedHiHat: createEmptySteps(),
    openHiHat: createEmptySteps(),
    cymbal: createEmptySteps(),
  };
}

export function cloneDrumPattern(
  pattern: DrumPattern,
): DrumPattern {
  return {
    bassDrum: [...pattern.bassDrum],
    snare: [...pattern.snare],
    clap: [...pattern.clap],
    closedHiHat: [...pattern.closedHiHat],
    openHiHat: [...pattern.openHiHat],
    cymbal: [...pattern.cymbal],
  };
}

export function getNextDrumStepState(
  state: DrumStepState,
): DrumStepState {
  switch (state) {
    case 'off':
      return 'normal';

    case 'normal':
      return 'accent';

    case 'accent':
      return 'off';
  }
}

export function createUnmutedDrumVoices():
  DrumMuteState {
  return {
    bassDrum: false,
    snare: false,
    clap: false,
    closedHiHat: false,
    openHiHat: false,
    cymbal: false,
  };
}

export function cloneDrumMuteState(
  mutedVoices: DrumMuteState,
): DrumMuteState {
  return {
    bassDrum: mutedVoices.bassDrum,
    snare: mutedVoices.snare,
    clap: mutedVoices.clap,
    closedHiHat: mutedVoices.closedHiHat,
    openHiHat: mutedVoices.openHiHat,
    cymbal: mutedVoices.cymbal,
  };
}