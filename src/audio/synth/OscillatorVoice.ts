import * as Tone from 'tone';
import type {
  OscillatorSettings,
  OscillatorType,
} from '../../domain/Synth';

export class OscillatorVoice {
  private basicOscillator: Tone.Oscillator;
  private pulseOscillator: Tone.PulseOscillator;
  private basicWaveformGain: Tone.Gain;
  private pulseWaveformGain: Tone.Gain;
  private outputGain: Tone.Gain;
  private baseDetune: number;

  constructor(settings: OscillatorSettings) {
    const usesPulseOscillator = settings.type === 'square';

    this.baseDetune = settings.detune;

    this.basicOscillator = new Tone.Oscillator({
      frequency: 'C2',
      type:
        settings.type === 'square'
          ? 'sine'
          : settings.type,
    });

    this.pulseOscillator = new Tone.PulseOscillator({
      frequency: 'C2',
      width: 0,
    });

    this.basicWaveformGain = new Tone.Gain(
      usesPulseOscillator ? 0 : 1,
    );

    this.pulseWaveformGain = new Tone.Gain(
      usesPulseOscillator ? 1 : 0,
    );

    this.outputGain = new Tone.Gain(settings.level);

    this.basicOscillator.connect(this.basicWaveformGain);
    this.pulseOscillator.connect(this.pulseWaveformGain);

    this.basicWaveformGain.connect(this.outputGain);
    this.pulseWaveformGain.connect(this.outputGain);

    this.basicOscillator.detune.value = settings.detune;
    this.pulseOscillator.detune.value = settings.detune;

    this.basicOscillator.start();
    this.pulseOscillator.start();
  }

  connect(destination: Tone.Filter): void {
    this.outputGain.connect(destination);
  }

  connectPitchModulation(modulation: Tone.Gain): void {
    modulation.connect(this.basicOscillator.detune);
    modulation.connect(this.pulseOscillator.detune);

    this.basicOscillator.detune.value = this.baseDetune;
    this.pulseOscillator.detune.value = this.baseDetune;
  }

  connectPulseWidthModulation(
    modulation: Tone.Gain,
  ): void {
    modulation.connect(this.pulseOscillator.width);
  }

  setFrequency(frequency: number, time: number): void {
    this.basicOscillator.frequency.setValueAtTime(
      frequency,
      time,
    );

    this.pulseOscillator.frequency.setValueAtTime(
      frequency,
      time,
    );
  }

  setType(type: OscillatorType): void {
    const usesPulseOscillator = type === 'square';

    if (!usesPulseOscillator) {
      this.basicOscillator.type = type;
    }

    this.basicWaveformGain.gain.rampTo(
      usesPulseOscillator ? 0 : 1,
      0.01,
    );

    this.pulseWaveformGain.gain.rampTo(
      usesPulseOscillator ? 1 : 0,
      0.01,
    );
  }

  setLevel(level: number): void {
    this.outputGain.gain.rampTo(level, 0.05);
  }

  setDetune(detune: number): void {
    this.baseDetune = detune;

    this.basicOscillator.detune.rampTo(detune, 0.05);
    this.pulseOscillator.detune.rampTo(detune, 0.05);
  }

  dispose(): void {
    this.basicOscillator.stop();
    this.pulseOscillator.stop();

    this.basicOscillator.dispose();
    this.pulseOscillator.dispose();
    this.basicWaveformGain.dispose();
    this.pulseWaveformGain.dispose();
    this.outputGain.dispose();
  }
}