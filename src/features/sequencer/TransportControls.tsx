import {
  MAX_DRUM_BPM,
  MAX_DRUM_SWING,
  MIN_DRUM_BPM,
  MIN_DRUM_SWING,
} from '../../domain/DrumMachine';

interface TransportControlsProps {
  bpm: number;
  swing: number;
  isPlaying: boolean;
  onBpmChange: (bpm: number) => void;
  onSwingChange: (swing: number) => void;
  onPlay: () => void;
  onStop: () => void;
  onClear: () => void;
}

export function TransportControls({
  bpm,
  swing,
  isPlaying,
  onBpmChange,
  onSwingChange,
  onPlay,
  onStop,
  onClear,
}: TransportControlsProps) {
  const handleBpmChange = (
    nextBpm: number,
  ) => {
    const normalizedBpm = Math.min(
      Math.max(nextBpm, MIN_DRUM_BPM),
      MAX_DRUM_BPM,
    );

    onBpmChange(normalizedBpm);
  };

  const handleSwingChange = (
    percentage: number,
  ) => {
    const normalizedSwing = Math.min(
      Math.max(
        percentage / 100,
        MIN_DRUM_SWING,
      ),
      MAX_DRUM_SWING,
    );

    onSwingChange(normalizedSwing);
  };

  const swingPercentage =
    Math.round(swing * 100);

  return (
    <div className="transport-controls">
      <div className="transport-buttons">
        <button
          type="button"
          className="transport-primary-button"
          disabled={isPlaying}
          onClick={onPlay}
        >
          Play
        </button>

        <button
          type="button"
          disabled={!isPlaying}
          onClick={onStop}
        >
          Stop
        </button>

        <button
          type="button"
          onClick={onClear}
        >
          Clear
        </button>
      </div>

      <div className="tempo-control">
        <label htmlFor="drum-bpm">
          Tempo
        </label>

        <input
          id="drum-bpm"
          type="range"
          min={MIN_DRUM_BPM}
          max={MAX_DRUM_BPM}
          step="1"
          value={bpm}
          onChange={(event) =>
            handleBpmChange(
              Number(event.target.value),
            )
          }
        />

        <input
          className="tempo-number"
          type="number"
          aria-label="Tempo in beats per minute"
          min={MIN_DRUM_BPM}
          max={MAX_DRUM_BPM}
          step="1"
          value={bpm}
          onChange={(event) =>
            handleBpmChange(
              Number(event.target.value),
            )
          }
        />

        <span>BPM</span>
      </div>

      <div className="swing-control">
        <label htmlFor="drum-swing">
          Swing
        </label>

        <input
          id="drum-swing"
          type="range"
          min={MIN_DRUM_SWING * 100}
          max={MAX_DRUM_SWING * 100}
          step="1"
          value={swingPercentage}
          onChange={(event) =>
            handleSwingChange(
              Number(event.target.value),
            )
          }
        />

        <output htmlFor="drum-swing">
          {swingPercentage}%
        </output>
      </div>
    </div>
  );
}