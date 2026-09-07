import { create } from 'zustand';
import {
  DEFAULT_BASS_DRUM_SETTINGS,
  DEFAULT_CLAP_SETTINGS,
  DEFAULT_CLOSED_HI_HAT_SETTINGS,
  DEFAULT_CYMBAL_SETTINGS,
  DEFAULT_OPEN_HI_HAT_SETTINGS,
  DEFAULT_SNARE_SETTINGS,
  type BassDrumSettings,
  type ClapSettings,
  type CymbalSettings,
  type HiHatSettings,
  type SnareSettings,
} from '../domain/DrumMachine';

interface DrumMachineStore {
  bassDrum: BassDrumSettings;
  snare: SnareSettings;
  clap: ClapSettings;
  closedHiHat: HiHatSettings;
  openHiHat: HiHatSettings;
  cymbal: CymbalSettings;

  updateBassDrum: (
    settings: Partial<BassDrumSettings>,
  ) => void;

  updateSnare: (
    settings: Partial<SnareSettings>,
  ) => void;

  updateClap: (
    settings: Partial<ClapSettings>,
  ) => void;

  updateClosedHiHat: (
    settings: Partial<HiHatSettings>,
  ) => void;

  updateOpenHiHat: (
    settings: Partial<HiHatSettings>,
  ) => void;

  updateCymbal: (
    settings: Partial<CymbalSettings>,
  ) => void;

  resetBassDrum: () => void;
  resetSnare: () => void;
  resetClap: () => void;
  resetClosedHiHat: () => void;
  resetOpenHiHat: () => void;
  resetCymbal: () => void;
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

    closedHiHat: {
      ...DEFAULT_CLOSED_HI_HAT_SETTINGS,
    },

    openHiHat: {
      ...DEFAULT_OPEN_HI_HAT_SETTINGS,
    },

    cymbal: {
      ...DEFAULT_CYMBAL_SETTINGS,
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

    updateClosedHiHat: (settings) =>
      set((state) => ({
        closedHiHat: {
          ...state.closedHiHat,
          ...settings,
        },
      })),

    updateOpenHiHat: (settings) =>
      set((state) => ({
        openHiHat: {
          ...state.openHiHat,
          ...settings,
        },
      })),

    updateCymbal: (settings) =>
      set((state) => ({
        cymbal: {
          ...state.cymbal,
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

    resetClosedHiHat: () =>
      set({
        closedHiHat: {
          ...DEFAULT_CLOSED_HI_HAT_SETTINGS,
        },
      }),

    resetOpenHiHat: () =>
      set({
        openHiHat: {
          ...DEFAULT_OPEN_HI_HAT_SETTINGS,
        },
      }),

    resetCymbal: () =>
      set({
        cymbal: {
          ...DEFAULT_CYMBAL_SETTINGS,
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
        closedHiHat: {
          ...DEFAULT_CLOSED_HI_HAT_SETTINGS,
        },
        openHiHat: {
          ...DEFAULT_OPEN_HI_HAT_SETTINGS,
        },
        cymbal: {
          ...DEFAULT_CYMBAL_SETTINGS,
        },
      }),
  }));