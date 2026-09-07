import * as Tone from 'tone';
import {
  DEFAULT_MASTER_SETTINGS,
  type MasterSettings,
} from '../domain/Audio';

export class MasterBus {
  readonly input: Tone.Gain;

  private volume: Tone.Volume;
  private limiter: Tone.Limiter;
  private waveform: Tone.Waveform;

  constructor(
    settings: MasterSettings =
      DEFAULT_MASTER_SETTINGS,
  ) {
    this.input = new Tone.Gain(1);

    this.volume = new Tone.Volume({
      volume: settings.volume,
      mute: settings.muted,
    });

    this.limiter = new Tone.Limiter(-1);
    this.waveform = new Tone.Waveform(1024);

    this.input.chain(
      this.volume,
      this.limiter,
    );

    this.limiter.toDestination();
    this.limiter.connect(this.waveform);
  }

  setVolume(volume: number): void {
    this.volume.volume.rampTo(volume, 0.05);
  }

  setMuted(muted: boolean): void {
    this.volume.mute = muted;
  }

  getWaveformData(): Float32Array {
    return this.waveform.getValue();
  }

  dispose(): void {
    this.input.dispose();
    this.volume.dispose();
    this.limiter.dispose();
    this.waveform.dispose();
  }
}