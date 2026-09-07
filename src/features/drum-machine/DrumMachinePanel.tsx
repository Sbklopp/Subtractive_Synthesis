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
  SnareSettings,
} from '../../domain/DrumMachine';
import { useDrumMachineStore } from '../../store/useDrumMachineStore';
import { BassDrumControls } from './BassDrumControls';
import { ClapControls } from './ClapControls';
import { SnareControls } from './SnareControls';
import './DrumMachinePanel.css';

type DrumVoiceId =
  | 'bassDrum'
  | 'snare'
  | 'clap';

const KEYBOARD_MAP: Record<string, DrumVoiceId> = {
  KeyA: 'bassDrum',
  KeyS: 'snare',
  KeyD: 'clap',
};

const VOICE_LABELS: Record<DrumVoiceId, string> = {
  bassDrum: 'Bass drum',
  snare: 'Snare',
  clap: 'Clap',
};

function isEditableTarget(target: EventTarget | null): boolean {
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
    updateBassDrum,
    updateSnare,
    updateClap,
  } = useDrumMachineStore();

  const [status, setStatus] = useState(
    'Bass drum, snare, and clap ready.',
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
    const nextSettings = {
      ...bassDrum,
      ...changes,
    };

    updateBassDrum(changes);
    audioController.setBassDrumSettings(nextSettings);
  };

  const handleSnareChange = (
    changes: Partial<SnareSettings>,
  ) => {
    const nextSettings = {
      ...snare,
      ...changes,
    };

    updateSnare(changes);
    audioController.setSnareSettings(nextSettings);
  };

  const handleClapChange = (
    changes: Partial<ClapSettings>,
  ) => {
    const nextSettings = {
      ...clap,
      ...changes,
    };

    updateClap(changes);
    audioController.setClapSettings(nextSettings);
  };

  const triggerVoice = useCallback(
    async (voice: DrumVoiceId) => {
      try {
        await audioController.initialize();

        switch (voice) {
          case 'bassDrum':
            audioController.setBassDrumSettings(bassDrum);
            await audioController.triggerBassDrum();
            break;

          case 'snare':
            audioController.setSnareSettings(snare);
            await audioController.triggerSnare();
            break;

          case 'clap':
            audioController.setClapSettings(clap);
            await audioController.triggerClap();
            break;
        }

        setStatus(`${VOICE_LABELS[voice]} triggered.`);
      } catch (error) {
        console.error(error);
        setStatus('Unable to start audio.');
      }
    },
    [bassDrum, snare, clap],
  );

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
    const handleKeyDown = (event: KeyboardEvent) => {
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

    const handleKeyUp = (event: KeyboardEvent) => {
      const voice = KEYBOARD_MAP[event.code];

      if (!voice) {
        return;
      }

      setVoiceActive(voice, false);
    };

    const handleWindowBlur = () => {
      setActiveVoices(new Set());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleWindowBlur);

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

          <p className="drum-machine-description">
            Each drum is generated by its own
            adjustable synthesis voice.
          </p>
        </div>

        <div
          className="drum-keyboard-help"
          aria-label="Drum keyboard controls"
        >
          <span>
            <kbd>A</kbd> Bass
          </span>

          <span>
            <kbd>S</kbd> Snare
          </span>

          <span>
            <kbd>D</kbd> Clap
          </span>
        </div>
      </header>

      <div className="drum-workspace">
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
              <h3>Snare Drum</h3>
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
              <h3>Hand Clap</h3>
              <span>CP</span>
            </header>

            <ClapControls
              settings={clap}
              onChange={handleClapChange}
            />

            {renderPad('clap', 'CP', 'D')}
          </article>
        </div>

        <aside className="upcoming-drums">
          <div>
            <p className="section-eyebrow">
              Coming next
            </p>
            <h3>Additional voices</h3>
          </div>

          <div className="upcoming-drum-grid">
            <div className="upcoming-drum">
              Closed Hi-Hat
            </div>

            <div className="upcoming-drum">
              Open Hi-Hat
            </div>

            <div className="upcoming-drum">
              Tom
            </div>
          </div>
        </aside>
      </div>

      <p className="drum-status" role="status">
        {status}
      </p>
    </section>
  );
}