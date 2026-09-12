import * as Tone from 'tone';
import {
  clampSequenceLength,
  cloneDrumMuteState,
  cloneDrumPattern,
  createEmptyDrumPattern,
  createUnmutedDrumVoices,
  DEFAULT_DRUM_BPM,
  DEFAULT_DRUM_SWING,
  DEFAULT_SEQUENCE_LENGTH,
  DRUM_STEP_VELOCITIES,
  DRUM_VOICE_IDS,
  MAX_DRUM_BPM,
  MAX_DRUM_SWING,
  MIN_DRUM_BPM,
  MIN_DRUM_SWING,
} from '../../domain/DrumMachine';
import type {
  DrumMuteState,
  DrumPattern,
} from '../../domain/DrumMachine';
import { DrumMachine } from './DrumMachine';

type StepChangeHandler = (
  stepIndex: number,
) => void;

export class DrumSequencer {
  private readonly drumMachine: DrumMachine;

  private pattern: DrumPattern =
    createEmptyDrumPattern();

  private mutedVoices: DrumMuteState =
    createUnmutedDrumVoices();

  private bpm = DEFAULT_DRUM_BPM;
  private swing = DEFAULT_DRUM_SWING;

  private sequenceLength =
    DEFAULT_SEQUENCE_LENGTH;

  private currentStep = 0;
  private scheduleId: number | null = null;
  private isPlaying = false;

  private onStepChange:
    | StepChangeHandler
    | null = null;

  constructor(drumMachine: DrumMachine) {
    this.drumMachine = drumMachine;
  }

  setPattern(pattern: DrumPattern): void {
    this.pattern = cloneDrumPattern(pattern);
  }

  setMutedVoices(
    mutedVoices: DrumMuteState,
  ): void {
    this.mutedVoices =
      cloneDrumMuteState(mutedVoices);
  }

  setBpm(bpm: number): void {
    this.bpm = Math.min(
      MAX_DRUM_BPM,
      Math.max(MIN_DRUM_BPM, bpm),
    );

    Tone.getTransport().bpm.value = this.bpm;
  }

  setSwing(swing: number): void {
    this.swing = Math.min(
      MAX_DRUM_SWING,
      Math.max(MIN_DRUM_SWING, swing),
    );

    const transport = Tone.getTransport();

    transport.swingSubdivision = '16n';
    transport.swing = this.swing;
  }

  setSequenceLength(length: number): void {
    this.sequenceLength =
      clampSequenceLength(length);

    if (
      this.currentStep >= this.sequenceLength
    ) {
      this.currentStep = 0;
    }
  }

  start(
    onStepChange: StepChangeHandler,
  ): void {
    this.onStepChange = onStepChange;

    if (this.isPlaying) {
      return;
    }

    const transport = Tone.getTransport();

    transport.bpm.value = this.bpm;
    transport.swingSubdivision = '16n';
    transport.swing = this.swing;
    transport.position = 0;

    this.currentStep = 0;

    if (this.scheduleId === null) {
      this.scheduleId =
        transport.scheduleRepeat((time) => {
          const stepIndex = this.currentStep;

          this.playStep(stepIndex, time);

          Tone.getDraw().schedule(() => {
            this.onStepChange?.(stepIndex);
          }, time);

          this.currentStep =
            (stepIndex + 1) %
            this.sequenceLength;
        }, '16n');
    }

    this.isPlaying = true;
    transport.start();
  }

  stop(): void {
    if (!this.isPlaying) {
      return;
    }

    const transport = Tone.getTransport();

    transport.stop();
    transport.position = 0;

    this.currentStep = 0;
    this.isPlaying = false;
  }

  private playStep(
    stepIndex: number,
    time: number,
  ): void {
    for (const voiceId of DRUM_VOICE_IDS) {
      if (this.mutedVoices[voiceId]) {
        continue;
      }

      const stepState =
        this.pattern[voiceId][stepIndex] ??
        'off';

      const velocity =
        DRUM_STEP_VELOCITIES[stepState];

      if (velocity === 0) {
        continue;
      }

      this.drumMachine.triggerVoice(
        voiceId,
        velocity,
        time,
      );
    }
  }

  dispose(): void {
    this.stop();

    if (this.scheduleId !== null) {
      Tone.getTransport().clear(
        this.scheduleId,
      );

      this.scheduleId = null;
    }

    this.onStepChange = null;
  }
}