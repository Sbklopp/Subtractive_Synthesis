import { useState } from 'react';
import { audioController } from '../../audio/AudioController';

export const SynthPanel = () => {
  const [status, setStatus] = useState('Audio has not started');

  const handlePlayNote = async () => {
    try {
      await audioController.playNote('C2');
      setStatus('Audio is ready');
    } catch {
      setStatus('Unable to start audio');
    }
  };

  return (
    <section>
      <h2>Subtractive Synth</h2>

      <p>{status}</p>

      <button type="button" onClick={handlePlayNote}>
        Play C2
      </button>
    </section>
  );
};