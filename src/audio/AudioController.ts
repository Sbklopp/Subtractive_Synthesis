import * as Tone from 'tone';
import type {
  EnvelopeSettings,
  OscillatorType,
} from '../domain/Synth';
import { SubtractiveSynth } from './synth/SubtractiveSynth';

class AudioController {
  private synth: SubtractiveSynth | null = null;
  private noteRequestId = 0;

  async initialize(): Promise<void> {
    if (this.synth) {
      return;
    }

    await Tone.start();

    this.synth = new SubtractiveSynth();
  }

  async startNote(note: string): Promise<void> {
    const requestId = ++this.noteRequestId;

    await this.initialize();

    if (requestId !== this.noteRequestId) {
      return;
    }

    this.synth?.startNote(note);
  }

  releaseNote(): void {
    this.noteRequestId += 1;
    this.synth?.releaseNote();
  }

  async setOscillatorType(type: OscillatorType): Promise<void> {
    await this.initialize();

    this.synth?.setOscillatorType(type);
  }

  async setFilterCutoff(frequency: number): Promise<void> {
    await this.initialize();

    this.synth?.setFilterCutoff(frequency);
  }

  async setFilterResonance(resonance: number): Promise<void> {
    await this.initialize();

    this.synth?.setFilterResonance(resonance);
  }

  async setEnvelope(envelope: EnvelopeSettings): Promise<void> {
    await this.initialize();

    this.synth?.setEnvelope(envelope);
  }

  dispose(): void {
    this.noteRequestId += 1;
    this.synth?.dispose();
    this.synth = null;
  }
}

export const audioController = new AudioController();