import * as Tone from 'tone';
import type {
  HiHatSettings,
} from '../../../domain/DrumMachine';

const METALLIC_FREQUENCIES = [
  205.35,
  304.41,
  369.64,
  522.71,
  615.89,
  835.34,
];

export class HiHatVoice {
  private readonly oscillators: Tone.Oscillator[];
  private readonly noise: Tone.Noise;

  private readonly metallicGain: Tone.Gain;
  private readonly noiseGain: Tone.Gain;

  private readonly highpassFilter: Tone.Filter;
  private readonly bandpassFilter: Tone.Filter;
  private readonly envelope: Tone.AmplitudeEnvelope;

  private readonly saturation: Tone.Distortion;
  private readonly outputGain: Tone.Gain;

  constructor(
    settings: HiHatSettings,
    output: Tone.Gain,
  ) {
    this.oscillators = METALLIC_FREQUENCIES.map(
      (frequency) =>
        new Tone.Oscillator({
          type: 'square',
          frequency,
        }),
    );

    this.noise = new Tone.Noise('white');

    this.metallicGain = new Tone.Gain(
      this.getMetallicLevel(settings.metallic),
    );

    this.noiseGain = new Tone.Gain(
      this.getNoiseLevel(settings.metallic),
    );

    this.highpassFilter = new Tone.Filter({
      type: 'highpass',
      frequency: settings.tone,
      Q: 0.8,
      rolloff: -24,
    });

    this.bandpassFilter = new Tone.Filter({
      type: 'bandpass',
      frequency: 9500,
      Q: 0.55,
      rolloff: -12,
    });

    this.envelope =
      new Tone.AmplitudeEnvelope({
        attack: 0.001,
        decay: settings.decay,
        sustain: 0,
        release: 0.018,
      });

    this.saturation =
      new Tone.Distortion(0.1);

    this.saturation.wet.value = 0.18;

    this.outputGain = new Tone.Gain(
      settings.level,
    );

    this.oscillators.forEach((oscillator) => {
      oscillator.connect(this.metallicGain);
      oscillator.start();
    });

    this.noise.connect(this.noiseGain);
    this.noise.start();

    this.metallicGain.connect(
      this.highpassFilter,
    );

    this.noiseGain.connect(
      this.highpassFilter,
    );

    this.highpassFilter.connect(
      this.bandpassFilter,
    );

    this.bandpassFilter.connect(
      this.envelope,
    );

    this.envelope.connect(
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

    this.envelope.triggerAttack(
      time,
      normalizedVelocity,
    );
  }

  choke(time = Tone.now()): void {
    this.envelope.triggerRelease(time);
  }

  setSettings(
    settings: HiHatSettings,
  ): void {
    this.envelope.decay = settings.decay;

    this.highpassFilter.frequency.rampTo(
      settings.tone,
      0.02,
    );

    this.metallicGain.gain.rampTo(
      this.getMetallicLevel(
        settings.metallic,
      ),
      0.02,
    );

    this.noiseGain.gain.rampTo(
      this.getNoiseLevel(
        settings.metallic,
      ),
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
    this.highpassFilter.dispose();
    this.bandpassFilter.dispose();
    this.envelope.dispose();
    this.saturation.dispose();
    this.outputGain.dispose();
  }

  private getMetallicLevel(
    metallic: number,
  ): number {
    return 0.025 + metallic * 0.045;
  }

  private getNoiseLevel(
    metallic: number,
  ): number {
    return 0.12 + (1 - metallic) * 0.55;
  }
}