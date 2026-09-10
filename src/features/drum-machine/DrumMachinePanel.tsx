import {
  useCallback,
  useEffect,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { audioController } from '../../audio/AudioController';
import type {
  BassDrumSettings,
  ClapSettings,
  CymbalSettings,
  DrumVoiceId,
  HiHatSettings,
  SnareSettings,
} from '../../domain/DrumMachine';
import { useDrumMachineStore } from '../../store/useDrumMachineStore';
import { SequencerGrid } from '../sequencer/SequencerGrid';
import { TransportControls } from '../sequencer/TransportControls';
import { BassDrumControls } from './BassDrumControls';
import { ClapControls } from './ClapControls';
import { CymbalControls } from './CymbalControls';
import { HiHatControls } from './HiHatControls';
import { SnareControls } from './SnareControls';
import './DrumMachinePanel.css';

const KEYBOARD_MAP: Record<string, DrumVoiceId> = {
  KeyA: 'bassDrum',
  KeyS: 'snare',
  KeyD: 'clap',
  KeyF: 'closedHiHat',
  KeyG: 'openHiHat',
  KeyH: 'cymbal',
};

const VOICE_LABELS: Record<DrumVoiceId, string> = {
  bassDrum: 'Bass drum',
  snare: 'Snare',
  clap: 'Clap',
  closedHiHat: 'Closed hi-hat',
  openHiHat: 'Open hi-hat',
  cymbal: 'Cymbal',
};

function isEditableTarget(
  target: EventTarget | null,
): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.isContentEditable ||
    target.tagName === 'INPUT' ||
    target.tagName === 'SELECT' ||
    target.tagName === 'TEXTAREA'
  );
}

