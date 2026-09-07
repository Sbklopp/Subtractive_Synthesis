import { create } from 'zustand';
import {
  DEFAULT_SYNTH_PATCH,
  cloneSynthPatch,
  type EnvelopeSettings,
  type FilterEnvelopeSettings,
  type LfoSettings,
  type OscillatorId,
  type OscillatorSettings,
  type SynthPatch,
} from '../domain/Synth';
import type { SynthPreset } from '../domain/SynthPresets';

interface SynthStore {
  patch: SynthPatch;
  selectedPresetId: string;

  updateOscillator: (
    oscillatorId: OscillatorId,
    settings: Partial<OscillatorSettings>,
  ) => void;

  setFilterCutoff: (cutoff: number) => void;
  setFilterResonance: (resonance: number) => void;

  setFilterEnvelope: (
    envelope: FilterEnvelopeSettings,
  ) => void;

  setAmplitudeEnvelope: (
    envelope: EnvelopeSettings,
  ) => void;

  setLfo: (lfo: LfoSettings) => void;

  applyPreset: (preset: SynthPreset) => void;
  resetPatch: () => void;
}

export const useSynthStore = create<SynthStore>()(
  (set) => ({
    patch: cloneSynthPatch(DEFAULT_SYNTH_PATCH),
    selectedPresetId: 'init',

    updateOscillator: (
      oscillatorId,
      settings,
    ) => {
      set((state) => ({
        selectedPresetId: 'custom',

        patch: {
          ...state.patch,

          oscillators: {
            ...state.patch.oscillators,

            [oscillatorId]: {
              ...state.patch.oscillators[oscillatorId],
              ...settings,
            },
          },
        },
      }));
    },

    setFilterCutoff: (cutoff) => {
      set((state) => ({
        selectedPresetId: 'custom',

        patch: {
          ...state.patch,

          filter: {
            ...state.patch.filter,
            cutoff,
          },
        },
      }));
    },

    setFilterResonance: (resonance) => {
      set((state) => ({
        selectedPresetId: 'custom',

        patch: {
          ...state.patch,

          filter: {
            ...state.patch.filter,
            resonance,
          },
        },
      }));
    },

    setFilterEnvelope: (envelope) => {
      set((state) => ({
        selectedPresetId: 'custom',

        patch: {
          ...state.patch,

          filter: {
            ...state.patch.filter,
            envelope: {
              ...envelope,
            },
          },
        },
      }));
    },

    setAmplitudeEnvelope: (amplitudeEnvelope) => {
      set((state) => ({
        selectedPresetId: 'custom',

        patch: {
          ...state.patch,
          amplitudeEnvelope: {
            ...amplitudeEnvelope,
          },
        },
      }));
    },

    setLfo: (lfo) => {
      set((state) => ({
        selectedPresetId: 'custom',

        patch: {
          ...state.patch,

          lfo: {
            ...lfo,

            pitch: {
              ...lfo.pitch,
            },

            filter: {
              ...lfo.filter,
            },

            pulseWidth: {
              ...lfo.pulseWidth,
            },
          },
        },
      }));
    },

    applyPreset: (preset) => {
      set({
        patch: cloneSynthPatch(preset.patch),
        selectedPresetId: preset.id,
      });
    },

    resetPatch: () => {
      set({
        patch: cloneSynthPatch(DEFAULT_SYNTH_PATCH),
        selectedPresetId: 'init',
      });
    },
  }),
);