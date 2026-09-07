import * as Tone from 'tone';
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
} from '../../domain/DrumMachine';
import { BassDrumVoice } from './voices/BassDrumVoice';
import { ClapVoice } from './voices/ClapVoice';
import { CymbalVoice } from './voices/CymbalVoice';
import { HiHatVoice } from './voices/HiHatVoice';
import { SnareVoice } from './voices/SnareVoice';

export class DrumMachine {
  private readonly bassDrum: BassDrumVoice;
  private readonly snare: SnareVoice;
  private readonly clap: ClapVoice;
  private readonly closedHiHat: HiHatVoice;
  private readonly openHiHat: HiHatVoice;
  private readonly cymbal: CymbalVoice;

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

    this.closedHiHat = new HiHatVoice(
      DEFAULT_CLOSED_HI_HAT_SETTINGS,
      output,
    );

    this.openHiHat = new HiHatVoice(
      DEFAULT_OPEN_HI_HAT_SETTINGS,
      output,
    );

    this.cymbal = new CymbalVoice(
      DEFAULT_CYMBAL_SETTINGS,
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

  triggerClosedHiHat(velocity = 1): void {
    const now = Tone.now();

    this.openHiHat.choke(now);
    this.closedHiHat.trigger(velocity, now);
  }

  triggerOpenHiHat(velocity = 1): void {
    const now = Tone.now();

    this.closedHiHat.choke(now);
    this.openHiHat.trigger(velocity, now);
  }

  triggerCymbal(velocity = 1): void {
    this.cymbal.trigger(velocity);
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

  setClosedHiHatSettings(
    settings: HiHatSettings,
  ): void {
    this.closedHiHat.setSettings(settings);
  }

  setOpenHiHatSettings(
    settings: HiHatSettings,
  ): void {
    this.openHiHat.setSettings(settings);
  }

  setCymbalSettings(
    settings: CymbalSettings,
  ): void {
    this.cymbal.setSettings(settings);
  }

  dispose(): void {
    this.bassDrum.dispose();
    this.snare.dispose();
    this.clap.dispose();
    this.closedHiHat.dispose();
    this.openHiHat.dispose();
    this.cymbal.dispose();
  }
}