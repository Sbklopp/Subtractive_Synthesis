import type {
  SnareSettings,
} from '../../domain/DrumMachine';

interface SnareControlsProps {
  settings: SnareSettings;

  onChange: (
    settings: Partial<SnareSettings>,
  ) => void;
}

export const SnareControls = ({
  settings,
  onChange,
}: SnareControlsProps) => {
  return (
    <fieldset className="drum-voice-controls">
      <legend>Snare Drum</legend>

      <div>
        <label htmlFor="snare-tune">
          Tune: {settings.tune} Hz
        </label>

        <input
          id="snare-tune"
          type="range"
          min="120"
          max="260"
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
        <label htmlFor="snare-noise">
          Noise:{' '}
          {Math.round(settings.noiseAmount * 100)}%
        </label>

        <input
          id="snare-noise"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={settings.noiseAmount}
          onChange={(event) =>
            onChange({
              noiseAmount: Number(
                event.target.value,
              ),
            })
          }
        />
      </div>

      <div>
        <label htmlFor="snare-tone">
          Tone: {settings.tone} Hz
        </label>

        <input
          id="snare-tone"
          type="range"
          min="20"
          max="10000"
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
        <label htmlFor="snare-decay">
          Decay: {settings.decay.toFixed(2)} s
        </label>

        <input
          id="snare-decay"
          type="range"
          min="0.05"
          max="1.5"
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
        <label htmlFor="snare-level">
          Level: {Math.round(settings.level * 100)}%
        </label>

        <input
          id="snare-level"
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