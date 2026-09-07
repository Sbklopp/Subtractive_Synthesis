import * as Tone from 'tone';
import type { ClapSettings } from '../../../domain/DrumMachine';

const TRANSIENT_COUNT = 3;

export class ClapVoice {
  private readonly noise: Tone.Noise;
  private readonly transientFilter: Tone.Filter;
  private readonly tailFilter: Tone.Filter;
  private readonly transientEnvelopes: Tone.AmplitudeEnvelope[];
  private readonly transientGain: Tone.Gain;
  private readonly tailEnvelope: Tone.AmplitudeEnvelope;
  private readonly tailGain: Tone.Gain;
  private readonly outputGain: Tone.Gain;

  private settings: ClapSettings;

  constructor(settings: ClapSettings, output: Tone.Gain) {
    this.settings = { ...settings };

    this.noise = new Tone.Noise('white');

    this.transientFilter = new Tone.Filter({
      type: 'bandpass',
      frequency: settings.tone,
      Q: 0.8,
      rolloff: -12,
    });

    this.tailFilter = new Tone.Filter({
      type: 'highpass',
      frequency: this.getTailCutoff(settings.tone),
      Q: 0.7,
      rolloff: -12,
    });

    this.transientEnvelopes = Array.from(
      { length: TRANSIENT_COUNT },
      () =>
        new Tone.AmplitudeEnvelope({
          attack: 0.001,
          decay: 0.02,
          sustain: 0,
          release: 0.01,
        }),
    );

    this.transientGain = new Tone.Gain(0.8);

    this.tailEnvelope = new Tone.AmplitudeEnvelope({
      attack: 0.001,
      decay: settings.decay,
      sustain: 0,
      release: 0.04,
    });

    this.tailGain = new Tone.Gain(0.55);
    this.outputGain = new Tone.Gain(settings.level);

    this.noise.connect(this.transientFilter);
    this.noise.connect(this.tailFilter);

    this.transientEnvelopes.forEach((envelope) => {
      this.transientFilter.connect(envelope);
      envelope.connect(this.transientGain);
    });

    this.transientGain.connect(this.outputGain);

    this.tailFilter.connect(this.tailEnvelope);
    this.tailEnvelope.connect(this.tailGain);
    this.tailGain.connect(this.outputGain);

    this.outputGain.connect(output);
    this.noise.start();
  }

  trigger(velocity = 1): void {
    const now = Tone.now();
    const normalizedVelocity = Math.min(Math.max(velocity, 0), 1);

    this.transientEnvelopes.forEach((envelope, index) => {
      const triggerTime = now + index * this.settings.spread;
      envelope.triggerAttack(triggerTime, normalizedVelocity);
    });

    const tailStart =
      now + (TRANSIENT_COUNT - 1) * this.settings.spread;

    this.tailEnvelope.triggerAttack(
      tailStart,
      normalizedVelocity * 0.85,
    );
  }

  setSettings(settings: ClapSettings): void {
    this.settings = { ...settings };

    this.transientFilter.frequency.rampTo(settings.tone, 0.02);
    this.tailFilter.frequency.rampTo(
      this.getTailCutoff(settings.tone),
      0.02,
    );

    this.tailEnvelope.decay = settings.decay;
    this.outputGain.gain.rampTo(settings.level, 0.02);
  }

  dispose(): void {
    this.noise.dispose();
    this.transientFilter.dispose();
    this.tailFilter.dispose();

    this.transientEnvelopes.forEach((envelope) => {
      envelope.dispose();
    });

    this.transientGain.dispose();
    this.tailEnvelope.dispose();
    this.tailGain.dispose();
    this.outputGain.dispose();
  }

  private getTailCutoff(tone: number): number {
    return Math.max(250, tone * 0.55);
  }
}