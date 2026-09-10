import { create } from 'zustand';
import {
  DEFAULT_BASS_DRUM_SETTINGS,
  DEFAULT_CLAP_SETTINGS,
  DEFAULT_CLOSED_HI_HAT_SETTINGS,
  DEFAULT_CYMBAL_SETTINGS,
  DEFAULT_DRUM_BPM,
  DEFAULT_DRUM_SWING,
  DEFAULT_OPEN_HI_HAT_SETTINGS,
  DEFAULT_SNARE_SETTINGS,
  MAX_DRUM_BPM,
  MAX_DRUM_SWING,
  MIN_DRUM_BPM,
  MIN_DRUM_SWING,
  createEmptyDrumPattern,
  createUnmutedDrumVoices,
  getNextDrumStepState,
  type BassDrumSettings,
  type ClapSettings,
  type CymbalSettings,
  type DrumMuteState,
  type DrumPattern,
  type DrumVoiceId,
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

  pattern: DrumPattern;
  mutedVoices: DrumMuteState;
  bpm: number;
  swing: number;
  isPlaying: boolean;
  currentStep: number;

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

  cycleStep: (
    voice: DrumVoiceId,
    step: number,
  ) => void;

  toggleVoiceMute: (
    voice: DrumVoiceId,
  ) => void;

  unmuteAllVoices: () => void;
  clearPattern: () => void;
  setBpm: (bpm: number) => void;
  setSwing: (swing: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentStep: (step: number) => void;

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

    pattern: createEmptyDrumPattern(),
    mutedVoices: createUnmutedDrumVoices(),
    bpm: DEFAULT_DRUM_BPM,
    swing: DEFAULT_DRUM_SWING,
    isPlaying: false,
    currentStep: -1,

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

    cycleStep: (voice, step) =>
      set((state) => {
        const nextVoiceSteps = [
          ...state.pattern[voice],
        ];

        nextVoiceSteps[step] =
          getNextDrumStepState(
            nextVoiceSteps[step],
          );

        return {
          pattern: {
            ...state.pattern,
            [voice]: nextVoiceSteps,
          },
        };
      }),

    toggleVoiceMute: (voice) =>
      set((state) => ({
        mutedVoices: {
          ...state.mutedVoices,
          [voice]:
            !state.mutedVoices[voice],
        },
      })),

    unmuteAllVoices: () =>
      set({
        mutedVoices:
          createUnmutedDrumVoices(),
      }),

    clearPattern: () =>
      set({
        pattern: createEmptyDrumPattern(),
      }),

    setBpm: (bpm) =>
      set({
        bpm: Math.min(
          Math.max(bpm, MIN_DRUM_BPM),
          MAX_DRUM_BPM,
        ),
      }),

    setSwing: (swing) =>
      set({
        swing: Math.min(
          Math.max(
            swing,
            MIN_DRUM_SWING,
          ),
          MAX_DRUM_SWING,
        ),
      }),

    setIsPlaying: (isPlaying) =>
      set({ isPlaying }),

    setCurrentStep: (currentStep) =>
      set({ currentStep }),

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