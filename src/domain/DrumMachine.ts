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