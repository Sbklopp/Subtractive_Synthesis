export interface MasterSettings {
  volume: number;
  muted: boolean;
}

export const DEFAULT_MASTER_SETTINGS: MasterSettings = {
  volume: -8,
  muted: false,
};