import * as Tone from 'tone';
import {
  DEFAULT_BASS_DRUM_SETTINGS,
  DEFAULT_CLAP_SETTINGS,
  DEFAULT_SNARE_SETTINGS,
  type BassDrumSettings,
  type ClapSettings,
  type SnareSettings,
} from '../../domain/DrumMachine';
import { BassDrumVoice } from './voices/BassDrumVoice';
import { ClapVoice } from './voices/ClapVoice';
import { SnareVoice } from './voices/SnareVoice';

export class DrumMachine {
  private readonly bassDrum: BassDrumVoice;
  private readonly snare: SnareVoice;
  private readonly clap: ClapVoice;

  constructor(output: Tone.Gain) {
    this.bassDrum = new BassDrumVoice(
      DEFAULT_BASS_DRUM_SETTINGS,
      output,
    );

    this.snare = new SnareVoice(
      DEFAULT_SNARE_SETTINGS,
      output,
    );

    this.clap = new ClapVoice(
      DEFAULT_CLAP_SETTINGS,
      output,
    );
  }

  triggerBassDrum(velocity = 1): void {
    this.bassDrum.trigger(velocity);
  }

  triggerSnare(velocity = 1): void {
    this.snare.trigger(velocity);
  }

  triggerClap(velocity = 1): void {
    this.clap.trigger(velocity);
  }

  setBassDrumSettings(
    settings: BassDrumSettings,
  ): void {
    this.bassDrum.setSettings(settings);
  }

  setSnareSettings(
    settings: SnareSettings,
  ): void {
    this.snare.setSettings(settings);
  }

  setClapSettings(
    settings: ClapSettings,
  ): void {
    this.clap.setSettings(settings);
  }

  dispose(): void {
    this.bassDrum.dispose();
    this.snare.dispose();
    this.clap.dispose();
  }
}