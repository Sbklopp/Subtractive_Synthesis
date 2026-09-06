import type {
  OscillatorId,
  OscillatorSettings,
} from '../../domain/Synth';

interface MixerControlsProps {
  oscillators: Record<
    OscillatorId,
    OscillatorSettings
  >;
  onLevelChange: (
    oscillatorId: OscillatorId,
    level: number,
  ) => void;
}

export const MixerControls = ({
  oscillators,
  onLevelChange,
}: MixerControlsProps) => {
  return (
    <fieldset className="mixer-controls">
      <legend>Levels</legend>

      <div>
        <label htmlFor="mixer-oscillator-a">
          Oscillator A:{' '}
          {Math.round(oscillators.A.level * 100)}%
        </label>

        <input
          id="mixer-oscillator-a"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={oscillators.A.level}
          onChange={(event) =>
            onLevelChange(
              'A',
              Number(event.target.value),
            )
          }
        />
      </div>

      <div>
        <label htmlFor="mixer-oscillator-b">
          Oscillator B:{' '}
          {Math.round(oscillators.B.level * 100)}%
        </label>

        <input
          id="mixer-oscillator-b"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={oscillators.B.level}
          onChange={(event) =>
            onLevelChange(
              'B',
              Number(event.target.value),
            )
          }
        />
      </div>

      <small>
        Noise and external input channels can be added here
        later.
      </small>
    </fieldset>
  );
};