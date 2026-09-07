import {
  SYNTH_PRESETS,
  type SynthPreset,
} from '../../domain/SynthPresets';
import './PresetControls.css';

interface PresetControlsProps {
  selectedPresetId: string;
  onPresetSelect: (preset: SynthPreset) => void;
  onReset: () => void;
}

export const PresetControls = ({
  selectedPresetId,
  onPresetSelect,
  onReset,
}: PresetControlsProps) => {
  const handleChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const preset = SYNTH_PRESETS.find(
      (currentPreset) =>
        currentPreset.id === event.target.value,
    );

    if (preset) {
      onPresetSelect(preset);
    }
  };

  return (
    <div className="preset-controls">
      <div className="preset-controls__select">
        <label htmlFor="synth-preset">
          Preset
        </label>

        <select
          id="synth-preset"
          value={selectedPresetId}
          onChange={handleChange}
        >
          {selectedPresetId === 'custom' && (
            <option value="custom" disabled>
              Custom
            </option>
          )}

          {SYNTH_PRESETS.map((preset) => (
            <option
              key={preset.id}
              value={preset.id}
            >
              {preset.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        className="preset-controls__reset"
        onClick={onReset}
      >
        Reset
      </button>
    </div>
  );
};