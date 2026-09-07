import type { ClapSettings } from '../../domain/DrumMachine';

interface ClapControlsProps {
  settings: ClapSettings;
  onChange: (
    settings: Partial<ClapSettings>,
  ) => void;
}

export function ClapControls({
  settings,
  onChange,
}: ClapControlsProps) {
  return (
    <fieldset className="drum-voice-controls">
      <legend>Clap controls</legend>

      <label htmlFor="clap-tone">
        <span>Tone</span>
        <output>{Math.round(settings.tone)} Hz</output>
      </label>

      <input
        id="clap-tone"
        type="range"
        min="500"
        max="6000"
        step="10"
        value={settings.tone}
        onChange={(event) =>
          onChange({
            tone: Number(event.target.value),
          })
        }
      />

      <label htmlFor="clap-spread">
        <span>Spread</span>
        <output>
          {Math.round(settings.spread * 1000)} ms
        </output>
      </label>

      <input
        id="clap-spread"
        type="range"
        min="0.006"
        max="0.04"
        step="0.001"
        value={settings.spread}
        onChange={(event) =>
          onChange({
            spread: Number(event.target.value),
          })
        }
      />

      <label htmlFor="clap-decay">
        <span>Decay</span>
        <output>{settings.decay.toFixed(2)} s</output>
      </label>

      <input
        id="clap-decay"
        type="range"
        min="0.08"
        max="0.9"
        step="0.01"
        value={settings.decay}
        onChange={(event) =>
          onChange({
            decay: Number(event.target.value),
          })
        }
      />

      <label htmlFor="clap-level">
        <span>Level</span>
        <output>
          {Math.round(settings.level * 100)}%
        </output>
      </label>

      <input
        id="clap-level"
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