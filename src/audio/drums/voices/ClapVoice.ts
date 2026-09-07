import * as Tone from 'tone';
import type {
  ClapSettings,
} from '../../../domain/DrumMachine';

const TRANSIENT_OFFSETS = [
  0,
  0.85,
  1.8,
  3,
];

const TRANSIENT_LEVELS = [
  1,
  0.88,
  0.8,
  0.72,
];

export class ClapVoice {
  private readonly noise: Tone.Noise;

  private readonly transientFilter: Tone.Filter;
  private readonly transientEnvelopes:
    Tone.AmplitudeEnvelope[];
  private readonly transientGain: Tone.Gain;

  private readonly bodyFilter: Tone.Filter;
  private readonly bodyEnvelope: Tone.AmplitudeEnvelope;
  private readonly bodyGain: Tone.Gain;

  private readonly tailFilter: Tone.Filter;
  private readonly tailEnvelope: Tone.AmplitudeEnvelope;
  private readonly tailGain: Tone.Gain;

  private readonly voiceMix: Tone.Gain;
  private readonly saturation: Tone.Distortion;
  private readonly outputGain: Tone.Gain;

  private settings: ClapSettings;

  constructor(
    settings: ClapSettings,
    output: Tone.Gain,
  ) {
    this.settings = { ...settings };

    this.noise = new Tone.Noise('white');

    this.transientFilter = new Tone.Filter({
      type: 'bandpass',
      frequency:
        this.getTransientFrequency(
          settings.tone,
        ),
      Q: 1.15,
      rolloff: -12,
    });

    this.transientEnvelopes =
      TRANSIENT_OFFSETS.map(
        () =>
          new Tone.AmplitudeEnvelope({
            attack: 0.0005,
            decay: 0.02,
            sustain: 0,
            release: 0.008,
          }),
      );

    this.transientGain =
      new Tone.Gain(0.85);

    this.bodyFilter = new Tone.Filter({
      type: 'bandpass',
      frequency:
        this.getBodyFrequency(
          settings.tone,
        ),
      Q: 0.8,
      rolloff: -12,
    });

    this.bodyEnvelope =
      new Tone.AmplitudeEnvelope({
        attack: 0.001,
        decay: 0.09,
        sustain: 0,
        release: 0.025,
      });

    this.bodyGain = new Tone.Gain(0.42);

    this.tailFilter = new Tone.Filter({
      type: 'highpass',
      frequency:
        this.getTailFrequency(
          settings.tone,
        ),
      Q: 0.7,
      rolloff: -12,
    });

    this.tailEnvelope =
      new Tone.AmplitudeEnvelope({
        attack: 0.001,
        decay: settings.decay,
        sustain: 0,
        release: 0.05,
      });

    this.tailGain = new Tone.Gain(0.62);
    this.voiceMix = new Tone.Gain(0.92);

    this.saturation =
      new Tone.Distortion(0.2);

    this.saturation.wet.value = 0.3;

    this.outputGain = new Tone.Gain(
      settings.level,
    );

    this.noise.connect(
      this.transientFilter,
    );

    this.transientEnvelopes.forEach(
      (envelope) => {
        this.transientFilter.connect(
          envelope,
        );

        envelope.connect(
          this.transientGain,
        );
      },
    );

    this.transientGain.connect(
      this.voiceMix,
    );

    this.noise.connect(this.bodyFilter);

    this.bodyFilter.connect(
      this.bodyEnvelope,
    );

    this.bodyEnvelope.connect(
      this.bodyGain,
    );

    this.bodyGain.connect(this.voiceMix);

    this.noise.connect(this.tailFilter);

    this.tailFilter.connect(
      this.tailEnvelope,
    );

    this.tailEnvelope.connect(
      this.tailGain,
    );

    this.tailGain.connect(this.voiceMix);

    this.voiceMix.connect(
      this.saturation,
    );

    this.saturation.connect(
      this.outputGain,
    );

    this.outputGain.connect(output);

    this.noise.start();
  }

  trigger(velocity = 1): void {
    const now = Tone.now();

    const normalizedVelocity = Math.min(
      Math.max(velocity, 0),
      1,
    );

    this.transientEnvelopes.forEach(
      (envelope, index) => {
        const triggerTime =
          now +
          TRANSIENT_OFFSETS[index] *
            this.settings.spread;

        const transientVelocity =
          normalizedVelocity *
          TRANSIENT_LEVELS[index];

        envelope.triggerAttack(
          triggerTime,
          transientVelocity,
        );
      },
    );

    this.bodyEnvelope.triggerAttack(
      now,
      normalizedVelocity * 0.8,
    );

    const tailStart =
      now + this.settings.spread * 1.8;

    this.tailEnvelope.triggerAttack(
      tailStart,
      normalizedVelocity * 0.85,
    );
  }

  setSettings(
    settings: ClapSettings,
  ): void {
    this.settings = { ...settings };

    this.transientFilter.frequency.rampTo(
      this.getTransientFrequency(
        settings.tone,
      ),
      0.02,
    );

    this.bodyFilter.frequency.rampTo(
      this.getBodyFrequency(
        settings.tone,
      ),
      0.02,
    );

    this.tailFilter.frequency.rampTo(
      this.getTailFrequency(
        settings.tone,
      ),
      0.02,
    );

    this.tailEnvelope.decay =
      settings.decay;

    this.outputGain.gain.rampTo(
      settings.level,
      0.02,
    );
  }

  dispose(): void {
    this.noise.dispose();

    this.transientFilter.dispose();

    this.transientEnvelopes.forEach(
      (envelope) => {
        envelope.dispose();
      },
    );

    this.transientGain.dispose();

    this.bodyFilter.dispose();
    this.bodyEnvelope.dispose();
    this.bodyGain.dispose();

    this.tailFilter.dispose();
    this.tailEnvelope.dispose();
    this.tailGain.dispose();

    this.voiceMix.dispose();
    this.saturation.dispose();
    this.outputGain.dispose();
  }

  private getTransientFrequency(
    tone: number,
  ): number {
    return Math.min(
      6000,
      Math.max(1100, tone * 1.35),
    );
  }

  private getBodyFrequency(
    tone: number,
  ): number {
    return Math.min(
      4500,
      Math.max(650, tone * 0.75),
    );
  }

  private getTailFrequency(
    tone: number,
  ): number {
    return Math.min(
      4000,
      Math.max(350, tone * 0.55),
    );
  }
}