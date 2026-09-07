import * as Tone from 'tone';
import type {
  BassDrumSettings,
} from '../../../domain/DrumMachine';

export class BassDrumVoice {
  private readonly synth: Tone.MembraneSynth;
  private readonly toneFilter: Tone.Filter;
  private readonly outputGain: Tone.Gain;

  private settings: BassDrumSettings;

  constructor(
    settings: BassDrumSettings,
    output: Tone.Gain,
  ) {
    this.settings = { ...settings };

    this.synth = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: settings.pitchDrop,
      oscillator: {
        type: 'sine',
      },
      envelope: {
        attack: 0.001,
        decay: settings.decay,
        sustain: 0,
        release: 0.05,
      },
    });

    this.toneFilter = new Tone.Filter({
      type: 'lowpass',
      frequency: settings.tone,
      Q: 0.7,
      rolloff: -24,
    });

    this.outputGain = new Tone.Gain(
      settings.level,
    );

    this.synth.connect(this.toneFilter);
    this.toneFilter.connect(this.outputGain);
    this.outputGain.connect(output);
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

  setSettings(
    settings: BassDrumSettings,
  ): void {
    this.settings = { ...settings };

    this.synth.octaves =
      settings.pitchDrop;

    this.synth.envelope.decay =
      settings.decay;

    this.toneFilter.frequency.rampTo(
      settings.tone,
      0.02,
    );

    this.outputGain.gain.rampTo(
      settings.level,
      0.02,
    );
  }

  dispose(): void {
    this.synth.dispose();
    this.toneFilter.dispose();
    this.outputGain.dispose();
  }
}