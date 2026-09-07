import { audioController } from '../../audio/AudioController';
import { useMasterStore } from '../../store/useMasterStore';
import './MasterControls.css';

export const MasterControls = () => {
  const volume = useMasterStore(
    (state) => state.volume,
  );

  const muted = useMasterStore(
    (state) => state.muted,
  );

  const setVolume = useMasterStore(
    (state) => state.setVolume,
  );

  const setMuted = useMasterStore(
    (state) => state.setMuted,
  );

  const handleVolumeChange = (
    nextVolume: number,
  ) => {
    setVolume(nextVolume);

    void audioController.setMasterVolume(
      nextVolume,
    );
  };

  const handleMuteToggle = () => {
    const nextMuted = !muted;

    setMuted(nextMuted);

    void audioController.setMasterMuted(
      nextMuted,
    );
  };

  return (
    <section className="master-controls">
      <div className="master-controls__level">
        <label htmlFor="master-volume">
          Master: {volume} dB
        </label>

        <input
          id="master-volume"
          type="range"
          min="-48"
          max="0"
          step="1"
          value={volume}
          onChange={(event) =>
            handleVolumeChange(
              Number(event.target.value),
            )
          }
        />
      </div>

      <button
        type="button"
        className={
          muted
            ? 'master-controls__mute master-controls__mute--active'
            : 'master-controls__mute'
        }
        aria-pressed={muted}
        onClick={handleMuteToggle}
      >
        {muted ? 'Unmute' : 'Mute'}
      </button>
    </section>
  );
};