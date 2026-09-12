import * as Tone from 'tone';
import type {
  BassDrumSettings,
} from '../../../domain/DrumMachine';

export class BassDrumVoice {
  private readonly synth:
    Tone.MembraneSynth;

  private readonly filter: Tone.Filter;
  private readonly output: Tone.Gain;

  private settings: BassDrumSettings;

  constructor(
    settings: BassDrumSettings,
    destination: Tone.InputNode,
  ) {
    this.settings = {
      ...settings,
      oscillatorType:
        settings.oscillatorType ??
        'triangle',
    };

    this.output = new Tone.Gain(
      this.settings.level,
    ).connect(destination);

    this.filter = new Tone.Filter({
      type: 'lowpass',
      frequency: this.settings.tone,
      rolloff: -24,
      Q: 1,
    }).connect(this.output);

    this.synth = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: this.settings.pitchDrop,

      oscillator: {
        type: this.settings.oscillatorType,
      },

      envelope: {
        attack: 0.001,
        decay: this.settings.decay,
        sustain: 0,
        release: 0.05,
      },
    }).connect(this.filter);
  }

  setSettings(
    settings: BassDrumSettings,
  ): void {
    this.settings = {
      ...settings,
      oscillatorType:
        settings.oscillatorType ??
        'triangle',
    };

    this.synth.set({
      pitchDecay: 0.05,
      octaves: this.settings.pitchDrop,

      oscillator: {
        type: this.settings.oscillatorType,
      },

      envelope: {
        attack: 0.001,
        decay: this.settings.decay,
        sustain: 0,
        release: 0.05,
      },
    });

    this.filter.frequency.rampTo(
      this.settings.tone,
      0.02,
    );

    this.output.gain.rampTo(
      this.settings.level,
      0.02,
    );
  }

  trigger(
    velocity = 1,
    time = Tone.now(),
  ): void {
    this.synth.triggerAttackRelease(
      this.settings.tune,
      this.settings.decay,
      time,
      velocity,
    );
  }

  dispose(): void {
    this.synth.dispose();
    this.filter.dispose();
    this.output.dispose();
  }
}