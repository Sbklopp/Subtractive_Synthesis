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
  type DrumVoiceId,
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

  triggerVoice(
    voice: DrumVoiceId,
    velocity = 1,
    time = Tone.now(),
  ): void {
    switch (voice) {
      case 'bassDrum':
        this.triggerBassDrum(velocity, time);
        break;

      case 'snare':
        this.triggerSnare(velocity, time);
        break;

      case 'clap':
        this.triggerClap(velocity, time);
        break;

      case 'closedHiHat':
        this.triggerClosedHiHat(velocity, time);
        break;

      case 'openHiHat':
        this.triggerOpenHiHat(velocity, time);
        break;

      case 'cymbal':
        this.triggerCymbal(velocity, time);
        break;
    }
  }

  triggerBassDrum(
    velocity = 1,
    time = Tone.now(),
  ): void {
    this.bassDrum.trigger(velocity, time);
  }

  triggerSnare(
    velocity = 1,
    time = Tone.now(),
  ): void {
    this.snare.trigger(velocity, time);
  }

  triggerClap(
    velocity = 1,
    time = Tone.now(),
  ): void {
    this.clap.trigger(velocity, time);
  }

  triggerClosedHiHat(
    velocity = 1,
    time = Tone.now(),
  ): void {
    this.openHiHat.choke(time);
    this.closedHiHat.trigger(velocity, time);
  }

  triggerOpenHiHat(
    velocity = 1,
    time = Tone.now(),
  ): void {
    this.closedHiHat.choke(time);
    this.openHiHat.trigger(velocity, time);
  }

  triggerCymbal(
    velocity = 1,
    time = Tone.now(),
  ): void {
    this.cymbal.trigger(velocity, time);
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