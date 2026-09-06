import { useEffect } from 'react';
import './SynthKeyboard.css';

interface PianoKey {
  note: string;
  label: string;
  keyboardKey: string;
  color: 'white' | 'black';
}

interface SynthKeyboardProps {
  activeNote: string | null;
  onNoteStart: (note: string) => void;
  onNoteRelease: () => void;
}

const PIANO_KEYS: PianoKey[] = [
  { note: 'C2', label: 'C2', keyboardKey: 'a', color: 'white' },
  { note: 'C#2', label: 'C♯2', keyboardKey: 'w', color: 'black' },
  { note: 'D2', label: 'D2', keyboardKey: 's', color: 'white' },
  { note: 'D#2', label: 'D♯2', keyboardKey: 'e', color: 'black' },
  { note: 'E2', label: 'E2', keyboardKey: 'd', color: 'white' },
  { note: 'F2', label: 'F2', keyboardKey: 'f', color: 'white' },
  { note: 'F#2', label: 'F♯2', keyboardKey: 't', color: 'black' },
  { note: 'G2', label: 'G2', keyboardKey: 'g', color: 'white' },
  { note: 'G#2', label: 'G♯2', keyboardKey: 'y', color: 'black' },
  { note: 'A2', label: 'A2', keyboardKey: 'h', color: 'white' },
  { note: 'A#2', label: 'A♯2', keyboardKey: 'u', color: 'black' },
  { note: 'B2', label: 'B2', keyboardKey: 'j', color: 'white' },
  { note: 'C3', label: 'C3', keyboardKey: 'k', color: 'white' },
];

const getNoteForKeyboardKey = (keyboardKey: string) => {
  return PIANO_KEYS.find(
    (pianoKey) => pianoKey.keyboardKey === keyboardKey.toLowerCase(),
  )?.note;
};

export const SynthKeyboard = ({
  activeNote,
  onNoteStart,
  onNoteRelease,
}: SynthKeyboardProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const note = getNoteForKeyboardKey(event.key);

      if (!note || event.repeat || activeNote) {
        return;
      }

      event.preventDefault();
      onNoteStart(note);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const note = getNoteForKeyboardKey(event.key);

      if (!note || note !== activeNote) {
        return;
      }

      event.preventDefault();
      onNoteRelease();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeNote, onNoteStart, onNoteRelease]);

  return (
    <section>
      <h3>Keyboard</h3>

      <p>Computer keys: A W S E D F T G Y H U J K</p>

      <div className="keyboard-container">
        <div className="synth-keyboard">
          {PIANO_KEYS.map((pianoKey) => {
            const isActive = activeNote === pianoKey.note;

            return (
              <button
                key={pianoKey.note}
                type="button"
                className={[
                  'piano-key',
                  `piano-key--${pianoKey.color}`,
                  isActive ? 'piano-key--active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onPointerDown={(event) => {
                  if (activeNote) {
                    return;
                  }

                  event.currentTarget.setPointerCapture(event.pointerId);
                  onNoteStart(pianoKey.note);
                }}
                onPointerUp={onNoteRelease}
                onPointerCancel={onNoteRelease}
                aria-label={`Play ${pianoKey.label}`}
              >
                <span>{pianoKey.label}</span>
                <small>{pianoKey.keyboardKey.toUpperCase()}</small>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};