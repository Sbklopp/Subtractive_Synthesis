import {
  DRUM_VOICE_IDS,
  SEQUENCER_STEP_COUNT,
  type DrumMuteState,
  type DrumPattern,
  type DrumVoiceId,
} from '../../domain/DrumMachine';
import './Sequencer.css';

interface SequencerGridProps {
  pattern: DrumPattern;
  mutedVoices: DrumMuteState;
  currentStep: number;
  isPlaying: boolean;

  onToggleStep: (
    voice: DrumVoiceId,
    step: number,
  ) => void;

  onToggleMute: (
    voice: DrumVoiceId,
  ) => void;
}

const VOICE_DETAILS: Record<
  DrumVoiceId,
  {
    abbreviation: string;
    label: string;
  }
> = {
  bassDrum: {
    abbreviation: 'BD',
    label: 'Bass drum',
  },
  snare: {
    abbreviation: 'SD',
    label: 'Snare',
  },
  clap: {
    abbreviation: 'CP',
    label: 'Clap',
  },
  closedHiHat: {
    abbreviation: 'CH',
    label: 'Closed hi-hat',
  },
  openHiHat: {
    abbreviation: 'OH',
    label: 'Open hi-hat',
  },
  cymbal: {
    abbreviation: 'CY',
    label: 'Cymbal',
  },
};

export function SequencerGrid({
  pattern,
  mutedVoices,
  currentStep,
  isPlaying,
  onToggleStep,
  onToggleMute,
}: SequencerGridProps) {
  const steps = Array.from(
    { length: SEQUENCER_STEP_COUNT },
    (_, index) => index,
  );

  return (
    <div className="sequencer-scroll">
      <div className="sequencer-grid">
        <div className="sequencer-header-row">
          <div className="sequencer-corner">
            Voice
          </div>

          {steps.map((step) => (
            <div
              className={`sequencer-step-number ${
                step % 4 === 0
                  ? 'is-beat-start'
                  : ''
              }`}
              key={step}
            >
              {step + 1}
            </div>
          ))}
        </div>

        {DRUM_VOICE_IDS.map((voice) => {
          const isMuted =
            mutedVoices[voice];

          return (
            <div
              className={`sequencer-row ${
                isMuted ? 'is-muted' : ''
              }`}
              key={voice}
            >
              <div className="sequencer-voice-label">
                <div
                  className="sequencer-voice-name"
                  title={
                    VOICE_DETAILS[voice].label
                  }
                >
                  <strong>
                    {
                      VOICE_DETAILS[voice]
                        .abbreviation
                    }
                  </strong>

                  <span>
                    {VOICE_DETAILS[voice].label}
                  </span>
                </div>

                <button
                  type="button"
                  className={`sequencer-mute-button ${
                    isMuted ? 'is-muted' : ''
                  }`}
                  aria-label={`${
                    isMuted ? 'Unmute' : 'Mute'
                  } ${
                    VOICE_DETAILS[voice].label
                  }`}
                  aria-pressed={isMuted}
                  title={`${
                    isMuted ? 'Unmute' : 'Mute'
                  } ${
                    VOICE_DETAILS[voice].label
                  }`}
                  onClick={() =>
                    onToggleMute(voice)
                  }
                >
                  M
                </button>
              </div>

              {pattern[voice].map(
                (isEnabled, step) => {
                  const classNames = [
                    'sequencer-step',
                    isEnabled
                      ? 'is-enabled'
                      : '',
                    isPlaying &&
                    currentStep === step
                      ? 'is-current'
                      : '',
                    step % 4 === 0
                      ? 'is-beat-start'
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <button
                      type="button"
                      className={classNames}
                      aria-label={`${
                        VOICE_DETAILS[voice]
                          .label
                      }, step ${step + 1}`}
                      aria-pressed={isEnabled}
                      key={`${voice}-${step}`}
                      onClick={() =>
                        onToggleStep(
                          voice,
                          step,
                        )
                      }
                    >
                      <span />
                    </button>
                  );
                },
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}