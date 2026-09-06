import * as Tone from 'tone';
import type {
  EnvelopeSettings,
  FilterEnvelopeSettings,
  LfoSettings,
  OscillatorId,
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

  async setOscillatorType(
    oscillatorId: OscillatorId,
    type: OscillatorType,
  ): Promise<void> {
    await this.initialize();

    this.synth?.setOscillatorType(oscillatorId, type);
  }

  async setOscillatorLevel(
    oscillatorId: OscillatorId,
    level: number,
  ): Promise<void> {
    await this.initialize();

    this.synth?.setOscillatorLevel(oscillatorId, level);
  }

  async setOscillatorDetune(
    oscillatorId: OscillatorId,
    detune: number,
  ): Promise<void> {
    await this.initialize();

    this.synth?.setOscillatorDetune(oscillatorId, detune);
  }

  async setFilterCutoff(
    frequency: number,
  ): Promise<void> {
    await this.initialize();

    this.synth?.setFilterCutoff(frequency);
  }

  async setFilterResonance(
    resonance: number,
  ): Promise<void> {
    await this.initialize();

    this.synth?.setFilterResonance(resonance);
  }

  async setFilterEnvelope(
    envelope: FilterEnvelopeSettings,
  ): Promise<void> {
    await this.initialize();

    this.synth?.setFilterEnvelope(envelope);
  }

  async setEnvelope(
    envelope: EnvelopeSettings,
  ): Promise<void> {
    await this.initialize();

    this.synth?.setEnvelope(envelope);
  }

  async setLfoSettings(
    settings: LfoSettings,
  ): Promise<void> {
    await this.initialize();

    this.synth?.setLfoSettings(settings);
  }

  getWaveformData(): Float32Array | null {
    return this.synth?.getWaveformData() ?? null;
  }

  dispose(): void {
    this.noteRequestId += 1;
    this.synth?.dispose();
    this.synth = null;
  }
}

export const audioController = new AudioController();