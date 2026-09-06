import * as Tone from 'tone';
import { SubtractiveSynth } from './synth/SubtractiveSynth';

class AudioController {
  private synth: SubtractiveSynth | null = null;

  async initialize(): Promise<void> {
    if (this.synth) {
      return;
    }

    await Tone.start();

    this.synth = new SubtractiveSynth();
  }

  async playNote(note: string): Promise<void> {
    await this.initialize();

    this.synth?.playNote(note);
  }

  dispose(): void {
    this.synth?.dispose();
    this.synth = null;
  }
}

export const audioController = new AudioController();