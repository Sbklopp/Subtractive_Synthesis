# Subtractive Synthesis

A browser-based music creation application built with React, TypeScript, Tone.js, and the Web Audio API.

The application currently includes two primary views:

- A virtual subtractive synthesizer
- A programmable drum machine with six synthesized drum voices and a variable 2-64 step sequencer

## Technology

- React
- TypeScript
- Vite
- Tone.js
- Web Audio API
- Zustand

## Getting Started

### Requirements

Install Node.js 24 and npm.

Verify your installations:

```bash
node --version
npm --version
```

### Install Dependencies

Clone the repository, enter the project directory, and install the dependencies:

```bash
cd Subtractive_Synthesis
npm install
```

### Run the Development Server

```bash
npm run dev
```

Open the local URL displayed in the terminal.

Browsers require audio to be started through a user interaction. Click a pad, press a keyboard key, or press the sequencer Play button before expecting audio output.

### Create a Production Build

```bash
npm run build
```

### Preview the Production Build

```bash
npm run preview
```

## Current Features

### Application Views

The application provides separate views for the synthesizer and drum machine.

Audio is routed through a shared master output, allowing the user to switch between views without rebuilding the audio engine.

### Master Output

The shared master output includes:

- Master volume control
- Master mute control
- Output limiting
- Real-time waveform visualization

## Subtractive Synthesizer

The synthesizer follows a traditional subtractive signal path:

**Oscillators → Mixer → Low-Pass Filter → Amplitude Envelope → Master Output**

The LFO can modulate multiple points within this signal path.

### Modulation

The synthesizer includes one configurable low-frequency oscillator.

The LFO provides:

- Sine, triangle, square, and sawtooth waveforms
- Adjustable modulation rate
- Pitch modulation
- Filter-cutoff modulation
- Square-wave duty-cycle modulation
- Independent enable and depth controls for each destination

Duty-cycle modulation only affects oscillators using the square waveform.

### Oscillators

The synthesizer includes two oscillators: Oscillator A and Oscillator B.

Each oscillator provides:

- Sine waveform
- Triangle waveform
- Square waveform
- Sawtooth waveform
- Independent detuning
- Independent octave control from -2 to +2 octaves
- Independent mixer level

Square waveforms use pulse oscillators internally, allowing their duty cycle to be modulated by the LFO.

### Mixer

The mixer provides independent level controls for:

- Oscillator A
- Oscillator B

### Low-Pass Filter

The voltage-controlled filter provides:

- 24 dB-per-octave low-pass filtering
- Cutoff range from 12 Hz to 12 kHz
- Exponential cutoff scaling
- Increased control over lower frequencies
- 500 Hz cutoff at the slider midpoint
- Adjustable resonance

### Filter Envelope

The filter has a dedicated ADSR envelope with controls for:

- Attack
- Decay
- Sustain
- Release
- Filter modulation amount in octaves

### Amplitude Envelope

The amplifier has a dedicated ADSR envelope with controls for:

- Attack
- Decay
- Sustain
- Release

Notes remain active while a key is held and enter the release stage when the key is released.

### Synth Presets

The synthesizer includes the following presets:

- Init
- Deep Bass
- Soft Lead
- PWM Pad

Changing a preset parameter marks the current patch as custom. The patch can also be reset to its initial settings.

### Synth Keyboard

The synthesizer can be played with the on-screen keyboard or a computer keyboard.

| Computer key | Note |
| --- | --- |
| A | C2 |
| W | C♯2 |
| S | D2 |
| E | D♯2 |
| D | E2 |
| F | F2 |
| T | F♯2 |
| G | G2 |
| Y | G♯2 |
| H | A2 |
| U | A♯2 |
| J | B2 |
| K | C3 |

### Oscilloscope

A compact real-time oscilloscope is displayed in the synthesizer header.

The oscilloscope reads from the shared master output and can display audio produced by either the synthesizer or drum machine.

## Drum Machine

The drum machine contains six independently adjustable synthesized drum voices:

- Bass drum
- Snare drum
- Hand clap
- Closed hi-hat
- Open hi-hat
- Crash cymbal

Each voice can be played using its on-screen pad or assigned computer keyboard key.

### Bass Drum

The bass drum provides controls for:

- Tune
- Pitch drop
- Decay
- Tone
- Level

### Snare Drum

The snare combines tuned oscillators, filtered noise, a transient snap layer, and light saturation.

The snare provides controls for:

- Tune
- Noise amount
- Tone
- Decay
- Level

### Hand Clap

The clap uses multiple short noise transients, a filtered body layer, a longer noise tail, and light saturation.

The clap provides controls for:

- Tone
- Transient spread
- Decay
- Level

### Hi-Hats

The closed and open hi-hats combine filtered noise with inharmonic square-wave oscillators.

Each hi-hat provides controls for:

- Tone
- Decay
- Metallic amount
- Level

The closed and open hi-hats belong to the same choke group. Triggering the closed hi-hat cuts off the open hi-hat.

### Crash Cymbal

The crash cymbal combines an inharmonic oscillator bank with a filtered noise layer.

The cymbal provides controls for:

- Tone
- Decay
- Wash
- Level

### Drum Keyboard Controls

| Computer key | Drum voice |
| --- | --- |
| A | Bass drum |
| S | Snare drum |
| D | Hand clap |
| F | Closed hi-hat |
| G | Open hi-hat |
| H | Crash cymbal |

Drum keyboard controls are active while the drum-machine view is open. Keyboard shortcuts are ignored while editing form controls.

## 16-Step Sequencer

The drum machine includes a programmable 16-step sequencer.

Current sequencer features include:

- Six sequencing rows
- Sixteen steps per voice
- On/off control for every step
- Play and stop controls
- Tempo control from 40 to 240 BPM
- Current-step highlighting
- Pattern clearing
- Individual sequencer mute controls for each drum voice
- Real-time pattern editing during playback
- Accurate scheduling through the Tone.js transport

Sequencer mutes only affect sequenced playback. Muted voices can still be played manually using their pads or keyboard shortcuts.
