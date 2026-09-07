import * as Tone from 'tone';
import type {
  BassDrumSettings,
} from '../../../domain/DrumMachine';

export class BassDrumVoice {
  private synth: Tone.MembraneSynth;
  private toneFilter: Tone.Filter;
  private outputGain: Tone.Gain;
  private settings: BassDrumSettings;

  constructor(
    settings: BassDrumSettings,
    output: Tone.Gain,
  ) {
    this.settings = {
      ...settings,
    };

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
      rolloff: -24,
      Q: 0.5,
    });

    this.outputGain = new Tone.Gain(
      settings.level,
    );

    this.synth.chain(
      this.toneFilter,
      this.outputGain,
      output,
    );
  }

  trigger(velocity = 1): void {
    const now = Tone.now();

    this.synth.triggerAttackRelease(
      this.settings.tune,
      this.settings.decay,
      now,
      velocity,
    );
  }

  setSettings(settings: BassDrumSettings): void {
    this.settings = {
      ...settings,
    };

    this.synth.octaves = settings.pitchDrop;
    this.synth.envelope.decay = settings.decay;

    this.toneFilter.frequency.rampTo(
      settings.tone,
      0.05,
    );

    this.outputGain.gain.rampTo(
      settings.level,
      0.05,
    );
  }

  dispose(): void {
    this.synth.dispose();
    this.toneFilter.dispose();
    this.outputGain.dispose();
  }
}