import * as Tone from 'tone';
import type {
  SnareSettings,
} from '../../../domain/DrumMachine';

const SECOND_OSCILLATOR_RATIO = 1.83;
const SNAP_FREQUENCY = 3200;

export class SnareVoice {
  private readonly bodyOscillatorA: Tone.Oscillator;
  private readonly bodyOscillatorB: Tone.Oscillator;
  private readonly bodyOscillatorAGain: Tone.Gain;
  private readonly bodyOscillatorBGain: Tone.Gain;
  private readonly bodyEnvelope: Tone.AmplitudeEnvelope;
  private readonly bodyGain: Tone.Gain;

  private readonly noise: Tone.Noise;
  private readonly noiseFilter: Tone.Filter;
  private readonly noiseEnvelope: Tone.AmplitudeEnvelope;
  private readonly noiseGain: Tone.Gain;

  private readonly snapFilter: Tone.Filter;
  private readonly snapEnvelope: Tone.AmplitudeEnvelope;
  private readonly snapGain: Tone.Gain;

  private readonly voiceMix: Tone.Gain;
  private readonly saturation: Tone.Distortion;
  private readonly outputGain: Tone.Gain;

  private settings: SnareSettings;

  constructor(
    settings: SnareSettings,
    output: Tone.Gain,
  ) {
    this.settings = { ...settings };

    this.bodyOscillatorA = new Tone.Oscillator({
      type: 'sine',
      frequency: settings.tune,
    });

    this.bodyOscillatorB = new Tone.Oscillator({
      type: 'sine',
      frequency:
        settings.tune *
        SECOND_OSCILLATOR_RATIO,
    });

    this.bodyOscillatorAGain =
      new Tone.Gain(0.78);

    this.bodyOscillatorBGain =
      new Tone.Gain(0.48);

    this.bodyEnvelope =
      new Tone.AmplitudeEnvelope({
        attack: 0.001,
        decay: this.getBodyDecay(
          settings.decay,
        ),
        sustain: 0,
        release: 0.04,
      });

    this.bodyGain = new Tone.Gain(
      this.getBodyLevel(
        settings.noiseAmount,
      ),
    );

    this.noise = new Tone.Noise('white');

    this.noiseFilter = new Tone.Filter({
      type: 'highpass',
      frequency: settings.tone,
      Q: 0.7,
      rolloff: -12,
    });

    this.noiseEnvelope =
      new Tone.AmplitudeEnvelope({
        attack: 0.001,
        decay: settings.decay,
        sustain: 0,
        release: 0.04,
      });

    this.noiseGain = new Tone.Gain(
      this.getNoiseLevel(
        settings.noiseAmount,
      ),
    );

    this.snapFilter = new Tone.Filter({
      type: 'bandpass',
      frequency: SNAP_FREQUENCY,
      Q: 1.1,
      rolloff: -12,
    });

    this.snapEnvelope =
      new Tone.AmplitudeEnvelope({
        attack: 0.0005,
        decay: 0.035,
        sustain: 0,
        release: 0.01,
      });

    this.snapGain = new Tone.Gain(
      this.getSnapLevel(
        settings.noiseAmount,
      ),
    );

    this.voiceMix = new Tone.Gain(0.9);

    this.saturation =
      new Tone.Distortion(0.18);

    this.saturation.wet.value = 0.32;

    this.outputGain = new Tone.Gain(
      settings.level,
    );

    this.bodyOscillatorA.connect(
      this.bodyOscillatorAGain,
    );

    this.bodyOscillatorAGain.connect(
      this.bodyEnvelope,
    );

    this.bodyOscillatorB.connect(
      this.bodyOscillatorBGain,
    );

    this.bodyOscillatorBGain.connect(
      this.bodyEnvelope,
    );

    this.bodyEnvelope.connect(
      this.bodyGain,
    );

    this.bodyGain.connect(this.voiceMix);

    this.noise.connect(this.noiseFilter);

    this.noiseFilter.connect(
      this.noiseEnvelope,
    );

    this.noiseEnvelope.connect(
      this.noiseGain,
    );

    this.noiseGain.connect(this.voiceMix);

    this.noise.connect(this.snapFilter);

    this.snapFilter.connect(
      this.snapEnvelope,
    );

    this.snapEnvelope.connect(
      this.snapGain,
    );

    this.snapGain.connect(this.voiceMix);

    this.voiceMix.connect(
      this.saturation,
    );

    this.saturation.connect(
      this.outputGain,
    );

    this.outputGain.connect(output);

    this.bodyOscillatorA.start();
    this.bodyOscillatorB.start();
    this.noise.start();
  }