export function DrumMachinePanel() {
  const {
    bassDrum,
    snare,
    clap,
    closedHiHat,
    openHiHat,
    cymbal,
    pattern,
    mutedVoices,
    bpm,
    swing,
    isPlaying,
    currentStep,
    updateBassDrum,
    updateSnare,
    updateClap,
    updateClosedHiHat,
    updateOpenHiHat,
    updateCymbal,
    cycleStep,
    toggleVoiceMute,
    clearPattern,
    setBpm,
    setSwing,
    setIsPlaying,
    setCurrentStep,
  } = useDrumMachineStore();

  const [status, setStatus] = useState(
    'All drum voices ready.',
  );

  const [activeVoices, setActiveVoices] = useState<
    Set<DrumVoiceId>
  >(() => new Set());

  const setVoiceActive = useCallback(
    (voice: DrumVoiceId, active: boolean) => {
      setActiveVoices((current) => {
        const next = new Set(current);

        if (active) {
          next.add(voice);
        } else {
          next.delete(voice);
        }

        return next;
      });
    },
    [],
  );

  const handleBassDrumChange = (
    changes: Partial<BassDrumSettings>,
  ) => {
    const next = { ...bassDrum, ...changes };

    updateBassDrum(changes);
    void audioController.setBassDrumSettings(next);
  };

  const handleSnareChange = (
    changes: Partial<SnareSettings>,
  ) => {
    const next = { ...snare, ...changes };

    updateSnare(changes);
    void audioController.setSnareSettings(next);
  };

  const handleClapChange = (
    changes: Partial<ClapSettings>,
  ) => {
    const next = { ...clap, ...changes };

    updateClap(changes);
    void audioController.setClapSettings(next);
  };

  const handleClosedHiHatChange = (
    changes: Partial<HiHatSettings>,
  ) => {
    const next = {
      ...closedHiHat,
      ...changes,
    };

    updateClosedHiHat(changes);

    void audioController.setClosedHiHatSettings(
      next,
    );
  };

  const handleOpenHiHatChange = (
    changes: Partial<HiHatSettings>,
  ) => {
    const next = {
      ...openHiHat,
      ...changes,
    };

    updateOpenHiHat(changes);

    void audioController.setOpenHiHatSettings(
      next,
    );
  };

  const handleCymbalChange = (
    changes: Partial<CymbalSettings>,
  ) => {
    const next = { ...cymbal, ...changes };

    updateCymbal(changes);
    void audioController.setCymbalSettings(next);
  };

  const triggerVoice = useCallback(
    async (voice: DrumVoiceId) => {
      try {
        switch (voice) {
          case 'bassDrum':
            await audioController.setBassDrumSettings(
              bassDrum,
            );
            await audioController.triggerBassDrum();
            break;

          case 'snare':
            await audioController.setSnareSettings(
              snare,
            );
            await audioController.triggerSnare();
            break;

          case 'clap':
            await audioController.setClapSettings(
              clap,
            );
            await audioController.triggerClap();
            break;

          case 'closedHiHat':
            await audioController.setClosedHiHatSettings(
              closedHiHat,
            );
            await audioController.triggerClosedHiHat();
            break;

          case 'openHiHat':
            await audioController.setOpenHiHatSettings(
              openHiHat,
            );
            await audioController.triggerOpenHiHat();
            break;

          case 'cymbal':
            await audioController.setCymbalSettings(
              cymbal,
            );
            await audioController.triggerCymbal();
            break;
        }

        setStatus(`${VOICE_LABELS[voice]} triggered.`);
      } catch (error) {
        console.error(error);
        setStatus('Unable to start audio.');
      }
    },
    [
      bassDrum,
      clap,
      closedHiHat,
      cymbal,
      openHiHat,
      snare,
    ],
  );

  const handleCycleStep = (
    voice: DrumVoiceId,
    step: number,
  ) => {
    cycleStep(voice, step);

    audioController.setDrumPattern(
      useDrumMachineStore.getState().pattern,
    );
  };

  const handleToggleMute = (
    voice: DrumVoiceId,
  ) => {
    toggleVoiceMute(voice);

    const nextMutedVoices =
      useDrumMachineStore.getState().mutedVoices;

    audioController.setMutedDrumVoices(
      nextMutedVoices,
    );

    setStatus(
      `${VOICE_LABELS[voice]} ${
        nextMutedVoices[voice]
          ? 'muted'
          : 'unmuted'
      }.`,
    );
  };

  const handleBpmChange = (
    nextBpm: number,
  ) => {
    setBpm(nextBpm);
    audioController.setDrumBpm(nextBpm);
  };

  const handleSwingChange = (
    nextSwing: number,
  ) => {
    setSwing(nextSwing);
    audioController.setDrumSwing(nextSwing);

    setStatus(
      `Swing set to ${Math.round(
        nextSwing * 100,
      )}%.`,
    );
  };

  const handlePlay = async () => {
    try {
      audioController.setDrumPattern(pattern);

      audioController.setMutedDrumVoices(
        mutedVoices,
      );

      audioController.setDrumBpm(bpm);
      audioController.setDrumSwing(swing);

      await audioController.startDrumSequencer(
        setCurrentStep,
      );

      setIsPlaying(true);
      setStatus(`Sequencer playing at ${bpm} BPM.`);
    } catch (error) {
      console.error(error);
      setIsPlaying(false);
      setCurrentStep(-1);
      setStatus('Unable to start the sequencer.');
    }
  };

  const handleStop = () => {
    audioController.stopDrumSequencer();
    setIsPlaying(false);
    setCurrentStep(-1);
    setStatus('Sequencer stopped.');
  };

  const handleClear = () => {
    clearPattern();

    audioController.setDrumPattern(
      useDrumMachineStore.getState().pattern,
    );

    setStatus('Pattern cleared.');
  };

  const handlePadKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    voice: DrumVoiceId,
  ) => {
    if (
      event.key !== 'Enter' &&
      event.key !== ' '
    ) {
      return;
    }

    event.preventDefault();

    if (event.repeat) {
      return;
    }

    setVoiceActive(voice, true);
    void triggerVoice(voice);
  };

  const handlePadKeyUp = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    voice: DrumVoiceId,
  ) => {
    if (
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      setVoiceActive(voice, false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      const voice = KEYBOARD_MAP[event.code];

      if (
        !voice ||
        event.repeat ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        isEditableTarget(event.target)
      ) {
        return;
      }

      event.preventDefault();
      setVoiceActive(voice, true);
      void triggerVoice(voice);
    };

    const handleKeyUp = (
      event: KeyboardEvent,
    ) => {
      const voice = KEYBOARD_MAP[event.code];

      if (voice) {
        setVoiceActive(voice, false);
      }
    };

    const handleWindowBlur = () => {
      setActiveVoices(new Set());
    };

    window.addEventListener(
      'keydown',
      handleKeyDown,
    );

    window.addEventListener(
      'keyup',
      handleKeyUp,
    );

    window.addEventListener(
      'blur',
      handleWindowBlur,
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown,
      );

      window.removeEventListener(
        'keyup',
        handleKeyUp,
      );

      window.removeEventListener(
        'blur',
        handleWindowBlur,
      );
    };
  }, [setVoiceActive, triggerVoice]);

  const renderPad = (
    voice: DrumVoiceId,
    abbreviation: string,
    shortcut: string,
  ) => (
    <button
      type="button"
      className={`drum-pad ${
        activeVoices.has(voice) ? 'is-active' : ''
      }`}
      aria-label={`Play ${VOICE_LABELS[voice]}`}
      aria-keyshortcuts={shortcut}
      onPointerDown={() => {
        setVoiceActive(voice, true);
        void triggerVoice(voice);
      }}
      onPointerUp={() =>
        setVoiceActive(voice, false)
      }
      onPointerCancel={() =>
        setVoiceActive(voice, false)
      }
      onPointerLeave={() =>
        setVoiceActive(voice, false)
      }
      onKeyDown={(event) =>
        handlePadKeyDown(event, voice)
      }
      onKeyUp={(event) =>
        handlePadKeyUp(event, voice)
      }
    >
      <span className="drum-pad-name">
        {abbreviation}
      </span>

      <kbd className="drum-pad-key">
        {shortcut}
      </kbd>
    </button>
  );

  return (
    <section
      className="drum-machine-panel"
      aria-labelledby="drum-machine-title"
    >
      <header className="drum-machine-header">
        <div>
          <p className="section-eyebrow">
            Rhythm section
          </p>

          <h2 id="drum-machine-title">
            Drum Machine
          </h2>
        </div>

        <div className="drum-keyboard-help">
          <span><kbd>A</kbd> Bass</span>
          <span><kbd>S</kbd> Snare</span>
          <span><kbd>D</kbd> Clap</span>
          <span><kbd>F</kbd> CH</span>
          <span><kbd>G</kbd> OH</span>
          <span><kbd>H</kbd> Cymbal</span>
        </div>
      </header>

      <div className="implemented-voices">
        <article className="drum-voice-editor">
          <header className="drum-voice-header">
            <h3>Bass Drum</h3>
            <span>BD</span>
          </header>

          <BassDrumControls
            settings={bassDrum}
            onChange={handleBassDrumChange}
          />

          {renderPad('bassDrum', 'BD', 'A')}
        </article>

        <article className="drum-voice-editor">
          <header className="drum-voice-header">
            <h3>Snare</h3>
            <span>SD</span>
          </header>

          <SnareControls
            settings={snare}
            onChange={handleSnareChange}
          />

          {renderPad('snare', 'SD', 'S')}
        </article>

        <article className="drum-voice-editor">
          <header className="drum-voice-header">
            <h3>Clap</h3>
            <span>CP</span>
          </header>

          <ClapControls
            settings={clap}
            onChange={handleClapChange}
          />

          {renderPad('clap', 'CP', 'D')}
        </article>

        <article className="drum-voice-editor">
          <header className="drum-voice-header">
            <h3>Closed Hat</h3>
            <span>CH</span>
          </header>

          <HiHatControls
            idPrefix="closed-hi-hat"
            name="Closed hi-hat"
            settings={closedHiHat}
            maxDecay={0.4}
            onChange={handleClosedHiHatChange}
          />

          {renderPad('closedHiHat', 'CH', 'F')}
        </article>

        <article className="drum-voice-editor">
          <header className="drum-voice-header">
            <h3>Open Hat</h3>
            <span>OH</span>
          </header>

          <HiHatControls
            idPrefix="open-hi-hat"
            name="Open hi-hat"
            settings={openHiHat}
            maxDecay={2.5}
            onChange={handleOpenHiHatChange}
          />

          {renderPad('openHiHat', 'OH', 'G')}
        </article>

        <article className="drum-voice-editor">
          <header className="drum-voice-header">
            <h3>Cymbal</h3>
            <span>CY</span>
          </header>

          <CymbalControls
            settings={cymbal}
            onChange={handleCymbalChange}
          />

          {renderPad('cymbal', 'CY', 'H')}
        </article>
      </div>

      <section
        className="drum-sequencer-section"
        aria-labelledby="sequencer-title"
      >
        <header className="sequencer-section-header">
          <div>
            <p className="section-eyebrow">
              Pattern
            </p>

            <h3 id="sequencer-title">
              16-Step Sequencer
            </h3>
          </div>

          <TransportControls
            bpm={bpm}
            swing={swing}
            isPlaying={isPlaying}
            onBpmChange={handleBpmChange}
            onSwingChange={handleSwingChange}
            onPlay={() => {
              void handlePlay();
            }}
            onStop={handleStop}
            onClear={handleClear}
          />
        </header>

        <SequencerGrid
          pattern={pattern}
          mutedVoices={mutedVoices}
          currentStep={currentStep}
          isPlaying={isPlaying}
          onCycleStep={handleCycleStep}
          onToggleMute={handleToggleMute}
        />
      </section>

      <p className="drum-status" role="status">
        {status}
      </p>
    </section>
  );
}