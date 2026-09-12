import * as Tone from 'tone';
import {
  DEFAULT_MASTER_SETTINGS,
} from '../domain/Audio';
import {
  clampSequenceLength,
  cloneDrumMuteState,
  cloneDrumPattern,
  createEmptyDrumPattern,
  createUnmutedDrumVoices,
  DEFAULT_DRUM_BPM,
  DEFAULT_DRUM_SWING,
  DEFAULT_SEQUENCE_LENGTH,
} from '../domain/DrumMachine';
import type {
  BassDrumSettings,
  ClapSettings,
  CymbalSettings,
  DrumMuteState,
  DrumPattern,
  HiHatSettings,
  SnareSettings,
} from '../domain/DrumMachine';
import type {
  EnvelopeSettings,
  FilterEnvelopeSettings,
  LfoSettings,
  OscillatorId,
  OscillatorOctave,
  OscillatorType,
  SynthPatch,
} from '../domain/Synth';
import { DrumMachine } from './drums/DrumMachine';
import { DrumSequencer } from './drums/DrumSequencer';
import { MasterBus } from './MasterBus';
import { SubtractiveSynth } from './synth/SubtractiveSynth';

class AudioController {
  private synth: SubtractiveSynth | null =
    null;

  private drumMachine: DrumMachine | null =
    null;

  private drumSequencer:
    | DrumSequencer
    | null = null;

  private masterBus: MasterBus | null =
    null;

  private initializationPromise:
    | Promise<void>
    | null = null;

  private noteRequestId = 0;

  private masterVolume =
    DEFAULT_MASTER_SETTINGS.volume;

  private masterMuted =
    DEFAULT_MASTER_SETTINGS.muted;

  private drumPattern: DrumPattern =
    createEmptyDrumPattern();

  private mutedDrumVoices: DrumMuteState =
    createUnmutedDrumVoices();

  private drumBpm = DEFAULT_DRUM_BPM;
  private drumSwing = DEFAULT_DRUM_SWING;

  private drumSequenceLength =
    DEFAULT_SEQUENCE_LENGTH;

  async initialize(): Promise<void> {
    if (
      this.synth &&
      this.drumMachine &&
      this.drumSequencer &&
      this.masterBus
    ) {
      return;
    }

    if (!this.initializationPromise) {
      this.initializationPromise =
        (async () => {
          await Tone.start();

          if (!this.masterBus) {
            this.masterBus = new MasterBus({
              volume: this.masterVolume,
              muted: this.masterMuted,
            });
          }

          if (!this.synth) {
            this.synth =
              new SubtractiveSynth(
                this.masterBus.input,
              );
          }

          if (!this.drumMachine) {
            this.drumMachine =
              new DrumMachine(
                this.masterBus.input,
              );
          }

          if (
            !this.drumSequencer &&
            this.drumMachine
          ) {
            this.drumSequencer =
              new DrumSequencer(
                this.drumMachine,
              );

            this.drumSequencer.setPattern(
              this.drumPattern,
            );

            this.drumSequencer.setMutedVoices(
              this.mutedDrumVoices,
            );

            this.drumSequencer.setBpm(
              this.drumBpm,
            );

            this.drumSequencer.setSwing(
              this.drumSwing,
            );

            this.drumSequencer.setSequenceLength(
              this.drumSequenceLength,
            );
          }
        })();
    }

    try {
      await this.initializationPromise;
    } finally {
      this.initializationPromise = null;
    }
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

    this.synth?.setOscillatorType(
      oscillatorId,
      type,
    );
  }

  async setOscillatorLevel(
    oscillatorId: OscillatorId,
    level: number,
  ): Promise<void> {
    await this.initialize();

    this.synth?.setOscillatorLevel(
      oscillatorId,
      level,
    );
  }

  async setOscillatorDetune(
    oscillatorId: OscillatorId,
    detune: number,
  ): Promise<void> {
    await this.initialize();

    this.synth?.setOscillatorDetune(
      oscillatorId,
      detune,
    );
  }