  trigger(
    velocity = 1,
    time = Tone.now(),
  ): void {
    const normalizedVelocity = Math.min(
      Math.max(velocity, 0),
      1,
    );

    const fundamentalFrequency = Math.max(
      20,
      this.settings.tune,
    );

    const secondFrequency =
      fundamentalFrequency *
      SECOND_OSCILLATOR_RATIO;

    this.bodyOscillatorA.frequency
      .cancelScheduledValues(time);

    this.bodyOscillatorA.frequency
      .setValueAtTime(
        fundamentalFrequency * 1.1,
        time,
      );

    this.bodyOscillatorA.frequency
      .exponentialRampToValueAtTime(
        fundamentalFrequency,
        time + 0.03,
      );

    this.bodyOscillatorB.frequency
      .cancelScheduledValues(time);

    this.bodyOscillatorB.frequency
      .setValueAtTime(
        secondFrequency * 1.07,
        time,
      );

    this.bodyOscillatorB.frequency
      .exponentialRampToValueAtTime(
        secondFrequency,
        time + 0.025,
      );

    this.bodyEnvelope.triggerAttack(
      time,
      normalizedVelocity,
    );

    this.noiseEnvelope.triggerAttack(
      time,
      normalizedVelocity,
    );

    this.snapEnvelope.triggerAttack(
      time,
      normalizedVelocity,
    );
  }

  setSettings(
    settings: SnareSettings,
  ): void {
    this.settings = { ...settings };

    this.bodyOscillatorA.frequency.rampTo(
      settings.tune,
      0.02,
    );

    this.bodyOscillatorB.frequency.rampTo(
      settings.tune *
        SECOND_OSCILLATOR_RATIO,
      0.02,
    );

    this.bodyEnvelope.decay =
      this.getBodyDecay(settings.decay);

    this.noiseEnvelope.decay =
      settings.decay;

    this.noiseFilter.frequency.rampTo(
      settings.tone,
      0.02,
    );

    this.bodyGain.gain.rampTo(
      this.getBodyLevel(
        settings.noiseAmount,
      ),
      0.02,
    );

    this.noiseGain.gain.rampTo(
      this.getNoiseLevel(
        settings.noiseAmount,
      ),
      0.02,
    );

    this.snapGain.gain.rampTo(
      this.getSnapLevel(
        settings.noiseAmount,
      ),
      0.02,
    );

    this.outputGain.gain.rampTo(
      settings.level,
      0.02,
    );
  }

  dispose(): void {
    this.bodyOscillatorA.dispose();
    this.bodyOscillatorB.dispose();
    this.bodyOscillatorAGain.dispose();
    this.bodyOscillatorBGain.dispose();
    this.bodyEnvelope.dispose();
    this.bodyGain.dispose();

    this.noise.dispose();
    this.noiseFilter.dispose();
    this.noiseEnvelope.dispose();
    this.noiseGain.dispose();

    this.snapFilter.dispose();
    this.snapEnvelope.dispose();
    this.snapGain.dispose();

    this.voiceMix.dispose();
    this.saturation.dispose();
    this.outputGain.dispose();
  }

  private getBodyDecay(
    decay: number,
  ): number {
    return Math.max(0.05, decay * 0.72);
  }

  private getBodyLevel(
    noiseAmount: number,
  ): number {
    return (
      0.65 +
      (1 - noiseAmount) * 0.35
    );
  }

  private getNoiseLevel(
    noiseAmount: number,
  ): number {
    return noiseAmount * 0.9;
  }

  private getSnapLevel(
    noiseAmount: number,
  ): number {
    return 0.3 + noiseAmount * 0.3;
  }
}