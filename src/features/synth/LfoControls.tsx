import type {
  LfoDestinationSettings,
  LfoSettings,
  OscillatorType,
} from '../../domain/Synth';

interface LfoControlsProps {
  settings: LfoSettings;
  onChange: (settings: LfoSettings) => void;
}

export const LfoControls = ({
  settings,
  onChange,
}: LfoControlsProps) => {
  const updateDestination = (
    destination: 'pitch' | 'filter' | 'pulseWidth',
    updates: Partial<LfoDestinationSettings>,
  ) => {
    onChange({
      ...settings,
      [destination]: {
        ...settings[destination],
        ...updates,
      },
    });
  };

  return (
    <fieldset>
      <legend>LFO</legend>

      <div>
        <label htmlFor="lfo-type">Waveform</label>

        <select
          id="lfo-type"
          value={settings.type}
          onChange={(event) =>
            onChange({
              ...settings,
              type: event.target.value as OscillatorType,
            })
          }
        >
          <option value="sine">Sine</option>
          <option value="triangle">Triangle</option>
          <option value="square">Square</option>
          <option value="sawtooth">Sawtooth</option>
        </select>
      </div>

      <div>
        <label htmlFor="lfo-rate">
          Rate: {settings.rate.toFixed(1)} Hz
        </label>

        <input
          id="lfo-rate"
          type="range"
          min="0.1"
          max="20"
          step="0.1"
          value={settings.rate}
          onChange={(event) =>
            onChange({
              ...settings,
              rate: Number(event.target.value),
            })
          }
        />
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={settings.pitch.enabled}
            onChange={(event) =>
              updateDestination('pitch', {
                enabled: event.target.checked,
              })
            }
          />

          Pitch modulation
        </label>

        <label htmlFor="lfo-pitch-depth">
          Depth: ±{settings.pitch.depth} cents
        </label>

        <input
          id="lfo-pitch-depth"
          type="range"
          min="0"
          max="100"
          step="1"
          value={settings.pitch.depth}
          disabled={!settings.pitch.enabled}
          onChange={(event) =>
            updateDestination('pitch', {
              depth: Number(event.target.value),
            })
          }
        />
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={settings.filter.enabled}
            onChange={(event) =>
              updateDestination('filter', {
                enabled: event.target.checked,
              })
            }
          />

          Filter modulation
        </label>

        <label htmlFor="lfo-filter-depth">
          Depth: ±{settings.filter.depth} Hz
        </label>

        <input
          id="lfo-filter-depth"
          type="range"
          min="0"
          max="5000"
          step="10"
          value={settings.filter.depth}
          disabled={!settings.filter.enabled}
          onChange={(event) =>
            updateDestination('filter', {
              depth: Number(event.target.value),
            })
          }
        />
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={settings.pulseWidth.enabled}
            onChange={(event) =>
              updateDestination('pulseWidth', {
                enabled: event.target.checked,
              })
            }
          />

          Square-wave duty-cycle modulation
        </label>

        <label htmlFor="lfo-pulse-width-depth">
          Depth: ±
          {Math.round(settings.pulseWidth.depth * 100)}%
        </label>

        <input
          id="lfo-pulse-width-depth"
          type="range"
          min="0"
          max="0.45"
          step="0.01"
          value={settings.pulseWidth.depth}
          disabled={!settings.pulseWidth.enabled}
          onChange={(event) =>
            updateDestination('pulseWidth', {
              depth: Number(event.target.value),
            })
          }
        />

        <small>
          This target only affects oscillators using the square
          waveform.
        </small>
      </div>
    </fieldset>
  );
};