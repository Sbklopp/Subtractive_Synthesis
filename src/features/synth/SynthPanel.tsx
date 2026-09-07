import { useState } from 'react';
import { audioController } from '../../audio/AudioController';
import {
  DEFAULT_SYNTH_PATCH,
  type EnvelopeSettings,
  type FilterEnvelopeSettings,
  type LfoSettings,
  type OscillatorId,
  type OscillatorOctave,
  type OscillatorType,
} from '../../domain/Synth';
import type { SynthPreset } from '../../domain/SynthPresets';
import { useSynthStore } from '../../store/useSynthStore';
import { FilterCutoffControl } from './FilterCutoffControl';
import { LfoControls } from './LfoControls';
import { MixerControls } from './MixerControls';
import { OscillatorControls } from './OscillatorControls';
import { Oscilloscope } from './Oscilloscope';
import { PresetControls } from './PresetControls';
import { SynthKeyboard } from './SynthKeyboard';
import './SynthPanel.css';

export const SynthPanel = () => {
  const patch = useSynthStore((state) => state.patch);

  const selectedPresetId = useSynthStore(
    (state) => state.selectedPresetId,
  );

  const updateOscillator = useSynthStore(
    (state) => state.updateOscillator,
  );

  const setFilterCutoff = useSynthStore(
    (state) => state.setFilterCutoff,
  );

  const setFilterResonance = useSynthStore(
    (state) => state.setFilterResonance,
  );

  const setFilterEnvelope = useSynthStore(
    (state) => state.setFilterEnvelope,
  );

  const setAmplitudeEnvelope = useSynthStore(
    (state) => state.setAmplitudeEnvelope,
  );

  const setLfo = useSynthStore(
    (state) => state.setLfo,
  );

  const applyPreset = useSynthStore(
    (state) => state.applyPreset,
  );

  const resetPatch = useSynthStore(
    (state) => state.resetPatch,
  );

  const [activeNote, setActiveNote] = useState<
    string | null
  >(null);

  const [status, setStatus] = useState(
    'Press and hold a key to play a note.',
  );

  const {
    oscillators,
    filter,
    amplitudeEnvelope,
    lfo,
  } = patch;

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
    updateOscillator(oscillatorId, {
      type,
    });

    void audioController.setOscillatorType(
      oscillatorId,
      type,
    );
  };

  const handleOscillatorLevelChange = (
    oscillatorId: OscillatorId,
    level: number,
  ) => {
    updateOscillator(oscillatorId, {
      level,
    });

    void audioController.setOscillatorLevel(
      oscillatorId,
      level,
    );
  };

  const handleOscillatorDetuneChange = (
    oscillatorId: OscillatorId,
    detune: number,
  ) => {
    updateOscillator(oscillatorId, {
      detune,
    });

    void audioController.setOscillatorDetune(
      oscillatorId,
      detune,
    );
  };

  const handleOscillatorOctaveChange = (
    oscillatorId: OscillatorId,
    octave: OscillatorOctave,
  ) => {
    updateOscillator(oscillatorId, {
      octave,
    });

    void audioController.setOscillatorOctave(
      oscillatorId,
      octave,
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
      ...filter.envelope,
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
      ...amplitudeEnvelope,
      [property]: value,
    };

    setAmplitudeEnvelope(nextEnvelope);

    void audioController.setEnvelope(nextEnvelope);
  };

  const handleLfoChange = (settings: LfoSettings) => {
    setLfo(settings);

    void audioController.setLfoSettings(settings);
  };

  const handlePresetSelect = (
    preset: SynthPreset,
  ) => {
    applyPreset(preset);

    void audioController.applyPatch(preset.patch);
  };

  const handleReset = () => {
    resetPatch();

    void audioController.applyPatch(
      DEFAULT_SYNTH_PATCH,
    );
  };

  return (
    <section className="synth-panel">
      <header className="synth-panel__header">
        <div className="synth-panel__header-information">
          <p className="synth-panel__eyebrow">
            Virtual Analog Instrument
          </p>

          <h1>Subtractive Synthesizer</h1>

          <PresetControls
            selectedPresetId={selectedPresetId}
            onPresetSelect={handlePresetSelect}
            onReset={handleReset}
          />

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
                onOctaveChange={
                  handleOscillatorOctaveChange
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
                onOctaveChange={
                  handleOscillatorOctaveChange
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
                frequency={filter.cutoff}
                onChange={handleFilterCutoffChange}
              />

              <div>
                <label htmlFor="filter-resonance">
                  Resonance:{' '}
                  {filter.resonance.toFixed(1)}
                </label>

                <input
                  id="filter-resonance"
                  type="range"
                  min="0"
                  max="20"
                  step="0.1"
                  value={filter.resonance}
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
                      {filter.envelope.attack.toFixed(2)} s
                    </label>

                    <input
                      id="filter-envelope-attack"
                      type="range"
                      min="0"
                      max="2"
                      step="0.01"
                      value={filter.envelope.attack}
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
                      {filter.envelope.decay.toFixed(2)} s
                    </label>

                    <input
                      id="filter-envelope-decay"
                      type="range"
                      min="0"
                      max="2"
                      step="0.01"
                      value={filter.envelope.decay}
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
                      {filter.envelope.sustain.toFixed(2)}
                    </label>

                    <input
                      id="filter-envelope-sustain"
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={filter.envelope.sustain}
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
                      {filter.envelope.release.toFixed(2)} s
                    </label>

                    <input
                      id="filter-envelope-release"
                      type="range"
                      min="0"
                      max="5"
                      step="0.01"
                      value={filter.envelope.release}
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
                      {filter.envelope.octaves.toFixed(1)}
                      {' octaves'}
                    </label>

                    <input
                      id="filter-envelope-octaves"
                      type="range"
                      min="0"
                      max="8"
                      step="0.1"
                      value={filter.envelope.octaves}
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
                      {amplitudeEnvelope.attack.toFixed(2)} s
                    </label>

                    <input
                      id="amplitude-envelope-attack"
                      type="range"
                      min="0"
                      max="2"
                      step="0.01"
                      value={amplitudeEnvelope.attack}
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
                      {amplitudeEnvelope.decay.toFixed(2)} s
                    </label>

                    <input
                      id="amplitude-envelope-decay"
                      type="range"
                      min="0"
                      max="2"
                      step="0.01"
                      value={amplitudeEnvelope.decay}
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
                      {amplitudeEnvelope.sustain.toFixed(2)}
                    </label>

                    <input
                      id="amplitude-envelope-sustain"
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={amplitudeEnvelope.sustain}
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
                      {amplitudeEnvelope.release.toFixed(2)} s
                    </label>

                    <input
                      id="amplitude-envelope-release"
                      type="range"
                      min="0"
                      max="5"
                      step="0.01"
                      value={amplitudeEnvelope.release}
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