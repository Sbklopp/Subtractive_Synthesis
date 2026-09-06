import * as Tone from 'tone';
import {
  DEFAULT_ENVELOPE,
  DEFAULT_FILTER_ENVELOPE,
  DEFAULT_OSCILLATORS,
  type EnvelopeSettings,
  type FilterEnvelopeSettings,
  type OscillatorId,
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
      type: DEFAULT_OSCILLATORS.A.type,
    });

    this.oscillatorB = new Tone.Oscillator({
      frequency: 'C2',
      type: DEFAULT_OSCILLATORS.B.type,
    });

    this.oscillatorA.detune.value =
      DEFAULT_OSCILLATORS.A.detune;

    this.oscillatorB.detune.value =
      DEFAULT_OSCILLATORS.B.detune;

    this.oscillatorAGain = new Tone.Gain(
      DEFAULT_OSCILLATORS.A.level,
    );

    this.oscillatorBGain = new Tone.Gain(
      DEFAULT_OSCILLATORS.B.level,
    );

    this.filter = new Tone.Filter({
      type: 'lowpass',
      frequency: 200,
      rolloff: -24,
      Q: 2,
    });

    this.filterEnvelope = new Tone.FrequencyEnvelope({
      ...DEFAULT_FILTER_ENVELOPE,
      baseFrequency: 200,
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

  private getOscillator(
    oscillatorId: OscillatorId,
  ): Tone.Oscillator {
    return oscillatorId === 'A'
      ? this.oscillatorA
      : this.oscillatorB;
  }

  private getOscillatorGain(
    oscillatorId: OscillatorId,
  ): Tone.Gain {
    return oscillatorId === 'A'
      ? this.oscillatorAGain
      : this.oscillatorBGain;
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

  setOscillatorType(
    oscillatorId: OscillatorId,
    type: OscillatorType,
  ): void {
    const oscillator = this.getOscillator(oscillatorId);

    oscillator.type = type;
  }

  setOscillatorLevel(
    oscillatorId: OscillatorId,
    level: number,
  ): void {
    const oscillatorGain =
      this.getOscillatorGain(oscillatorId);

    oscillatorGain.gain.rampTo(level, 0.05);
  }

  setOscillatorDetune(
    oscillatorId: OscillatorId,
    detune: number,
  ): void {
    const oscillator = this.getOscillator(oscillatorId);

    oscillator.detune.rampTo(detune, 0.05);
  }

  setFilterCutoff(frequency: number): void {
    this.filterEnvelope.baseFrequency = frequency;
  }

  setFilterResonance(resonance: number): void {
    this.filter.Q.rampTo(resonance, 0.05);
  }

  setFilterEnvelope(
    envelope: FilterEnvelopeSettings,
  ): void {
    this.filterEnvelope.set({
      attack: envelope.attack,
      decay: envelope.decay,
      sustain: envelope.sustain,
      release: envelope.release,
    });

    this.filterEnvelope.octaves = envelope.octaves;
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