import { useState, type ChangeEvent } from 'react';
import { audioController } from '../../audio/AudioController';
import {
    DEFAULT_ENVELOPE,
    type EnvelopeSettings,
    type OscillatorType,
} from '../../domain/Synth';
import { SynthKeyboard } from './SynthKeyboard';

export const SynthPanel = () => {
    const [status, setStatus] = useState('Audio has not started');
    const [activeNote, setActiveNote] = useState<string | null>(null);
    const [oscillatorType, setOscillatorType] =
        useState<OscillatorType>('sawtooth');
    const [filterCutoff, setFilterCutoff] = useState(200);
    const [filterResonance, setFilterResonance] = useState(2);
    const [envelope, setEnvelope] =
        useState<EnvelopeSettings>(DEFAULT_ENVELOPE);

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



    const handleOscillatorChange = (
        event: ChangeEvent<HTMLSelectElement>,
    ) => {
        const type = event.target.value as OscillatorType;

        setOscillatorType(type);
        void audioController.setOscillatorType(type);
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

            <fieldset>
                <legend>Oscillator</legend>

                <label htmlFor="oscillator-type">Waveform</label>

                <select
                    id="oscillator-type"
                    value={oscillatorType}
                    onChange={handleOscillatorChange}
                >
                    <option value="sine">Sine</option>
                    <option value="triangle">Triangle</option>
                    <option value="square">Square</option>
                    <option value="sawtooth">Sawtooth</option>
                </select>
            </fieldset>

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