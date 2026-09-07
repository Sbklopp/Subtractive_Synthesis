import type {
  BassDrumSettings,
} from '../../domain/DrumMachine';

interface BassDrumControlsProps {
  settings: BassDrumSettings;

  onChange: (
    settings: Partial<BassDrumSettings>,
  ) => void;
}

export const BassDrumControls = ({
  settings,
  onChange,
}: BassDrumControlsProps) => {
  return (
    <fieldset className="bass-drum-controls">
      <legend>Bass Drum</legend>

      <div>
        <label htmlFor="bass-drum-tune">
          Tune: {settings.tune} Hz
        </label>

        <input
          id="bass-drum-tune"
          type="range"
          min="35"
          max="80"
          step="1"
          value={settings.tune}
          onChange={(event) =>
            onChange({
              tune: Number(event.target.value),
            })
          }
        />
      </div>

      <div>
        <label htmlFor="bass-drum-pitch-drop">
          Pitch drop: {settings.pitchDrop.toFixed(1)}
          {' octaves'}
        </label>

        <input
          id="bass-drum-pitch-drop"
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
      </div>

      <div>
        <label htmlFor="bass-drum-decay">
          Decay: {settings.decay.toFixed(2)} s
        </label>

        <input
          id="bass-drum-decay"
          type="range"
          min="0.1"
          max="2"
          step="0.01"
          value={settings.decay}
          onChange={(event) =>
            onChange({
              decay: Number(event.target.value),
            })
          }
        />
      </div>

      <div>
        <label htmlFor="bass-drum-tone">
          Tone: {settings.tone} Hz
        </label>

        <input
          id="bass-drum-tone"
          type="range"
          min="100"
          max="8000"
          step="10"
          value={settings.tone}
          onChange={(event) =>
            onChange({
              tone: Number(event.target.value),
            })
          }
        />
      </div>

      <div>
        <label htmlFor="bass-drum-level">
          Level: {Math.round(settings.level * 100)}%
        </label>

        <input
          id="bass-drum-level"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={settings.level}
          onChange={(event) =>
            onChange({
              level: Number(event.target.value),
            })
          }
        />
      </div>
    </fieldset>
  );
};