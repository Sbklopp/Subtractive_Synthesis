# Subtractive Synthesis

A browser-based virtual analog synthesizer built with React, TypeScript, Tone.js, and the Web Audio API.

The project is focused on learning and recreating the architecture of a subtractive synthesizer. It currently provides two oscillators, modulation routing, a mixer, a resonant low-pass filter, envelopes, an oscilloscope, and an interactive keyboard.

## Current Features

### Voltage-Controlled Oscillators

The synthesizer currently has two oscillators:

- Oscillator A
- Oscillator B
- Sine waveform
- Triangle waveform
- Square waveform
- Sawtooth waveform
- Independent detuning
- Independent output levels

Square waveforms use a pulse oscillator internally, allowing their duty cycle to be modulated.

### Mixer

The mixer currently provides independent level controls for:

- Oscillator A
- Oscillator B

Future mixer channels may includeinclude noise

Future<table  code>.gitignore Issue: lines `logs/` plus weird `logs` maybe fine. But typo `logs/` no issue. Pattern `*.local` Vite. `npm-debug`. 
Typos in README at end generated: "Future mixer channels ... Future mixer channels..." I need correct before final. Continue.

Mixer future:
- noise generator
- sub oscillator
- master level
Maybe levels already existed in oscillator engine but UI moved.

### VCF
- lowpass 24dB? Tone rolloff -24 yes.
- cutoff 12Hz-12k piecewise exponential, 500 midpoint.
- resonance
- filter ADSR and octave amount.
### VCA
- amp ADSR
### LFO
- types, rate, pitch, filter, duty
- independent enable/depth
### Scope
### Keyboard
- C2-C3 keys A W... mapping maybe state. Need exact mapping from summary. Mention.
Architecture table:
```
src/audio/AudioController.ts
...
```
`OscillatorVoice`, `SubtractiveSynth`, `domain/Synth`, features files.
Signal flow.
Run.
Browser Audio.
Scripts.
Roadmap.
Git commands.
Need mention package-lock now removal from latest branch not history.

Let's redo final in coherent. Ensure not too huge but full README.

Also minor .gitignore pattern `logs/` enough. `*.log`.
Use `# Package lock` line. Great.

Let's craft final entirely. 