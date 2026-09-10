import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  DRUM_VOICE_IDS,
  SEQUENCER_PAGE_COUNT,
  SEQUENCER_PAGE_SIZE,
} from '../../domain/DrumMachine';
import type {
  DrumMuteState,
  DrumPattern,
  DrumStepState,
  DrumVoiceId,
} from '../../domain/DrumMachine';
import './Sequencer.css';

interface SequencerGridProps {
  pattern: DrumPattern;
  mutedVoices: DrumMuteState;
  currentStep: number;
  isPlaying: boolean;
  onCycleStep: (
    voiceId: DrumVoiceId,
    stepIndex: number,
  ) => void;
  onToggleMute: (
    voiceId: DrumVoiceId,
  ) => void;
}

const VOICE_LABELS: Record<
  DrumVoiceId,
  string
> = {
  bassDrum: 'Bass',
  snare: 'Snare',
  clap: 'Clap',
  closedHiHat: 'Closed',
  openHiHat: 'Open',
  cymbal: 'Cymbal',
};

function getStepSymbol(
  state: DrumStepState,
): string {
  switch (state) {
    case 'normal':
      return '●';

    case 'accent':
      return '◆';

    case 'off':
      return '';
  }
}

export function SequencerGrid({
  pattern,
  mutedVoices,
  currentStep,
  isPlaying,
  onCycleStep,
  onToggleMute,
}: SequencerGridProps) {
  const [selectedPage, setSelectedPage] =
    useState(0);

  const pageIndexes = useMemo(
    () =>
      Array.from(
        { length: SEQUENCER_PAGE_COUNT },
        (_, index) => index,
      ),
    [],
  );

  const visibleStepIndexes = useMemo(() => {
    const firstStep =
      selectedPage * SEQUENCER_PAGE_SIZE;

    return Array.from(
      { length: SEQUENCER_PAGE_SIZE },
      (_, index) => firstStep + index,
    );
  }, [selectedPage]);

  useEffect(() => {
    if (!isPlaying || currentStep < 0) {
      return;
    }

    const activePage = Math.floor(
      currentStep / SEQUENCER_PAGE_SIZE,
    );

    if (
      activePage >= 0 &&
      activePage < SEQUENCER_PAGE_COUNT
    ) {
      setSelectedPage(activePage);
    }
  }, [currentStep, isPlaying]);

  return (
    <div className="sequencer-editor">
      <div className="sequencer-editor__toolbar">
        <div
          className="sequencer-pages"
          role="group"
          aria-label="Sequencer page"
        >
          {pageIndexes.map((pageIndex) => {
            const firstStep =
              pageIndex *
                SEQUENCER_PAGE_SIZE +
              1;

            const lastStep =
              firstStep +
              SEQUENCER_PAGE_SIZE -
              1;

            const isSelected =
              selectedPage === pageIndex;

            return (
              <button
                key={pageIndex}
                type="button"
                className={[
                  'sequencer-page-button',
                  isSelected
                    ? 'sequencer-page-button--selected'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-pressed={isSelected}
                onClick={() =>
                  setSelectedPage(pageIndex)
                }
              >
                {firstStep}–{lastStep}
              </button>
            );
          })}
        </div>

        <div className="sequencer-legend">
          <span>
            <span className="sequencer-legend__normal">
              ●
            </span>{' '}
            Normal
          </span>

          <span>
            <span className="sequencer-legend__accent">
              ◆
            </span>{' '}
            Accent
          </span>
        </div>
      </div>

      <div className="sequencer-grid-scroll">
        <div className="sequencer-grid">
          <div className="sequencer-row sequencer-row--header">
            <span>Voice</span>
            <span>Mute</span>

            {visibleStepIndexes.map(
              (stepIndex) => (
                <span
                  key={stepIndex}
                  className={[
                    'sequencer-step-number',
                    stepIndex % 4 === 0
                      ? 'sequencer-step-number--beat'
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {stepIndex + 1}
                </span>
              ),
            )}
          </div>

          {DRUM_VOICE_IDS.map((voiceId) => {
            const isMuted =
              mutedVoices[voiceId];

            return (
              <div
                key={voiceId}
                className={[
                  'sequencer-row',
                  isMuted
                    ? 'sequencer-row--muted'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="sequencer-voice-name">
                  {VOICE_LABELS[voiceId]}
                </span>

                <button
                  type="button"
                  className={[
                    'sequencer-mute-button',
                    isMuted
                      ? 'sequencer-mute-button--active'
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-pressed={isMuted}
                  aria-label={`Mute ${VOICE_LABELS[voiceId]}`}
                  onClick={() =>
                    onToggleMute(voiceId)
                  }
                >
                  M
                </button>

                {visibleStepIndexes.map(
                  (stepIndex) => {
                    const state =
                      pattern[voiceId][
                        stepIndex
                      ] ?? 'off';

                    const isCurrentStep =
                      isPlaying &&
                      currentStep ===
                        stepIndex;

                    const isBeat =
                      stepIndex % 4 === 0;

                    return (
                      <button
                        key={stepIndex}
                        type="button"
                        className={[
                          'sequencer-step',
                          `sequencer-step--${state}`,
                          isBeat
                            ? 'sequencer-step--beat'
                            : '',
                          isCurrentStep
                            ? 'sequencer-step--current'
                            : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        aria-label={`${VOICE_LABELS[voiceId]}, step ${
                          stepIndex + 1
                        }, ${state}`}
                        title={`Step ${
                          stepIndex + 1
                        }: ${state}`}
                        onClick={() =>
                          onCycleStep(
                            voiceId,
                            stepIndex,
                          )
                        }
                      >
                        {getStepSymbol(state)}
                      </button>
                    );
                  },
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}