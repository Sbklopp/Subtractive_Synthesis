import { create } from 'zustand';
import {
  DEFAULT_BASS_DRUM_SETTINGS,
  DEFAULT_CLAP_SETTINGS,
  DEFAULT_SNARE_SETTINGS,
  type BassDrumSettings,
  type ClapSettings,
  type SnareSettings,
} from '../domain/DrumMachine';

interface DrumMachineStore {
  bassDrum: BassDrumSettings;
  snare: SnareSettings;
  clap: ClapSettings;

  updateBassDrum: (
    settings: Partial<BassDrumSettings>,
  ) => void;

  updateSnare: (
    settings: Partial<SnareSettings>,
  ) => void;

  updateClap: (
    settings: Partial<ClapSettings>,
  ) => void;

  resetBassDrum: () => void;
  resetSnare: () => void;
  resetClap: () => void;
  resetAllDrums: () => void;
}

export const useDrumMachineStore =
  create<DrumMachineStore>()((set) => ({
    bassDrum: {
      ...DEFAULT_BASS_DRUM_SETTINGS,
    },

    snare: {
      ...DEFAULT_SNARE_SETTINGS,
    },

    clap: {
      ...DEFAULT_CLAP_SETTINGS,
    },

    updateBassDrum: (settings) =>
      set((state) => ({
        bassDrum: {
          ...state.bassDrum,
          ...settings,
        },
      })),

    updateSnare: (settings) =>
      set((state) => ({
        snare: {
          ...state.snare,
          ...settings,
        },
      })),

    updateClap: (settings) =>
      set((state) => ({
        clap: {
          ...state.clap,
          ...settings,
        },
      })),

    resetBassDrum: () =>
      set({
        bassDrum: {
          ...DEFAULT_BASS_DRUM_SETTINGS,
        },
      }),

    resetSnare: () =>
      set({
        snare: {
          ...DEFAULT_SNARE_SETTINGS,
        },
      }),

    resetClap: () =>
      set({
        clap: {
          ...DEFAULT_CLAP_SETTINGS,
        },
      }),

    resetAllDrums: () =>
      set({
        bassDrum: {
          ...DEFAULT_BASS_DRUM_SETTINGS,
        },
        snare: {
          ...DEFAULT_SNARE_SETTINGS,
        },
        clap: {
          ...DEFAULT_CLAP_SETTINGS,
        },
      }),
  }));