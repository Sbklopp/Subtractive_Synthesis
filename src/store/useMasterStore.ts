import { create } from 'zustand';
import {
  DEFAULT_MASTER_SETTINGS,
} from '../domain/Audio';

interface MasterStore {
  volume: number;
  muted: boolean;

  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
}

export const useMasterStore =
  create<MasterStore>()((set) => ({
    volume: DEFAULT_MASTER_SETTINGS.volume,
    muted: DEFAULT_MASTER_SETTINGS.muted,

    setVolume: (volume) => {
      set({
        volume,
      });
    },

    setMuted: (muted) => {
      set({
        muted,
      });
    },
  }));