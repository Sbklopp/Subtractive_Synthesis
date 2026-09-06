# Subtractive Synthesis

A browser-based subtractive synthesizer built with React, TypeScript, Tone.js, and the Web Audio API.

The application models a traditional subtractive synthesis signal path:

**LFO → Oscillators → Mixer → Low-Pass Filter → Amplifier**

## Technology

- React
- TypeScript
- Vite
- Tone.js
- Web Audio API

## Getting Started

### Requirements

Install a current version of Node.js and npm.

You can verify your installations with:

```bash
node --version
npm --version
```

### Install Dependencies

Clone the repository and enter the project directory:

```bash
git clone <repository-url>
cd Subtractive_Synthesis
```

Install the project dependencies:

```bash
npm install
```

### Run the Development Server

```bash
npm run dev
```

Open the local URL displayed in the terminal.

Audio must be started through a user interaction, so click or press one of the keyboard keys before expecting audio output.

### Create a Production Build

```bash
npm run build
```

### Preview the Production Build

```bash
npm run preview
```

## Current Features

### Modulation

The synthesizer includes one configurable low-frequency oscillator.

The LFO provides:

- Sine, triangle, square, and sawtooth waveforms
- Adjustable modulation rate
- Pitch modulation
- Filter cutoff modulation
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
- Independent mixer level

Square waveforms use pulse oscillators internally so their duty cycle can be modulated by the LFO.

### Mixer

The mixer provides independent volume controls for:

- Oscillator A
- Oscillator B

### Low-Pass Filter

The voltage-controlled filter provides:

- 24 dB-per-octave low-pass filtering
- Cutoff range from 12 Hz to 12 kHz
- Exponential cutoff control for more precision at lower frequencies
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

### Keyboard

The synthesizer can be played with the on-screen keyboard or a computer keyboard.

| Computer key | Note |
|---|---|
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

A real-time oscilloscope displays the final waveform produced by the synthesizer.