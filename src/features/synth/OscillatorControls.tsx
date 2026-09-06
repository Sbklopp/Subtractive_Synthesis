import type {
  OscillatorId,
  OscillatorSettings,
  OscillatorType,
} from '../../domain/Synth';

interface OscillatorControlsProps {
  oscillatorId: OscillatorId;
  settings: OscillatorSettings;
  onTypeChange: (
    oscillatorId: OscillatorId,
    type: OscillatorType,
  ) => void;
  onLevelChange: (
    oscillatorId: OscillatorId,
    level: number,
  ) => void;
  onDetuneChange: (
    oscillatorId: OscillatorId,
    detune: number,
  ) => void;
}

export const OscillatorControls = ({
  oscillatorId,
  settings,
  onTypeChange,
  onLevelChange,
  onDetuneChange,
}: OscillatorControlsProps) => {
  const idPrefix = `oscillator-${oscillatorId.toLowerCase()}`;

  return (
    <fieldset>
      <legend>Oscillator {oscillatorId}</legend>

      <div>
        <label htmlFor={`${idPrefix}-type`}>Waveform</label>

        <select
          id={`${idPrefix}-type`}
          value={settings.type}
          onChange={(event) =>
            onTypeChange(
              oscillatorId,
              event.target.value as OscillatorType,
            )
          }
        >
          <option value="sine">Sine</option>
          <option value="triangle">Triangle</option>
          <option value="square">Square</option>
          <option value="sawtooth">Sawtooth</option>
        </select>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-level`}>
          Level: {Math.round(settings.level * 100)}%
        </label>

        <input
          id={`${idPrefix}-level`}
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={settings.level}
          onChange={(event) =>
            onLevelChange(
              oscillatorId,
              Number(event.target.value),
            )
          }
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-detune`}>
          Detune: {settings.detune} cents
        </label>

        <input
          id={`${idPrefix}-detune`}
          type="range"
          min="-50"
          max="50"
          step="1"
          value={settings.detune}
          onChange={(event) =>
            onDetuneChange(
              oscillatorId,
              Number(event.target.value),
            )
          }
        />
      </div>
    </fieldset>
  );
};