import type {
  CymbalSettings,
} from '../../domain/DrumMachine';

interface CymbalControlsProps {
  settings: CymbalSettings;
  onChange: (
    settings: Partial<CymbalSettings>,
  ) => void;
}

export function CymbalControls({
  settings,
  onChange,
}: CymbalControlsProps) {
  return (
    <fieldset className="drum-voice-controls">
      <legend>Cymbal controls</legend>

      <label htmlFor="cymbal-tone">
        <span>Tone</span>
        <output>
          {Math.round(settings.tone)} Hz
        </output>
      </label>

      <input
        id="cymbal-tone"
        type="range"
        min="2500"
        max="12000"
        step="50"
        value={settings.tone}
        onChange={(event) =>
          onChange({
            tone: Number(event.target.value),
          })
        }
      />

      <label htmlFor="cymbal-decay">
        <span>Decay</span>
        <output>
          {settings.decay.toFixed(2)} s
        </output>
      </label>

      <input
        id="cymbal-decay"
        type="range"
        min="0.2"
        max="4"
        step="0.05"
        value={settings.decay}
        onChange={(event) =>
          onChange({
            decay: Number(event.target.value),
          })
        }
      />

      <label htmlFor="cymbal-wash">
        <span>Wash</span>
        <output>
          {Math.round(settings.wash * 100)}%
        </output>
      </label>

      <input
        id="cymbal-wash"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={settings.wash}
        onChange={(event) =>
          onChange({
            wash: Number(event.target.value),
          })
        }
      />

      <label htmlFor="cymbal-level">
        <span>Level</span>
        <output>
          {Math.round(settings.level * 100)}%
        </output>
      </label>

      <input
        id="cymbal-level"
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
    </fieldset>
  );
}