import { useEffect, useState } from 'react';
import { audioController } from '../../audio/AudioController';
import {
  DEFAULT_ENVELOPE,
  DEFAULT_FILTER_ENVELOPE,
  DEFAULT_LFO,
  DEFAULT_OSCILLATORS,
  type EnvelopeSettings,
  type FilterEnvelopeSettings,
  type LfoSettings,
  type OscillatorId,
  type OscillatorSettings,
  type OscillatorType,
} from '../../domain/Synth';
import { FilterCutoffControl } from './FilterCutoffControl';
import { LfoControls } from './LfoControls';
import { MixerControls } from './MixerControls';
import { OscillatorControls } from './OscillatorControls';
import { Oscilloscope } from './Oscilloscope';
import { SynthKeyboard } from './SynthKeyboard';
import './SynthPanel.css';

export const SynthPanel = () => {
  const [oscillators, setOscillators] = useState<
    Record<OscillatorId, OscillatorSettings>
  >(DEFAULT_OSCILLATORS);

  const [filterCutoff, setFilterCutoff] = useState(200);
  const [filterResonance, setFilterResonance] = useState(2);

  const [filterEnvelope, setFilterEnvelope] =
    useState<FilterEnvelopeSettings>(
      DEFAULT_FILTER_ENVELOPE,
    );

  const [envelope, setEnvelope] =
    useState<EnvelopeSettings>(DEFAULT_ENVELOPE);

  const [lfo, setLfo] =
    useState<LfoSettings>(DEFAULT_LFO);

  const [activeNote, setActiveNote] = useState<
    string | null
  >(null);

  const [status, setStatus] = useState(
    'Press and hold a key to play a note.',
  );

  useEffect(() => {
    return () => {
      audioController.dispose();
    };
  }, []);

  const handleNoteStart = async (note: string) => {
    setActiveNote(note);
    setStatus(`Playing ${note}`);

    try {
      await audioController.startNote(note);
    } catch (error) {
      console.error('Unable to start audio:', error);

      setActiveNote(null);
      setStatus(
        'Unable to start audio. Click a key and try again.',
      );
    }
  };

  const handleNoteRelease = () => {
    audioController.releaseNote();

    setActiveNote(null);
    setStatus('Press and hold a key to play a note.');
  };

  const handleOscillatorTypeChange = (
    oscillatorId: OscillatorId,
    type: OscillatorType,
  ) => {
    setOscillators((currentOscillators) => ({
      ...currentOscillators,
      [oscillatorId]: {
        ...currentOscillators[oscillatorId],
        type,
      },
    }));

    void audioController.setOscillatorType(
      oscillatorId,
      type,
    );
  };

  const handleOscillatorLevelChange = (
    oscillatorId: OscillatorId,
    level: number,
  ) => {
    setOscillators((currentOscillators) => ({
      ...currentOscillators,
      [oscillatorId]: {
        ...currentOscillators[oscillatorId],
        level,
      },
    }));

    void audioController.setOscillatorLevel(
      oscillatorId,
      level,
    );
  };

  const handleOscillatorDetuneChange = (
    oscillatorId: OscillatorId,
    detune: number,
  ) => {
    setOscillators((currentOscillators) => ({
      ...currentOscillators,
      [oscillatorId]: {
        ...currentOscillators[oscillatorId],
        detune,
      },
    }));

    void audioController.setOscillatorDetune(
      oscillatorId,
      detune,
    );
  };

  const handleFilterCutoffChange = (
    frequency: number,
  ) => {
    setFilterCutoff(frequency);

    void audioController.setFilterCutoff(frequency);
  };

  const handleFilterResonanceChange = (
    resonance: number,
  ) => {
    setFilterResonance(resonance);

    void audioController.setFilterResonance(resonance);
  };

  const handleFilterEnvelopeChange = (
    property: keyof FilterEnvelopeSettings,
    value: number,
  ) => {
    const nextEnvelope = {
      ...filterEnvelope,
      [property]: value,
    };

    setFilterEnvelope(nextEnvelope);

    void audioController.setFilterEnvelope(nextEnvelope);
  };

  const handleEnvelopeChange = (
    property: keyof EnvelopeSettings,
    value: number,
  ) => {
    const nextEnvelope = {
      ...envelope,
      [property]: value,
    };

    setEnvelope(nextEnvelope);

    void audioController.setEnvelope(nextEnvelope);
  };

  const handleLfoChange = (settings: LfoSettings) => {
    setLfo(settings);

    void audioController.setLfoSettings(settings);
  };

  return (
    <section className="synth-panel">
      <header className="synth-panel__header">
        <div className="synth-panel__header-information">
          <p className="synth-panel__eyebrow">
            Virtual Analog Instrument
          </p>

          <h1>Subtractive Synthesizer</h1>

          <p className="synth-panel__status">
            {status}
          </p>
        </div>

        <div className="synth-panel__scope">
          <Oscilloscope />
        </div>
      </header>

      <div className="synth-panel__signal-scroll">
        <div className="synth-panel__signal-chain">
          <section className="synth-module synth-module--modulation">
            <h2>Modulation</h2>

            <LfoControls
              settings={lfo}
              onChange={handleLfoChange}
            />
          </section>

          <section className="synth-module synth-module--vco">
            <h2>VCO</h2>

            <div className="oscillator-stack">
              <OscillatorControls
                oscillatorId="A"
                settings={oscillators.A}
                onTypeChange={
                  handleOscillatorTypeChange
                }
                onDetuneChange={
                  handleOscillatorDetuneChange
                }
              />

              <OscillatorControls
                oscillatorId="B"
                settings={oscillators.B}
                onTypeChange={
                  handleOscillatorTypeChange
                }
                onDetuneChange={
                  handleOscillatorDetuneChange
                }
              />
            </div>
          </section>

          <section className="synth-module synth-module--mixer">
            <h2>Mix</h2>

            <MixerControls
              oscillators={oscillators}
              onLevelChange={
                handleOscillatorLevelChange
              }
            />
          </section>

          <section className="synth-module synth-module--vcf">
            <h2>VCF</h2>

            <fieldset>
              <legend>Low-pass Filter</legend>

              <FilterCutoffControl
                frequency={filterCutoff}
                onChange={handleFilterCutoffChange}
              />

              <div>
                <label htmlFor="filter-resonance">
                  Resonance:{' '}
                  {filterResonance.toFixed(1)}
                </label>

                <input
                  id="filter-resonance"
                  type="range"
                  min="0"
                  max="20"
                  step="0.1"
                  value={filterResonance}
                  onChange={(event) =>
                    handleFilterResonanceChange(
                      Number(event.target.value),
                    )
                  }
                />
              </div>
            </fieldset>
          </section>

          <section className="synth-module synth-module--envelopes">
            <h2>Envelopes</h2>

            <div className="envelope-stack">
              <fieldset>
                <legend>Filter ADSR</legend>

                <div className="envelope-controls-grid">
                  <div>
                    <label htmlFor="filter-envelope-attack">
                      Attack:{' '}
                      {filterEnvelope.attack.toFixed(2)} s
                    </label>

                    <input
                      id="filter-envelope-attack"
                      type="range"
                      min="0"
                      max="2"
                      step="0.01"
                      value={filterEnvelope.attack}
                      onChange={(event) =>
                        handleFilterEnvelopeChange(
                          'attack',
                          Number(event.target.value),
                        )
                      }
                    />
                  </div>

                  <div>
                    <label htmlFor="filter-envelope-decay">
                      Decay:{' '}
                      {filterEnvelope.decay.toFixed(2)} s
                    </label>

                    <input
                      id="filter-envelope-decay"
                      type="range"
                      min="0"
                      max="2"
                      step="0.01"
                      value={filterEnvelope.decay}
                      onChange={(event) =>
                        handleFilterEnvelopeChange(
                          'decay',
                          Number(event.target.value),
                        )
                      }
                    />
                  </div>

                  <div>
                    <label htmlFor="filter-envelope-sustain">
                      Sustain:{' '}
                      {filterEnvelope.sustain.toFixed(2)}
                    </label>

                    <input
                      id="filter-envelope-sustain"
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={filterEnvelope.sustain}
                      onChange={(event) =>
                        handleFilterEnvelopeChange(
                          'sustain',
                          Number(event.target.value),
                        )
                      }
                    />
                  </div>

                  <div>
                    <label htmlFor="filter-envelope-release">
                      Release:{' '}
                      {filterEnvelope.release.toFixed(2)} s
                    </label>

                    <input
                      id="filter-envelope-release"
                      type="range"
                      min="0"
                      max="5"
                      step="0.01"
                      value={filterEnvelope.release}
                      onChange={(event) =>
                        handleFilterEnvelopeChange(
                          'release',
                          Number(event.target.value),
                        )
                      }
                    />
                  </div>

                  <div className="envelope-control--wide">
                    <label htmlFor="filter-envelope-octaves">
                      Amount:{' '}
                      {filterEnvelope.octaves.toFixed(1)}
                      {' octaves'}
                    </label>

                    <input
                      id="filter-envelope-octaves"
                      type="range"
                      min="0"
                      max="8"
                      step="0.1"
                      value={filterEnvelope.octaves}
                      onChange={(event) =>
                        handleFilterEnvelopeChange(
                          'octaves',
                          Number(event.target.value),
                        )
                      }
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <legend>Amplifier ADSR</legend>

                <div className="envelope-controls-grid">
                  <div>
                    <label htmlFor="amplitude-envelope-attack">
                      Attack:{' '}
                      {envelope.attack.toFixed(2)} s
                    </label>

                    <input
                      id="amplitude-envelope-attack"
                      type="range"
                      min="0"
                      max="2"
                      step="0.01"
                      value={envelope.attack}
                      onChange={(event) =>
                        handleEnvelopeChange(
                          'attack',
                          Number(event.target.value),
                        )
                      }
                    />
                  </div>

                  <div>
                    <label htmlFor="amplitude-envelope-decay">
                      Decay:{' '}
                      {envelope.decay.toFixed(2)} s
                    </label>

                    <input
                      id="amplitude-envelope-decay"
                      type="range"
                      min="0"
                      max="2"
                      step="0.01"
                      value={envelope.decay}
                      onChange={(event) =>
                        handleEnvelopeChange(
                          'decay',
                          Number(event.target.value),
                        )
                      }
                    />
                  </div>

                  <div>
                    <label htmlFor="amplitude-envelope-sustain">
                      Sustain:{' '}
                      {envelope.sustain.toFixed(2)}
                    </label>

                    <input
                      id="amplitude-envelope-sustain"
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={envelope.sustain}
                      onChange={(event) =>
                        handleEnvelopeChange(
                          'sustain',
                          Number(event.target.value),
                        )
                      }
                    />
                  </div>

                  <div>
                    <label htmlFor="amplitude-envelope-release">
                      Release:{' '}
                      {envelope.release.toFixed(2)} s
                    </label>

                    <input
                      id="amplitude-envelope-release"
                      type="range"
                      min="0"
                      max="5"
                      step="0.01"
                      value={envelope.release}
                      onChange={(event) =>
                        handleEnvelopeChange(
                          'release',
                          Number(event.target.value),
                        )
                      }
                    />
                  </div>
                </div>
              </fieldset>
            </div>
          </section>
        </div>
      </div>

      <SynthKeyboard
        activeNote={activeNote}
        onNoteStart={handleNoteStart}
        onNoteRelease={handleNoteRelease}
      />
    </section>
  );
};