// Procedural Biblical Ambient Music Generator using Web Audio API
// Inspired by King David's Harp (1 Samuel 16:23: "David prenait la harpe et jouait de sa main; Saül respirait plus à l'aise")

let ambienceCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isPlaying = false;
let currentMood: 'harpe' | 'choeur' | 'sabbat' = 'harpe';
let intervalId: number | null = null;
let padOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];

function getAmbienceContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ambienceCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      ambienceCtx = new AudioContextClass();
    }
  }
  if (ambienceCtx && ambienceCtx.state === 'suspended') {
    ambienceCtx.resume();
  }
  return ambienceCtx;
}

// Pentatonic / Modal note frequencies for David's Harp (D Dorian / F Lydian)
const HARP_NOTES = [
  146.83, // D3
  174.61, // F3
  196.00, // G3
  220.00, // A3
  261.63, // C4
  293.66, // D4
  349.23, // F4
  392.00, // G4
  440.00, // A4
  523.25, // C5
  587.33, // D5
];

/**
 * Plucks a delicate harp note with gentle resonance
 */
function pluckHarpString(ctx: AudioContext, destination: AudioNode, freq: number, time: number, velocity: number = 0.25) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Gentle triangle-sine combination for warm acoustic plucked string
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, time);

  // Filter for acoustic wood body warmth
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(freq * 3.5, time);
  filter.frequency.exponentialRampToValueAtTime(freq * 0.8, time + 2.2);

  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(velocity, time + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 2.8);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(destination);

  osc.start(time);
  osc.stop(time + 2.9);
}

/**
 * Starts continuous warm celestial pad chord
 */
function startCelestialPad(ctx: AudioContext, destination: AudioNode, rootFreqs: number[]) {
  stopCelestialPad();
  padOscillators = rootFreqs.map((freq) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Subtle slow frequency vibrato for heavenly shimmer
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
    lfoGain.gain.setValueAtTime(1.5, ctx.currentTime);
    lfo.connect(osc.frequency);
    lfo.start();

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 3.0);

    osc.connect(gain);
    gain.connect(destination);
    osc.start();

    return { osc, gain };
  });
}

function stopCelestialPad() {
  padOscillators.forEach(({ osc, gain }) => {
    try {
      if (ambienceCtx) {
        gain.gain.linearRampToValueAtTime(0.0001, ambienceCtx.currentTime + 1.5);
        setTimeout(() => {
          try {
            osc.stop();
          } catch {
            // ignore
          }
        }, 1600);
      }
    } catch {
      // ignore
    }
  });
  padOscillators = [];
}

/**
 * Starts playing procedural biblical ambient music
 */
export function startBiblicalAmbience(mood: 'harpe' | 'choeur' | 'sabbat' = 'harpe', volume: number = 0.35) {
  const ctx = getAmbienceContext();
  if (!ctx) return;

  currentMood = mood;

  if (!masterGain) {
    masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
  }
  masterGain.gain.setValueAtTime(volume, ctx.currentTime);

  if (isPlaying) {
    stopBiblicalAmbience();
  }
  isPlaying = true;

  // Setup base celestial chord pads (D3, A3, F4 for peaceful Davidic harmony)
  const padFreqs =
    mood === 'harpe'
      ? [146.83, 220.00, 349.23] // D minor / F Major peace
      : mood === 'choeur'
      ? [130.81, 196.00, 261.63, 329.63] // C Major holiness
      : [108.00, 162.00, 216.00]; // 432 Hz Sabbat rest

  startCelestialPad(ctx, masterGain, padFreqs);

  // Arpeggiate gentle harp plucks every 1.5 - 2.8 seconds
  let noteIndex = 0;
  const playNextHarpArpeggio = () => {
    if (!isPlaying || !ambienceCtx || !masterGain) return;

    const now = ambienceCtx.currentTime;
    const currentNote = HARP_NOTES[noteIndex % HARP_NOTES.length];
    pluckHarpString(ambienceCtx, masterGain, currentNote, now, 0.18 + Math.random() * 0.08);

    // Occasional double pluck (harmony)
    if (Math.random() > 0.4) {
      const harmNote = HARP_NOTES[(noteIndex + 3) % HARP_NOTES.length];
      pluckHarpString(ambienceCtx, masterGain, harmNote, now + 0.12, 0.14);
    }

    noteIndex = (noteIndex + (Math.random() > 0.5 ? 1 : 2)) % HARP_NOTES.length;

    // Schedule next pluck with humanized organic timing (1400ms to 2400ms)
    const nextInterval = 1400 + Math.random() * 1200;
    intervalId = window.setTimeout(playNextHarpArpeggio, nextInterval);
  };

  playNextHarpArpeggio();
}

export function setAmbienceVolume(vol: number) {
  if (masterGain && ambienceCtx) {
    masterGain.gain.linearRampToValueAtTime(Math.max(0, Math.min(1, vol)), ambienceCtx.currentTime + 0.1);
  }
}

export function stopBiblicalAmbience() {
  isPlaying = false;
  if (intervalId) {
    clearTimeout(intervalId);
    intervalId = null;
  }
  stopCelestialPad();
}

export function isAmbiencePlaying(): boolean {
  return isPlaying;
}
