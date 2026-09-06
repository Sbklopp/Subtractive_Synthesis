import * as Tone from 'tone';

export class SubtractiveSynth {
  private synth: Tone.MonoSynth;

  constructor() {
    this.synth = new Tone.MonoSynth({
      volume: -8,

      oscillator: {
        type: 'sawtooth',
      },

      filter: {
        type: 'lowpass',
        frequency: 1200,
        rolloff: -24,
        Q: 2,
      },

      envelope: {
        attack: 0.02,
        decay: 0.2,
        sustain: 0.5,
        release: 1,
      },

      filterEnvelope: {
        attack: 0.01,
        decay: 0.3,
        sustain: 0.2,
        release: 0.8,
        baseFrequency: 200,
        octaves: 4,
      },
    }).toDestination();
  }

  playNote(note: string): void {
    this.synth.triggerAttackRelease(note, '8n');
  }

  dispose(): void {
    this.synth.dispose();
  }
}