import {
  MAX_DRUM_BPM,
  MIN_DRUM_BPM,
} from '../../domain/DrumMachine';

interface TransportControlsProps {
  bpm: number;
  isPlaying: boolean;
  onBpmChange: (bpm: number) => void;
  onPlay: () => void;
  onStop: () => void;
  onClear: () => void;
}

export function TransportControls({
  bpm,
  isPlaying,
  onBpmChange,
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
    </div>
  );
}