  async setOscillatorOctave(
    oscillatorId: OscillatorId,
    octave: OscillatorOctave,
  ): Promise<void> {
    await this.initialize();

    this.synth?.setOscillatorOctave(
      oscillatorId,
      octave,
    );
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

  async triggerBassDrum(
    velocity = 1,
  ): Promise<void> {
    await this.initialize();

    this.drumMachine?.triggerBassDrum(
      velocity,
    );
  }

  async triggerSnare(
    velocity = 1,
  ): Promise<void> {
    await this.initialize();

    this.drumMachine?.triggerSnare(velocity);
  }

  async triggerClap(
    velocity = 1,
  ): Promise<void> {
    await this.initialize();

    this.drumMachine?.triggerClap(velocity);
  }

  async triggerClosedHiHat(
    velocity = 1,
  ): Promise<void> {
    await this.initialize();

    this.drumMachine?.triggerClosedHiHat(
      velocity,
    );
  }

  async triggerOpenHiHat(
    velocity = 1,
  ): Promise<void> {
    await this.initialize();

    this.drumMachine?.triggerOpenHiHat(
      velocity,
    );
  }

  async triggerCymbal(
    velocity = 1,
  ): Promise<void> {
    await this.initialize();

    this.drumMachine?.triggerCymbal(velocity);
  }

  async setBassDrumSettings(
    settings: BassDrumSettings,
  ): Promise<void> {
    await this.initialize();

    this.drumMachine?.setBassDrumSettings(
      settings,
    );
  }

  async setSnareSettings(
    settings: SnareSettings,
  ): Promise<void> {
    await this.initialize();

    this.drumMachine?.setSnareSettings(
      settings,
    );
  }

  async setClapSettings(
    settings: ClapSettings,
  ): Promise<void> {
    await this.initialize();

    this.drumMachine?.setClapSettings(
      settings,
    );
  }

  async setClosedHiHatSettings(
    settings: HiHatSettings,
  ): Promise<void> {
    await this.initialize();

    this.drumMachine?.setClosedHiHatSettings(
      settings,
    );
  }

  async setOpenHiHatSettings(
    settings: HiHatSettings,
  ): Promise<void> {
    await this.initialize();

    this.drumMachine?.setOpenHiHatSettings(
      settings,
    );
  }

  async setCymbalSettings(
    settings: CymbalSettings,
  ): Promise<void> {
    await this.initialize();

    this.drumMachine?.setCymbalSettings(
      settings,
    );
  }

  async setDrumPattern(
    pattern: DrumPattern,
  ): Promise<void> {
    this.drumPattern =
      cloneDrumPattern(pattern);

    await this.initialize();

    this.drumSequencer?.setPattern(
      this.drumPattern,
    );
  }

  async setMutedDrumVoices(
    mutedVoices: DrumMuteState,
  ): Promise<void> {
    this.mutedDrumVoices =
      cloneDrumMuteState(mutedVoices);

    await this.initialize();

    this.drumSequencer?.setMutedVoices(
      this.mutedDrumVoices,
    );
  }

  async setDrumBpm(
    bpm: number,
  ): Promise<void> {
    this.drumBpm = bpm;

    await this.initialize();

    this.drumSequencer?.setBpm(bpm);
  }

  async setDrumSwing(
    swing: number,
  ): Promise<void> {
    this.drumSwing = swing;

    await this.initialize();

    this.drumSequencer?.setSwing(swing);
  }

  setDrumSequenceLength(
    length: number,
  ): void {
    this.drumSequenceLength =
      clampSequenceLength(length);

    this.drumSequencer?.setSequenceLength(
      this.drumSequenceLength,
    );
  }

  getDrumSequenceLength(): number {
    return this.drumSequenceLength;
  }

  async startDrumSequencer(
    onStepChange: (
      stepIndex: number,
    ) => void,
  ): Promise<void> {
    await this.initialize();

    this.drumSequencer?.start(
      onStepChange,
    );
  }

  stopDrumSequencer(): void {
    this.drumSequencer?.stop();
  }

  async setMasterVolume(
    volume: number,
  ): Promise<void> {
    this.masterVolume = volume;

    await this.initialize();

    this.masterBus?.setVolume(volume);
  }

  async setMasterMuted(
    muted: boolean,
  ): Promise<void> {
    this.masterMuted = muted;

    await this.initialize();

    this.masterBus?.setMuted(muted);
  }

  async applyPatch(
    patch: SynthPatch,
  ): Promise<void> {
    await this.initialize();

    const synth = this.synth;

    if (!synth) {
      return;
    }

    synth.setOscillatorType(
      'A',
      patch.oscillators.A.type,
    );

    synth.setOscillatorLevel(
      'A',
      patch.oscillators.A.level,
    );

    synth.setOscillatorDetune(
      'A',
      patch.oscillators.A.detune,
    );

    synth.setOscillatorOctave(
      'A',
      patch.oscillators.A.octave,
    );

    synth.setOscillatorType(
      'B',
      patch.oscillators.B.type,
    );

    synth.setOscillatorLevel(
      'B',
      patch.oscillators.B.level,
    );

    synth.setOscillatorDetune(
      'B',
      patch.oscillators.B.detune,
    );

    synth.setOscillatorOctave(
      'B',
      patch.oscillators.B.octave,
    );

    synth.setFilterCutoff(
      patch.filter.cutoff,
    );

    synth.setFilterResonance(
      patch.filter.resonance,
    );

    synth.setFilterEnvelope(
      patch.filter.envelope,
    );

    synth.setEnvelope(
      patch.amplitudeEnvelope,
    );

    synth.setLfoSettings(patch.lfo);
  }

  getWaveformData():
    | Float32Array
    | null {
    return (
      this.masterBus?.getWaveformData() ??
      null
    );
  }

  dispose(): void {
    this.noteRequestId += 1;

    this.drumSequencer?.dispose();
    this.synth?.dispose();
    this.drumMachine?.dispose();
    this.masterBus?.dispose();

    this.drumSequencer = null;
    this.synth = null;
    this.drumMachine = null;
    this.masterBus = null;
    this.initializationPromise = null;
  }
}

export const audioController =
  new AudioController();