import * as Tone from 'tone';
import {
  DEFAULT_ENVELOPE,
  DEFAULT_FILTER_ENVELOPE,
  DEFAULT_LFO,
  DEFAULT_OSCILLATORS,
  type EnvelopeSettings,
  type FilterEnvelopeSettings,
  type LfoSettings,
  type OscillatorId,
  type OscillatorOctave,
  type OscillatorType,
} from '../../domain/Synth';
import { OscillatorVoice } from './OscillatorVoice';

export class SubtractiveSynth {
  private oscillatorA: OscillatorVoice;
  private oscillatorB: OscillatorVoice;
  private filter: Tone.Filter;
  private filterEnvelope: Tone.FrequencyEnvelope;
  private amplitudeEnvelope: Tone.AmplitudeEnvelope;
  private lfo: Tone.LFO;
  private pitchLfoGain: Tone.Gain;
  private filterLfoGain: Tone.Gain;
  private pulseWidthLfoGain: Tone.Gain;

  constructor(output: Tone.Gain) {
    this.oscillatorA = new OscillatorVoice(
      DEFAULT_OSCILLATORS.A,
    );

    this.oscillatorB = new OscillatorVoice(
      DEFAULT_OSCILLATORS.B,
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

    this.amplitudeEnvelope =
      new Tone.AmplitudeEnvelope({
        ...DEFAULT_ENVELOPE,
      });

    this.lfo = new Tone.LFO({
      frequency: DEFAULT_LFO.rate,
      min: -1,
      max: 1,
      type: DEFAULT_LFO.type,
    });

    this.pitchLfoGain = new Tone.Gain(0);
    this.filterLfoGain = new Tone.Gain(0);
    this.pulseWidthLfoGain = new Tone.Gain(0);

    this.oscillatorA.connect(this.filter);
    this.oscillatorB.connect(this.filter);

    this.filter.connect(this.amplitudeEnvelope);
    this.amplitudeEnvelope.connect(output);

    this.filterEnvelope.connect(
      this.filter.frequency,
    );

    this.lfo.connect(this.pitchLfoGain);
    this.lfo.connect(this.filterLfoGain);
    this.lfo.connect(this.pulseWidthLfoGain);

    this.oscillatorA.connectPitchModulation(
      this.pitchLfoGain,
    );

    this.oscillatorB.connectPitchModulation(
      this.pitchLfoGain,
    );

    this.filterLfoGain.connect(
      this.filter.frequency,
    );

    this.oscillatorA.connectPulseWidthModulation(
      this.pulseWidthLfoGain,
    );

    this.oscillatorB.connectPulseWidthModulation(
      this.pulseWidthLfoGain,
    );

    this.lfo.start();
    this.setLfoSettings(DEFAULT_LFO);
  }

  private getOscillator(
    oscillatorId: OscillatorId,
  ): OscillatorVoice {
    return oscillatorId === 'A'
      ? this.oscillatorA
      : this.oscillatorB;
  }

  startNote(note: string): void {
    const frequency = Tone.Frequency(note).toFrequency();
    const now = Tone.now();

    this.oscillatorA.setFrequency(frequency, now);
    this.oscillatorB.setFrequency(frequency, now);

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
    this.getOscillator(oscillatorId).setType(type);
  }

  setOscillatorLevel(
    oscillatorId: OscillatorId,
    level: number,
  ): void {
    this.getOscillator(oscillatorId).setLevel(level);
  }

  setOscillatorDetune(
    oscillatorId: OscillatorId,
    detune: number,
  ): void {
    this.getOscillator(oscillatorId).setDetune(
      detune,
    );
  }

  setOscillatorOctave(
    oscillatorId: OscillatorId,
    octave: OscillatorOctave,
  ): void {
    this.getOscillator(oscillatorId).setOctave(
      octave,
    );
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

  setLfoSettings(settings: LfoSettings): void {
    this.lfo.type = settings.type;

    this.lfo.frequency.rampTo(
      settings.rate,
      0.05,
    );

    this.pitchLfoGain.gain.rampTo(
      settings.pitch.enabled
        ? settings.pitch.depth
        : 0,
      0.05,
    );

    this.filterLfoGain.gain.rampTo(
      settings.filter.enabled
        ? settings.filter.depth
        : 0,
      0.05,
    );

    this.pulseWidthLfoGain.gain.rampTo(
      settings.pulseWidth.enabled
        ? settings.pulseWidth.depth
        : 0,
      0.05,
    );
  }

  dispose(): void {
    this.lfo.stop();

    this.oscillatorA.dispose();
    this.oscillatorB.dispose();
    this.filter.dispose();
    this.filterEnvelope.dispose();
    this.amplitudeEnvelope.dispose();
    this.lfo.dispose();
    this.pitchLfoGain.dispose();
    this.filterLfoGain.dispose();
    this.pulseWidthLfoGain.dispose();
  }
}