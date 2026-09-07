import type {
  OscillatorId,
  OscillatorOctave,
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

  onDetuneChange: (
    oscillatorId: OscillatorId,
    detune: number,
  ) => void;

  onOctaveChange: (
    oscillatorId: OscillatorId,
    octave: OscillatorOctave,
  ) => void;
}

const formatOctave = (
  octave: OscillatorOctave,
): string => {
  if (octave > 0) {
    return `+${octave}`;
  }

  return String(octave);
};

export const OscillatorControls = ({
  oscillatorId,
  settings,
  onTypeChange,
  onDetuneChange,
  onOctaveChange,
}: OscillatorControlsProps) => {
  const idPrefix =
    `oscillator-${oscillatorId.toLowerCase()}`;

  return (
    <fieldset className="oscillator-controls">
      <legend>Oscillator {oscillatorId}</legend>

      <div>
        <label htmlFor={`${idPrefix}-type`}>
          Waveform
        </label>

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
        <label htmlFor={`${idPrefix}-octave`}>
          Octave: {formatOctave(settings.octave)}
        </label>

        <input
          id={`${idPrefix}-octave`}
          type="range"
          min="-2"
          max="2"
          step="1"
          value={settings.octave}
          aria-valuetext={formatOctave(
            settings.octave,
          )}
          onChange={(event) =>
            onOctaveChange(
              oscillatorId,
              Number(
                event.target.value,
              ) as OscillatorOctave,
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
          min="-100"
          max="100"
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