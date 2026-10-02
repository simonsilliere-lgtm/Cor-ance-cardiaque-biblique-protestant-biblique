// Web Audio API and Speech Synthesis utilities for cardio stimulation and scripture meditation

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a realistic biphasic heart beat sound ("lub-dub")
 */
export function playHeartbeatSound(volume: number = 0.4) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // First beat: Lub (Systole) - deep resonance ~65Hz
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(68, now);
    osc1.frequency.exponentialRampToValueAtTime(38, now + 0.12);

    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(volume * 0.9, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.15);

    // Second beat: Dub (Diastole) - slightly higher ~85Hz, ~0.15s later
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    const t2 = now + 0.14;

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(82, t2);
    osc2.frequency.exponentialRampToValueAtTime(45, t2 + 0.11);

    gain2.gain.setValueAtTime(0, t2);
    gain2.gain.linearRampToValueAtTime(volume * 0.7, t2 + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.13);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(t2);
    osc2.stop(t2 + 0.14);
  } catch (e) {
    console.warn('Audio playHeartbeat error:', e);
  }
}

/**
 * Plays an ethereal chime / singing bowl tone for breathing guidance and interval transitions
 */
export function playChimeSound(type: 'inspire' | 'expire' | 'interval' | 'victory' | 'rest' = 'inspire') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    let baseFreq = 440; // A4
    let duration = 1.8;

    if (type === 'inspire') {
      baseFreq = 523.25; // C5 - uplifting
      duration = 2.2;
    } else if (type === 'expire') {
      baseFreq = 392.00; // G4 - grounding
      duration = 2.5;
    } else if (type === 'interval') {
      baseFreq = 659.25; // E5 - energetic
      duration = 1.0;
    } else if (type === 'victory') {
      baseFreq = 587.33; // D5 chord
      duration = 3.0;
    } else if (type === 'rest') {
      baseFreq = 329.63; // E4 - soft rest
      duration = 1.6;
    }

    // Fundamental oscillator
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);

    // Overtone for rich harmonic warmth
    const overtone = ctx.createOscillator();
    const overGain = ctx.createGain();
    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(baseFreq * 2, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    overGain.gain.setValueAtTime(0, now);
    overGain.gain.linearRampToValueAtTime(0.08, now + 0.04);
    overGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    overtone.connect(overGain);
    overGain.connect(ctx.destination);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + duration);
    overtone.stop(now + duration);
  } catch (e) {
    console.warn('Audio playChime error:', e);
  }
}

/**
 * Plays a rich sacred organ / harmonium hymn chord progression reminiscent of a Christian cantique.
 * NOT a simple 'ding', but a warm, reverent harmony evoking Christ's work on the cross.
 */
export function playChristHymnChord() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Harmonic chords in C Major / F Major / G / C (sacred organ choir progression)
    // Notes: C3, G3, C4, E4, G4, C5 played in gentle arpeggiated organ voicing
    const chordVoicings = [
      { freq: 130.81, gain: 0.15 }, // C3 (root bass)
      { freq: 196.00, gain: 0.12 }, // G3 (fifth)
      { freq: 261.63, gain: 0.14 }, // C4
      { freq: 329.63, gain: 0.12 }, // E4 (warm major third)
      { freq: 392.00, gain: 0.10 }, // G4
      { freq: 523.25, gain: 0.08 }, // C5 (celestial high octave)
    ];

    chordVoicings.forEach((voice, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Organ-like waveform with soft triangle / sine blend
      osc.type = index % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(voice.freq, now);

      // Micro detuning for authentic church organ chorus warmth
      osc.detune.setValueAtTime((index - 2) * 3, now);

      // Gentle swell attack (no harsh hit) and lush resonant release over 3.2 seconds
      const startTime = now + index * 0.06; // subtle organ spread
      const attackTime = 0.35;
      const sustainDuration = 2.0;
      const releaseTime = 1.2;

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(voice.gain, startTime + attackTime);
      gain.gain.setValueAtTime(voice.gain, startTime + attackTime + sustainDuration);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + attackTime + sustainDuration + releaseTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + attackTime + sustainDuration + releaseTime);
    });

    // Secondary soft hymn melody line (notes C4 -> E4 -> G4 -> C5 like the start of a cantique)
    const melodyNotes = [
      { f: 261.63, t: 0.1, d: 0.8 },  // C4
      { f: 329.63, t: 0.6, d: 0.8 },  // E4
      { f: 392.00, t: 1.1, d: 0.9 },  // G4
      { f: 523.25, t: 1.7, d: 1.6 },  // C5 (held resolution)
    ];

    melodyNotes.forEach((m) => {
      const mOsc = ctx.createOscillator();
      const mGain = ctx.createGain();
      mOsc.type = 'sine';
      mOsc.frequency.setValueAtTime(m.f, now + m.t);

      mGain.gain.setValueAtTime(0, now + m.t);
      mGain.gain.linearRampToValueAtTime(0.07, now + m.t + 0.15);
      mGain.gain.exponentialRampToValueAtTime(0.0001, now + m.t + m.d);

      mOsc.connect(mGain);
      mGain.connect(ctx.destination);

      mOsc.start(now + m.t);
      mOsc.stop(now + m.t + m.d);
    });
  } catch (e) {
    console.warn('Audio playChristHymnChord error:', e);
  }
}

/**
 * Text-to-speech for reading scriptures in a soothing French voice
 */
let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakScripture(text: string, onEnd?: () => void, onError?: () => void) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    onError?.();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fr-FR';
  utterance.rate = 0.92; // Slightly measured and peaceful pace
  utterance.pitch = 1.0;

  // Try to pick a natural French voice if available
  const voices = window.speechSynthesis.getVoices();
  const frVoice = voices.find(v => v.lang.startsWith('fr') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Siri') || v.name.includes('Thomas') || v.name.includes('Amelie') || v.name.includes('Henri')));
  if (frVoice) {
    utterance.voice = frVoice;
  }

  utterance.onend = () => {
    currentUtterance = null;
    onEnd?.();
  };

  utterance.onerror = () => {
    currentUtterance = null;
    onError?.();
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function isSpeaking(): boolean {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false;
  return window.speechSynthesis.speaking;
}
