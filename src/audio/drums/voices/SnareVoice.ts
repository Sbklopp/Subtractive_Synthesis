import * as Tone from 'tone';
import type {
  SnareSettings,
} from '../../../domain/DrumMachine';

export class SnareVoice {
  private bodyOscillatorA: Tone.Oscillator;
  private bodyOscillatorB: Tone.Oscillator;
  private bodyOscillatorAGain: Tone.Gain;
  private bodyOscillatorBGain: Tone.Gain;
  private bodyEnvelope: Tone.AmplitudeEnvelope;
  private bodyAmountGain: Tone.Gain;

  private noise: Tone.Noise;
  private noiseFilter: Tone.Filter;
  private noiseEnvelope: Tone.AmplitudeEnvelope;
  private noiseAmountGain: Tone.Gain;

  private outputGain: Tone.Gain;

  constructor(
    settings: SnareSettings,
    output: Tone.Gain,
  ) {
    this.bodyOscillatorA = new Tone.Oscillator({
      frequency: settings.tune,
      type: 'sine',
    });

    this.bodyOscillatorB = new Tone.Oscillator({
      frequency: settings.tune * 1.83,
      type: 'sine',
    });

    this.bodyOscillatorAGain = new Tone.Gain(0.7);
    this.bodyOscillatorBGain = new Tone.Gain(0.3);

    this.bodyEnvelope =
      new Tone.AmplitudeEnvelope({
        attack: 0.001,
        decay: settings.decay,
        sustain: 0,
        release: 0.05,
      });

    this.bodyAmountGain = new Tone.Gain(
      1 - settings.noiseAmount,
    );

    this.noise = new Tone.Noise('white');

    this.noiseFilter = new Tone.Filter({
      type: 'highpass',
      frequency: settings.tone,
      rolloff: -24,
      Q: 0.8,
    });

    this.noiseEnvelope =
      new Tone.AmplitudeEnvelope({
        attack: 0.001,
        decay: settings.decay * 0.8,
        sustain: 0,
        release: 0.05,
      });

    this.noiseAmountGain = new Tone.Gain(
      settings.noiseAmount,
    );

    this.outputGain = new Tone.Gain(
      settings.level,
    );

    this.bodyOscillatorA.chain(
      this.bodyOscillatorAGain,
      this.bodyEnvelope,
    );

    this.bodyOscillatorB.chain(
      this.bodyOscillatorBGain,
      this.bodyEnvelope,
    );

    this.bodyEnvelope.chain(
      this.bodyAmountGain,
      this.outputGain,
    );

    this.noise.chain(
      this.noiseFilter,
      this.noiseEnvelope,
      this.noiseAmountGain,
      this.outputGain,
    );

    this.outputGain.connect(output);

    this.bodyOscillatorA.start();
    this.bodyOscillatorB.start();
    this.noise.start();
  }

  trigger(velocity = 1): void {
    const now = Tone.now();

    this.bodyEnvelope.triggerAttack(now, velocity);
    this.noiseEnvelope.triggerAttack(now, velocity);
  }

  setSettings(settings: SnareSettings): void {
    this.bodyOscillatorA.frequency.rampTo(
      settings.tune,
      0.05,
    );

    this.bodyOscillatorB.frequency.rampTo(
      settings.tune * 1.83,
      0.05,
    );

    this.bodyEnvelope.decay = settings.decay;

    this.noiseEnvelope.decay =
      settings.decay * 0.8;

    this.bodyAmountGain.gain.rampTo(
      1 - settings.noiseAmount,
      0.05,
    );

    this.noiseAmountGain.gain.rampTo(
      settings.noiseAmount,
      0.05,
    );

    this.noiseFilter.frequency.rampTo(
      settings.tone,
      0.05,
    );

    this.outputGain.gain.rampTo(
      settings.level,
      0.05,
    );
  }

  dispose(): void {
    this.bodyOscillatorA.stop();
    this.bodyOscillatorB.stop();
    this.noise.stop();

    this.bodyOscillatorA.dispose();
    this.bodyOscillatorB.dispose();
    this.bodyOscillatorAGain.dispose();
    this.bodyOscillatorBGain.dispose();
    this.bodyEnvelope.dispose();
    this.bodyAmountGain.dispose();

    this.noise.dispose();
    this.noiseFilter.dispose();
    this.noiseEnvelope.dispose();
    this.noiseAmountGain.dispose();

    this.outputGain.dispose();
  }
}