import * as Tone from 'tone';
import {
  DEFAULT_ENVELOPE,
  type EnvelopeSettings,
  type OscillatorType,
} from '../../domain/Synth';

export class SubtractiveSynth {
  private oscillatorA: Tone.Oscillator;
  private oscillatorB: Tone.Oscillator;
  private oscillatorAGain: Tone.Gain;
  private oscillatorBGain: Tone.Gain;
  private filter: Tone.Filter;
  private filterEnvelope: Tone.FrequencyEnvelope;
  private amplitudeEnvelope: Tone.AmplitudeEnvelope;
  private masterOutput: Tone.Volume;

  constructor() {
    this.oscillatorA = new Tone.Oscillator({
      frequency: 'C2',
      type: 'sawtooth',
    });

    this.oscillatorB = new Tone.Oscillator({
      frequency: 'C2',
      type: 'square',
    });

    this.oscillatorB.detune.value = 7;

    this.oscillatorAGain = new Tone.Gain(0.65);
    this.oscillatorBGain = new Tone.Gain(0.25);

    this.filter = new Tone.Filter({
      type: 'lowpass',
      frequency: 200,
      rolloff: -24,
      Q: 2,
    });

    this.filterEnvelope = new Tone.FrequencyEnvelope({
      attack: 0.01,
      decay: 0.3,
      sustain: 0.2,
      release: 0.8,
      baseFrequency: 200,
      octaves: 4,
    });

    this.amplitudeEnvelope = new Tone.AmplitudeEnvelope({
      ...DEFAULT_ENVELOPE,
    });

    this.masterOutput = new Tone.Volume(-8).toDestination();

    this.oscillatorA.connect(this.oscillatorAGain);
    this.oscillatorB.connect(this.oscillatorBGain);

    this.oscillatorAGain.connect(this.filter);
    this.oscillatorBGain.connect(this.filter);

    this.filter.connect(this.amplitudeEnvelope);
    this.amplitudeEnvelope.connect(this.masterOutput);

    this.filterEnvelope.connect(this.filter.frequency);

    this.oscillatorA.start();
    this.oscillatorB.start();
  }

  startNote(note: string): void {
    const frequency = Tone.Frequency(note).toFrequency();
    const now = Tone.now();

    this.oscillatorA.frequency.setValueAtTime(frequency, now);
    this.oscillatorB.frequency.setValueAtTime(frequency, now);

    this.filterEnvelope.triggerAttack(now);
    this.amplitudeEnvelope.triggerAttack(now);
  }

  releaseNote(): void {
    const now = Tone.now();

    this.filterEnvelope.triggerRelease(now);
    this.amplitudeEnvelope.triggerRelease(now);
  }

  setOscillatorType(type: OscillatorType): void {
    this.oscillatorA.type = type;
  }

  setFilterCutoff(frequency: number): void {
    this.filterEnvelope.baseFrequency = frequency;
  }

  setFilterResonance(resonance: number): void {
    this.filter.Q.rampTo(resonance, 0.05);
  }

  setEnvelope(envelope: EnvelopeSettings): void {
    this.amplitudeEnvelope.set({
      attack: envelope.attack,
      decay: envelope.decay,
      sustain: envelope.sustain,
      release: envelope.release,
    });
  }

  dispose(): void {
    this.oscillatorA.stop();
    this.oscillatorB.stop();

    this.oscillatorA.dispose();
    this.oscillatorB.dispose();
    this.oscillatorAGain.dispose();
    this.oscillatorBGain.dispose();
    this.filter.dispose();
    this.filterEnvelope.dispose();
    this.amplitudeEnvelope.dispose();
    this.masterOutput.dispose();
  }
}