import { useState, type ChangeEvent } from 'react';
import { audioController } from '../../audio/AudioController';
import {
  DEFAULT_ENVELOPE,
  DEFAULT_FILTER_ENVELOPE,
  DEFAULT_OSCILLATORS,
  type EnvelopeSettings,
  type FilterEnvelopeSettings,
  type OscillatorId,
  type OscillatorSettings,
  type OscillatorType,
} from '../../domain/Synth';
import { OscillatorControls } from './OscillatorControls';
import { SynthKeyboard } from './SynthKeyboard';

const OSCILLATOR_IDS: OscillatorId[] = ['A', 'B'];

export const SynthPanel = () => {
  const [status, setStatus] = useState(
    'Audio has not started',
  );
  const [activeNote, setActiveNote] = useState<string | null>(
    null,
  );
  const [oscillators, setOscillators] =
    useState(DEFAULT_OSCILLATORS);
  const [filterCutoff, setFilterCutoff] = useState(200);
  const [filterResonance, setFilterResonance] = useState(2);
  const [filterEnvelope, setFilterEnvelope] =
    useState<FilterEnvelopeSettings>(
      DEFAULT_FILTER_ENVELOPE,
    );
  const [envelope, setEnvelope] =
    useState<EnvelopeSettings>(DEFAULT_ENVELOPE);

  const updateOscillatorSettings = (
    oscillatorId: OscillatorId,
    updates: Partial<OscillatorSettings>,
  ) => {
    setOscillators((currentOscillators) => ({
      ...currentOscillators,
      [oscillatorId]: {
        ...currentOscillators[oscillatorId],
        ...updates,
      },
    }));
  };

  const handleNoteStart = (note: string) => {
    setActiveNote(note);

    void audioController
      .startNote(note)
      .then(() => {
        setStatus('Audio is ready');
      })
      .catch(() => {
        setActiveNote(null);
        setStatus('Unable to start audio');
      });
  };

  const handleNoteRelease = () => {
    setActiveNote(null);
    audioController.releaseNote();
  };

  const handleOscillatorTypeChange = (
    oscillatorId: OscillatorId,
    type: OscillatorType,
  ) => {
    updateOscillatorSettings(oscillatorId, { type });

    void audioController.setOscillatorType(
      oscillatorId,
      type,
    );
  };

  const handleOscillatorLevelChange = (
    oscillatorId: OscillatorId,
    level: number,
  ) => {
    updateOscillatorSettings(oscillatorId, { level });

    void audioController.setOscillatorLevel(
      oscillatorId,
      level,
    );
  };

  const handleOscillatorDetuneChange = (
    oscillatorId: OscillatorId,
    detune: number,
  ) => {
    updateOscillatorSettings(oscillatorId, { detune });

    void audioController.setOscillatorDetune(
      oscillatorId,
      detune,
    );
  };

  const handleFilterCutoffChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const frequency = Number(event.target.value);

    setFilterCutoff(frequency);
    void audioController.setFilterCutoff(frequency);
  };

  const handleFilterResonanceChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const resonance = Number(event.target.value);

    setFilterResonance(resonance);
    void audioController.setFilterResonance(resonance);
  };

  const handleFilterEnvelopeChange = (
    parameter: keyof FilterEnvelopeSettings,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = Number(event.target.value);

    const nextFilterEnvelope = {
      ...filterEnvelope,
      [parameter]: value,
    };

    setFilterEnvelope(nextFilterEnvelope);

    void audioController.setFilterEnvelope(
      nextFilterEnvelope,
    );
  };

  const handleEnvelopeChange = (
    parameter: keyof EnvelopeSettings,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = Number(event.target.value);

    const nextEnvelope = {
      ...envelope,
      [parameter]: value,
    };

    setEnvelope(nextEnvelope);
    void audioController.setEnvelope(nextEnvelope);
  };

  return (
    <section>
      <h2>Subtractive Synth</h2>

      <p>{status}</p>

      {OSCILLATOR_IDS.map((oscillatorId) => (
        <OscillatorControls
          key={oscillatorId}
          oscillatorId={oscillatorId}
          settings={oscillators[oscillatorId]}
          onTypeChange={handleOscillatorTypeChange}
          onLevelChange={handleOscillatorLevelChange}
          onDetuneChange={handleOscillatorDetuneChange}
        />
      ))}

      <fieldset>
        <legend>Filter</legend>

        <div>
          <label htmlFor="filter-cutoff">
            Cutoff: {filterCutoff} Hz
          </label>

          <input
            id="filter-cutoff"
            type="range"
            min="50"
            max="5000"
            step="10"
            value={filterCutoff}
            onChange={handleFilterCutoffChange}
          />
        </div>

        <div>
          <label htmlFor="filter-resonance">
            Resonance: {filterResonance.toFixed(1)}
          </label>

          <input
            id="filter-resonance"
            type="range"
            min="0"
            max="20"
            step="0.1"
            value={filterResonance}
            onChange={handleFilterResonanceChange}
          />
        </div>
      </fieldset>

      <fieldset>
        <legend>Filter Envelope</legend>

        <div>
          <label htmlFor="filter-envelope-attack">
            Attack: {filterEnvelope.attack.toFixed(2)} seconds
          </label>

          <input
            id="filter-envelope-attack"
            type="range"
            min="0"
            max="2"
            step="0.01"
            value={filterEnvelope.attack}
            onChange={(event) =>
              handleFilterEnvelopeChange('attack', event)
            }
          />
        </div>

        <div>
          <label htmlFor="filter-envelope-decay">
            Decay: {filterEnvelope.decay.toFixed(2)} seconds
          </label>

          <input
            id="filter-envelope-decay"
            type="range"
            min="0"
            max="2"
            step="0.01"
            value={filterEnvelope.decay}
            onChange={(event) =>
              handleFilterEnvelopeChange('decay', event)
            }
          />
        </div>

        <div>
          <label htmlFor="filter-envelope-sustain">
            Sustain: {Math.round(filterEnvelope.sustain * 100)}%
          </label>

          <input
            id="filter-envelope-sustain"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={filterEnvelope.sustain}
            onChange={(event) =>
              handleFilterEnvelopeChange('sustain', event)
            }
          />
        </div>

        <div>
          <label htmlFor="filter-envelope-release">
            Release: {filterEnvelope.release.toFixed(2)} seconds
          </label>

          <input
            id="filter-envelope-release"
            type="range"
            min="0"
            max="4"
            step="0.01"
            value={filterEnvelope.release}
            onChange={(event) =>
              handleFilterEnvelopeChange('release', event)
            }
          />
        </div>

        <div>
          <label htmlFor="filter-envelope-octaves">
            Amount: {filterEnvelope.octaves.toFixed(1)} octaves
          </label>

          <input
            id="filter-envelope-octaves"
            type="range"
            min="0"
            max="8"
            step="0.1"
            value={filterEnvelope.octaves}
            onChange={(event) =>
              handleFilterEnvelopeChange('octaves', event)
            }
          />
        </div>
      </fieldset>

      <fieldset>
        <legend>Amplitude Envelope</legend>

        <div>
          <label htmlFor="envelope-attack">
            Attack: {envelope.attack.toFixed(2)} seconds
          </label>

          <input
            id="envelope-attack"
            type="range"
            min="0"
            max="2"
            step="0.01"
            value={envelope.attack}
            onChange={(event) =>
              handleEnvelopeChange('attack', event)
            }
          />
        </div>

        <div>
          <label htmlFor="envelope-decay">
            Decay: {envelope.decay.toFixed(2)} seconds
          </label>

          <input
            id="envelope-decay"
            type="range"
            min="0"
            max="2"
            step="0.01"
            value={envelope.decay}
            onChange={(event) =>
              handleEnvelopeChange('decay', event)
            }
          />
        </div>

        <div>
          <label htmlFor="envelope-sustain">
            Sustain: {Math.round(envelope.sustain * 100)}%
          </label>

          <input
            id="envelope-sustain"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={envelope.sustain}
            onChange={(event) =>
              handleEnvelopeChange('sustain', event)
            }
          />
        </div>

        <div>
          <label htmlFor="envelope-release">
            Release: {envelope.release.toFixed(2)} seconds
          </label>

          <input
            id="envelope-release"
            type="range"
            min="0"
            max="4"
            step="0.01"
            value={envelope.release}
            onChange={(event) =>
              handleEnvelopeChange('release', event)
            }
          />
        </div>
      </fieldset>

      <SynthKeyboard
        activeNote={activeNote}
        onNoteStart={handleNoteStart}
        onNoteRelease={handleNoteRelease}
      />
    </section>
  );
};