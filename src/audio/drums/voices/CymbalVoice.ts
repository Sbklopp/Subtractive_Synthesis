import * as Tone from 'tone';
import type {
  CymbalSettings,
} from '../../../domain/DrumMachine';

const CYMBAL_FREQUENCIES = [
  296,
  378,
  454,
  536,
  682,
  851,
];

export class CymbalVoice {
  private readonly oscillators: Tone.Oscillator[];
  private readonly noise: Tone.Noise;

  private readonly metallicGain: Tone.Gain;
  private readonly noiseGain: Tone.Gain;

  private readonly metallicFilter: Tone.Filter;
  private readonly noiseFilter: Tone.Filter;

  private readonly metallicEnvelope:
    Tone.AmplitudeEnvelope;

  private readonly noiseEnvelope:
    Tone.AmplitudeEnvelope;

  private readonly voiceMix: Tone.Gain;
  private readonly saturation: Tone.Distortion;
  private readonly outputGain: Tone.Gain;

  constructor(
    settings: CymbalSettings,
    output: Tone.Gain,
  ) {
    this.oscillators = CYMBAL_FREQUENCIES.map(
      (frequency) =>
        new Tone.Oscillator({
          type: 'square',
          frequency,
        }),
    );

    this.noise = new Tone.Noise('white');

    this.metallicGain = new Tone.Gain(
      this.getMetallicLevel(settings.wash),
    );

    this.noiseGain = new Tone.Gain(
      this.getNoiseLevel(settings.wash),
    );

    this.metallicFilter = new Tone.Filter({
      type: 'highpass',
      frequency: settings.tone,
      Q: 0.7,
      rolloff: -24,
    });

    this.noiseFilter = new Tone.Filter({
      type: 'highpass',
      frequency:
        this.getNoiseFilterFrequency(
          settings.tone,
        ),
      Q: 0.55,
      rolloff: -12,
    });

    this.metallicEnvelope =
      new Tone.AmplitudeEnvelope({
        attack: 0.001,
        decay: this.getMetallicDecay(
          settings.decay,
        ),
        sustain: 0,
        release: 0.12,
      });

    this.noiseEnvelope =
      new Tone.AmplitudeEnvelope({
        attack: 0.003,
        decay: settings.decay,
        sustain: 0,
        release: 0.18,
      });

    this.voiceMix = new Tone.Gain(0.85);

    this.saturation =
      new Tone.Distortion(0.08);

    this.saturation.wet.value = 0.16;

    this.outputGain = new Tone.Gain(
      settings.level,
    );

    this.oscillators.forEach((oscillator) => {
      oscillator.connect(this.metallicGain);
      oscillator.start();
    });

    this.metallicGain.connect(
      this.metallicFilter,
    );

    this.metallicFilter.connect(
      this.metallicEnvelope,
    );

    this.metallicEnvelope.connect(
      this.voiceMix,
    );

    this.noise.connect(this.noiseGain);
    this.noise.start();

    this.noiseGain.connect(
      this.noiseFilter,
    );

    this.noiseFilter.connect(
      this.noiseEnvelope,
    );

    this.noiseEnvelope.connect(
      this.voiceMix,
    );

    this.voiceMix.connect(
      this.saturation,
    );

    this.saturation.connect(
      this.outputGain,
    );

    this.outputGain.connect(output);
  }

  trigger(
    velocity = 1,
    time = Tone.now(),
  ): void {
    const normalizedVelocity = Math.min(
      Math.max(velocity, 0),
      1,
    );

    this.metallicEnvelope.triggerAttack(
      time,
      normalizedVelocity,
    );

    this.noiseEnvelope.triggerAttack(
      time,
      normalizedVelocity * 0.9,
    );
  }

  setSettings(
    settings: CymbalSettings,
  ): void {
    this.metallicEnvelope.decay =
      this.getMetallicDecay(settings.decay);

    this.noiseEnvelope.decay =
      settings.decay;

    this.metallicFilter.frequency.rampTo(
      settings.tone,
      0.02,
    );

    this.noiseFilter.frequency.rampTo(
      this.getNoiseFilterFrequency(
        settings.tone,
      ),
      0.02,
    );

    this.metallicGain.gain.rampTo(
      this.getMetallicLevel(settings.wash),
      0.02,
    );

    this.noiseGain.gain.rampTo(
      this.getNoiseLevel(settings.wash),
      0.02,
    );

    this.outputGain.gain.rampTo(
      settings.level,
      0.02,
    );
  }

  dispose(): void {
    this.oscillators.forEach((oscillator) => {
      oscillator.dispose();
    });

    this.noise.dispose();
    this.metallicGain.dispose();
    this.noiseGain.dispose();
    this.metallicFilter.dispose();
    this.noiseFilter.dispose();
    this.metallicEnvelope.dispose();
    this.noiseEnvelope.dispose();
    this.voiceMix.dispose();
    this.saturation.dispose();
    this.outputGain.dispose();
  }

  private getMetallicDecay(
    decay: number,
  ): number {
    return Math.max(0.1, decay * 0.55);
  }

  private getMetallicLevel(
    wash: number,
  ): number {
    return 0.025 + (1 - wash) * 0.04;
  }

  private getNoiseLevel(
    wash: number,
  ): number {
    return 0.15 + wash * 0.55;
  }

  private getNoiseFilterFrequency(
    tone: number,
  ): number {
    return Math.max(1800, tone * 0.72);
  }
}