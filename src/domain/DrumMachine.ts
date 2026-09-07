export interface BassDrumSettings {
  tune: number;
  pitchDrop: number;
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

export type DrumPattern = Record<
  DrumVoiceId,
  boolean[]
>;

export type DrumMuteState = Record<
  DrumVoiceId,
  boolean
>;

export const SEQUENCER_STEP_COUNT = 16;
export const DEFAULT_DRUM_BPM = 120;
export const MIN_DRUM_BPM = 40;
export const MAX_DRUM_BPM = 240;

export const createEmptyDrumPattern =
  (): DrumPattern => ({
    bassDrum: Array(SEQUENCER_STEP_COUNT).fill(false),
    snare: Array(SEQUENCER_STEP_COUNT).fill(false),
    clap: Array(SEQUENCER_STEP_COUNT).fill(false),
    closedHiHat:
      Array(SEQUENCER_STEP_COUNT).fill(false),
    openHiHat:
      Array(SEQUENCER_STEP_COUNT).fill(false),
    cymbal: Array(SEQUENCER_STEP_COUNT).fill(false),
  });

export const cloneDrumPattern = (
  pattern: DrumPattern,
): DrumPattern => ({
  bassDrum: [...pattern.bassDrum],
  snare: [...pattern.snare],
  clap: [...pattern.clap],
  closedHiHat: [...pattern.closedHiHat],
  openHiHat: [...pattern.openHiHat],
  cymbal: [...pattern.cymbal],
});

export const createUnmutedDrumVoices =
  (): DrumMuteState => ({
    bassDrum: false,
    snare: false,
    clap: false,
    closedHiHat: false,
    openHiHat: false,
    cymbal: false,
  });

export const cloneDrumMuteState = (
  mutedVoices: DrumMuteState,
): DrumMuteState => ({
  bassDrum: mutedVoices.bassDrum,
  snare: mutedVoices.snare,
  clap: mutedVoices.clap,
  closedHiHat: mutedVoices.closedHiHat,
  openHiHat: mutedVoices.openHiHat,
  cymbal: mutedVoices.cymbal,
});

export const DEFAULT_BASS_DRUM_SETTINGS: BassDrumSettings = {
  tune: 50,
  pitchDrop: 4,
  decay: 0.6,
  tone: 1200,
  level: 0.75,
};

export const DEFAULT_SNARE_SETTINGS: SnareSettings = {
  tune: 144,
  noiseAmount: 0.65,
  tone: 40,
  decay: 0.36,
  level: 0.85,
};

export const DEFAULT_CLAP_SETTINGS: ClapSettings = {
  tone: 1400,
  spread: 0.015,
  decay: 0.32,
  level: 0.62,
};

export const DEFAULT_CLOSED_HI_HAT_SETTINGS: HiHatSettings = {
  tone: 7200,
  decay: 0.075,
  metallic: 0.8,
  level: 0.65,
};

export const DEFAULT_OPEN_HI_HAT_SETTINGS: HiHatSettings = {
  tone: 6500,
  decay: 0.72,
  metallic: 0.75,
  level: 0.58,
};

export const DEFAULT_CYMBAL_SETTINGS: CymbalSettings = {
  tone: 4800,
  decay: 1.8,
  wash: 0.62,
  level: 0.55,
};