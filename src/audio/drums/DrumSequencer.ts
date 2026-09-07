import * as Tone from 'tone';
import {
  DEFAULT_DRUM_BPM,
  DRUM_VOICE_IDS,
  MAX_DRUM_BPM,
  MIN_DRUM_BPM,
  SEQUENCER_STEP_COUNT,
  cloneDrumMuteState,
  cloneDrumPattern,
  createEmptyDrumPattern,
  createUnmutedDrumVoices,
  type DrumMuteState,
  type DrumPattern,
} from '../../domain/DrumMachine';
import type {
  DrumMachine,
} from './DrumMachine';

type StepChangeHandler = (
  step: number,
) => void;

export class DrumSequencer {
  private readonly drumMachine: DrumMachine;

  private pattern: DrumPattern =
    createEmptyDrumPattern();

  private mutedVoices: DrumMuteState =
    createUnmutedDrumVoices();

  private bpm = DEFAULT_DRUM_BPM;
  private currentStep = 0;
  private repeatEventId: number | null = null;
  private isPlaying = false;
  private runId = 0;

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
      Math.max(bpm, MIN_DRUM_BPM),
      MAX_DRUM_BPM,
    );

    const transport = Tone.getTransport();

    if (this.isPlaying) {
      transport.bpm.rampTo(this.bpm, 0.05);
    } else {
      transport.bpm.value = this.bpm;
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

    this.isPlaying = true;
    this.currentStep = 0;
    this.runId += 1;

    if (this.repeatEventId === null) {
      this.repeatEventId =
        transport.scheduleRepeat(
          (time) => {
            this.playStep(
              this.currentStep,
              time,
            );

            const displayedStep =
              this.currentStep;

            const scheduledRunId =
              this.runId;

            Tone.getDraw().schedule(() => {
              if (
                this.isPlaying &&
                scheduledRunId === this.runId
              ) {
                this.onStepChange?.(
                  displayedStep,
                );
              }
            }, time);

            this.currentStep =
              (this.currentStep + 1) %
              SEQUENCER_STEP_COUNT;
          },
          '16n',
        );
    }

    transport.bpm.value = this.bpm;
    transport.position = '0:0:0';
    transport.start();
  }

  stop(): void {
    const transport = Tone.getTransport();

    this.isPlaying = false;
    this.runId += 1;
    this.currentStep = 0;

    transport.stop();
    transport.position = '0:0:0';

    this.onStepChange?.(-1);
  }

  dispose(): void {
    this.stop();

    if (this.repeatEventId !== null) {
      Tone.getTransport().clear(
        this.repeatEventId,
      );

      this.repeatEventId = null;
    }

    this.onStepChange = null;
  }

  private playStep(
    step: number,
    time: number,
  ): void {
    DRUM_VOICE_IDS.forEach((voice) => {
      const shouldPlay =
        this.pattern[voice][step] &&
        !this.mutedVoices[voice];

      if (shouldPlay) {
        this.drumMachine.triggerVoice(
          voice,
          1,
          time,
        );
      }
    });
  }
}