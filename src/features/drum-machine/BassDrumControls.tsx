import {
  BASS_DRUM_OSCILLATOR_TYPES,
} from '../../domain/DrumMachine';
import type {
  BassDrumOscillatorType,
  BassDrumSettings,
} from '../../domain/DrumMachine';

interface BassDrumControlsProps {
  settings: BassDrumSettings;

  onChange: (
    settings: Partial<BassDrumSettings>,
  ) => void;
}

export function BassDrumControls({
  settings,
  onChange,
}: BassDrumControlsProps) {
  return (
    <fieldset className="drum-voice-controls">
      <legend>Bass drum controls</legend>

      <label htmlFor="bass-oscillator">
        <span>Wave</span>
      </label>

      <select
        id="bass-oscillator"
        className="drum-voice-select"
        value={
          settings.oscillatorType ??
          'triangle'
        }
        onChange={(event) =>
          onChange({
            oscillatorType:
              event.target
                .value as BassDrumOscillatorType,
          })
        }
      >
        {BASS_DRUM_OSCILLATOR_TYPES.map(
          (oscillatorType) => (
            <option
              key={oscillatorType}
              value={oscillatorType}
            >
              {oscillatorType === 'sine'
                ? 'Sine'
                : 'Triangle'}
            </option>
          ),
        )}
      </select>

      <label htmlFor="bass-tune">
        <span>Tune</span>

        <output>
          {Math.round(settings.tune)} Hz
        </output>
      </label>

      <input
        id="bass-tune"
        type="range"
        min="30"
        max="120"
        step="1"
        value={settings.tune}
        onChange={(event) =>
          onChange({
            tune: Number(event.target.value),
          })
        }
      />

      <label htmlFor="bass-pitch-drop">
        <span>Pitch Drop</span>

        <output>
          {settings.pitchDrop.toFixed(1)}
        </output>
      </label>

      <input
        id="bass-pitch-drop"
        type="range"
        min="0.5"
        max="8"
        step="0.1"
        value={settings.pitchDrop}
        onChange={(event) =>
          onChange({
            pitchDrop: Number(
              event.target.value,
            ),
          })
        }
      />

      <label htmlFor="bass-decay">
        <span>Decay</span>

        <output>
          {settings.decay.toFixed(2)} s
        </output>
      </label>

      <input
        id="bass-decay"
        type="range"
        min="0.05"
        max="4"
        step="0.01"
        value={settings.decay}
        onChange={(event) =>
          onChange({
            decay: Number(
              event.target.value,
            ),
          })
        }
      />

      <label htmlFor="bass-tone">
        <span>Tone</span>

        <output>
          {Math.round(settings.tone)} Hz
        </output>
      </label>

      <input
        id="bass-tone"
        type="range"
        min="100"
        max="8000"
        step="10"
        value={settings.tone}
        onChange={(event) =>
          onChange({
            tone: Number(
              event.target.value,
            ),
          })
        }
      />

      <label htmlFor="bass-level">
        <span>Level</span>

        <output>
          {Math.round(settings.level * 100)}%
        </output>
      </label>

      <input
        id="bass-level"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={settings.level}
        onChange={(event) =>
          onChange({
            level: Number(
              event.target.value,
            ),
          })
        }
      />
    </fieldset>
  );
}