import type {
  HiHatSettings,
} from '../../domain/DrumMachine';

interface HiHatControlsProps {
  idPrefix: string;
  name: string;
  settings: HiHatSettings;
  maxDecay: number;
  onChange: (
    settings: Partial<HiHatSettings>,
  ) => void;
}

export function HiHatControls({
  idPrefix,
  name,
  settings,
  maxDecay,
  onChange,
}: HiHatControlsProps) {
  return (
    <fieldset className="drum-voice-controls">
      <legend>{name} controls</legend>

      <label htmlFor={`${idPrefix}-tone`}>
        <span>Tone</span>
        <output>
          {Math.round(settings.tone)} Hz
        </output>
      </label>

      <input
        id={`${idPrefix}-tone`}
        type="range"
        min="3000"
        max="14000"
        step="50"
        value={settings.tone}
        onChange={(event) =>
          onChange({
            tone: Number(event.target.value),
          })
        }
      />

      <label htmlFor={`${idPrefix}-decay`}>
        <span>Decay</span>
        <output>
          {settings.decay.toFixed(2)} s
        </output>
      </label>

      <input
        id={`${idPrefix}-decay`}
        type="range"
        min="0.02"
        max={maxDecay}
        step="0.01"
        value={settings.decay}
        onChange={(event) =>
          onChange({
            decay: Number(event.target.value),
          })
        }
      />

      <label htmlFor={`${idPrefix}-metallic`}>
        <span>Metallic</span>
        <output>
          {Math.round(settings.metallic * 100)}%
        </output>
      </label>

      <input
        id={`${idPrefix}-metallic`}
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={settings.metallic}
        onChange={(event) =>
          onChange({
            metallic: Number(event.target.value),
          })
        }
      />

      <label htmlFor={`${idPrefix}-level`}>
        <span>Level</span>
        <output>
          {Math.round(settings.level * 100)}%
        </output>
      </label>

      <input
        id={`${idPrefix}-level`}
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