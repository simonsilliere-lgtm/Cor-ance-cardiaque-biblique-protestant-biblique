import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Heart, Shield, CheckCircle2, Sparkles, BookOpen, Music, Clock, Gauge, ArrowRight } from 'lucide-react';
import { playChimeSound, playHeartbeatSound, playChristHymnChord, speakScripture, stopSpeaking } from '../utils/audio';
import { BIBLE_VERSES } from '../data/bibleVerses';
import { ThreeMinuteBeadsTracker } from './ThreeMinuteBeadsTracker';
import { getMilestoneForMinute, ChristMilestone } from '../data/christMilestones';

interface CoherenceViewProps {
  soundEnabled: boolean;
}

export const CoherenceView: React.FC<CoherenceViewProps> = ({ soundEnabled }) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  // Options: 3, 6, 9, 12, 15, 18, 20 (MAX 20 min) - default to 3 min for focused 3-minute sessions!
  const [targetMinutes, setTargetMinutes] = useState<number>(3);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(3 * 60);
  const [phase, setPhase] = useState<'inspire' | 'expire'>('inspire');
  const [phaseSeconds, setPhaseSeconds] = useState<number>(0);
  const [breathCount, setBreathCount] = useState<number>(0);
  const [activeVerseIndex, setActiveVerseIndex] = useState<number>(0);
  const [isSpeakingVerse, setIsSpeakingVerse] = useState<boolean>(false);
  const [enableHeartSound, setEnableHeartSound] = useState<boolean>(false);
  
  // 3-Minute Milestone tracking
  const [lastAnnouncedMilestoneMinute, setLastAnnouncedMilestoneMinute] = useState<number>(0);
  const [activeMilestoneAlert, setActiveMilestoneAlert] = useState<ChristMilestone | null>(null);

  // 5 seconds inspire, 5 seconds expire (6 respirations / min)
  const PHASE_DURATION = 5;
  const THREE_MIN_SECONDS = 180;

  const timerRef = useRef<number | null>(null);
  const heartbeatIntervalRef = useRef<number | null>(null);

  // Verses specifically about breath, peace, heart
  const meditationVerses = BIBLE_VERSES.filter(
    (v) => v.category === 'souffle' || v.category === 'paix' || v.category === 'coeur'
  );
  const currentVerse = meditationVerses[activeVerseIndex % meditationVerses.length];

  const totalDurationSeconds = targetMinutes * 60;
  const elapsedSeconds = totalDurationSeconds - secondsRemaining;

  // 3-Minute progress calculations
  const elapsedInCurrent3Min = elapsedSeconds >= totalDurationSeconds && secondsRemaining === 0
    ? THREE_MIN_SECONDS
    : elapsedSeconds % THREE_MIN_SECONDS;

  const remainingInCurrent3Min = secondsRemaining === 0
    ? 0
    : THREE_MIN_SECONDS - elapsedInCurrent3Min;

  const progressPercent3Min = Math.min(100, Math.round((elapsedInCurrent3Min / THREE_MIN_SECONDS) * 100));

  const currentBeadNumber = Math.min(
    Math.ceil(targetMinutes / 3),
    Math.floor(elapsedSeconds / THREE_MIN_SECONDS) + 1
  );
  const totalBeadsInSession = Math.ceil(targetMinutes / 3);

  // Circular progress SVG specifications (radius = 138px, circumference ~ 867px)
  const circleRadius = 138;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circleCircumference - (progressPercent3Min / 100) * circleCircumference;

  // Handle session time selection (capped to max 20 minutes)
  const handleSelectMinutes = (mins: number) => {
    const capped = Math.min(20, mins);
    setIsRunning(false);
    setTargetMinutes(capped);
    setSecondsRemaining(capped * 60);
    setPhaseSeconds(0);
    setPhase('inspire');
    setBreathCount(0);
    setLastAnnouncedMilestoneMinute(0);
    setActiveMilestoneAlert(null);
  };

  // Reset
  const handleReset = () => {
    setIsRunning(false);
    setSecondsRemaining(targetMinutes * 60);
    setPhaseSeconds(0);
    setPhase('inspire');
    setBreathCount(0);
    setLastAnnouncedMilestoneMinute(0);
    setActiveMilestoneAlert(null);
    stopSpeaking();
    setIsSpeakingVerse(false);
  };

  // Main countdown and cycle timer
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (soundEnabled) playChristHymnChord();
            return 0;
          }

          const currentElapsed = targetMinutes * 60 - (prev - 1);
          const currentElapsedMins = Math.floor(currentElapsed / 60);

          // Check if we hit a 3-minute milestone (3, 6, 9, 12, 15, 18, 20)
          const isAtExact3MinBoundary = currentElapsed > 0 && currentElapsed % 180 === 0;
          const isAt20MinMaxBoundary = targetMinutes === 20 && currentElapsed === 1200;

          if (isAtExact3MinBoundary || isAt20MinMaxBoundary) {
            const milestoneMinute = isAt20MinMaxBoundary ? 20 : currentElapsedMins;
            if (milestoneMinute !== lastAnnouncedMilestoneMinute) {
              setLastAnnouncedMilestoneMinute(milestoneMinute);
              const milestoneObj = getMilestoneForMinute(milestoneMinute);
              if (milestoneObj) {
                // Play sacred cantique organ chord! NO harsh ding!
                if (soundEnabled) {
                  playChristHymnChord();
                }
                setActiveMilestoneAlert(milestoneObj);
              }
            }
          }

          return prev - 1;
        });

        setPhaseSeconds((prevPhaseSec) => {
          const nextSec = prevPhaseSec + 1;
          if (nextSec >= PHASE_DURATION) {
            // Flip phase
            setPhase((prevPhase) => {
              const newPhase = prevPhase === 'inspire' ? 'expire' : 'inspire';
              if (soundEnabled) {
                playChimeSound(newPhase);
              }
              if (newPhase === 'inspire') {
                // Completed a full cycle
                setBreathCount((c) => {
                  const updated = c + 1;
                  // Rotate verse every 3 breaths
                  if (updated % 3 === 0) {
                    setActiveVerseIndex((idx) => (idx + 1) % meditationVerses.length);
                  }
                  return updated;
                });
              }
              return newPhase;
            });
            return 0;
          }
          return nextSec;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, soundEnabled, targetMinutes, lastAnnouncedMilestoneMinute, meditationVerses.length]);

  // Optional subtle heartbeat audio loop
  useEffect(() => {
    if (isRunning && soundEnabled && enableHeartSound) {
      heartbeatIntervalRef.current = window.setInterval(() => {
        playHeartbeatSound(0.2);
      }, 1000);
    } else {
      if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
    }

    return () => {
      if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
    };
  }, [isRunning, soundEnabled, enableHeartSound]);

  const toggleSpeech = () => {
    if (isSpeakingVerse) {
      stopSpeaking();
      setIsSpeakingVerse(false);
    } else {
      setIsSpeakingVerse(true);
      speakScripture(
        `${currentVerse.reference}. ${currentVerse.text}`,
        () => setIsSpeakingVerse(false),
        () => setIsSpeakingVerse(false)
      );
    }
  };

  const formatMinutesSeconds = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress of current 5s breath phase
  const phaseProgress = (phaseSeconds / PHASE_DURATION) * 100;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Intro Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
          <Heart className="w-3.5 h-3.5 text-rose-400" />
          <span>Synchronisation Cardiaque & Prière du Souffle</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-amber-50 tracking-tight">
          Cohérence Cardiaque Céleste
        </h2>
        <p className="text-sm text-slate-300">
          Suivez précisément votre séance grâce à la <strong>barre circulaire et la timeline des 3 minutes</strong>. 
          À chaque fin de palier de 3 minutes, un chant d'orgue sacré résonne pour célébrer l'œuvre de Christ.
        </p>
      </div>

      {/* 3-MINUTE BEADS TRACKER (VISUAL MILESTONES) */}
      <ThreeMinuteBeadsTracker
        elapsedSeconds={elapsedSeconds}
        totalDurationSeconds={totalDurationSeconds}
        soundEnabled={soundEnabled}
        activeMilestoneAlert={activeMilestoneAlert}
        onDismissMilestoneAlert={() => setActiveMilestoneAlert(null)}
      />

      {/* Main Breathing Sanctuary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left / Center: Interactive Breathing Orb with Circular Progress Ring & Timeline */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#131b2e] to-[#0c1220] border border-amber-500/20 shadow-2xl relative overflow-hidden">
          {/* Subtle background ambient circles */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-rose-500/5 to-transparent pointer-events-none"></div>

          {/* DEDICATED 3-MINUTE TIME REMAINING HEADER BADGE */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 mb-4 z-10 bg-slate-900/90 border border-amber-500/30 px-4 py-2.5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="text-xs font-bold text-amber-200 uppercase tracking-wider font-mono">
                {targetMinutes === 3
                  ? 'Séance de 3 minutes'
                  : `Bille ${currentBeadNumber} sur ${totalBeadsInSession} (Palier 3 min)`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Temps restant :</span>
              <strong className="text-sm font-mono font-bold text-amber-300 bg-amber-950/50 border border-amber-800/40 px-2.5 py-0.5 rounded-lg">
                {formatMinutesSeconds(remainingInCurrent3Min)}
              </strong>
              <span className="text-[11px] font-mono text-slate-400">({progressPercent3Min}%)</span>
            </div>
          </div>

          {/* CIRCULAR SVG PROGRESS BAR ENCIRCLING THE BREATHING ORB */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center my-2 z-10">
            {/* SVG Circular Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 transform pointer-events-none" viewBox="0 0 320 320">
              <defs>
                <linearGradient id="goldGradientRing" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
                <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background circle track */}
              <circle
                cx="160"
                cy="160"
                r={circleRadius}
                fill="none"
                stroke="#1e293b"
                strokeWidth="7"
                opacity="0.7"
              />

              {/* Animated golden circular progress stroke for 3-minute milestone */}
              <circle
                cx="160"
                cy="160"
                r={circleRadius}
                fill="none"
                stroke="url(#goldGradientRing)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circleCircumference}
                strokeDashoffset={strokeDashoffset}
                filter="url(#goldGlow)"
                className="transition-all duration-700 ease-out"
              />

              {/* 1-Minute tick marks along the 3-minute ring (0', 1', 2', 3') */}
              {[0, 120, 240].map((deg, i) => (
                <line
                  key={i}
                  x1="160"
                  y1="18"
                  x2="160"
                  y2="26"
                  stroke="#fbbf24"
                  strokeWidth="2"
                  transform={`rotate(${deg} 160 160)`}
                  opacity="0.8"
                />
              ))}
            </svg>

            {/* Glowing Breathing Aura Orb in Center */}
            <div
              className="absolute rounded-full transition-all ease-in-out duration-1000 flex items-center justify-center shadow-lg"
              style={{
                width: isRunning
                  ? phase === 'inspire'
                    ? `${150 + (phaseSeconds / PHASE_DURATION) * 70}px`
                    : `${220 - (phaseSeconds / PHASE_DURATION) * 70}px`
                  : '180px',
                height: isRunning
                  ? phase === 'inspire'
                    ? `${150 + (phaseSeconds / PHASE_DURATION) * 70}px`
                    : `${220 - (phaseSeconds / PHASE_DURATION) * 70}px`
                  : '180px',
                background:
                  phase === 'inspire'
                    ? 'radial-gradient(circle, rgba(245,158,11,0.35) 0%, rgba(217,119,6,0.15) 70%, rgba(13,19,31,0.85) 100%)'
                    : 'radial-gradient(circle, rgba(225,29,72,0.30) 0%, rgba(190,18,60,0.12) 70%, rgba(13,19,31,0.85) 100%)',
                boxShadow:
                  phase === 'inspire'
                    ? '0 0 45px rgba(245, 158, 11, 0.35)'
                    : '0 0 35px rgba(225, 29, 72, 0.25)',
              }}
            >
              {/* Core Text Info */}
              <div className="text-center px-4 select-none">
                <p className="text-[11px] uppercase tracking-widest font-mono text-amber-200/90 mb-0.5">
                  {isRunning ? (phase === 'inspire' ? 'Inspiration (5s)' : 'Expiration (5s)') : 'Prêt'}
                </p>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-amber-50">
                  {isRunning
                    ? phase === 'inspire'
                      ? 'Souffle de Vie'
                      : 'Paix de Christ'
                    : 'Commencer'}
                </h3>
                <p className="text-[10px] text-slate-300 mt-1 max-w-[150px] mx-auto italic leading-tight">
                  {isRunning
                    ? phase === 'inspire'
                      ? 'Accueillez l\'oxygène divin'
                      : 'Relâchez les tensions'
                    : 'Cliquez sur Lecture'}
                </p>
              </div>
            </div>

            {/* Countdown seconds indicator in current 5s breath phase */}
            {isRunning && (
              <div className="absolute bottom-4 text-xs font-mono font-bold text-amber-300 bg-slate-900/95 px-3 py-0.5 rounded-full border border-amber-500/40 shadow">
                Souffle : {PHASE_DURATION - phaseSeconds}s
              </div>
            )}
          </div>

          {/* VISUAL 3-MINUTE TIMELINE BAR WITH MARKERS */}
          <div className="w-full max-w-md p-3.5 rounded-2xl bg-[#0b101c] border border-slate-800 space-y-2 my-2 z-10">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-amber-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Timeline des 3 Minutes :
              </span>
              <span className="text-slate-400 font-mono">
                {formatMinutesSeconds(elapsedInCurrent3Min)} / 03:00 ({progressPercent3Min}%)
              </span>
            </div>

            {/* Timeline Progress Bar */}
            <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent3Min}%` }}
              ></div>
            </div>

            {/* Checkpoint labels: 0min, 1min, 2min, 3min */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-0.5">
              <span className={elapsedInCurrent3Min >= 0 ? 'text-amber-300 font-bold' : ''}>0:00 (Départ)</span>
              <span className={elapsedInCurrent3Min >= 60 ? 'text-amber-300 font-bold' : ''}>1:00 (Éveil)</span>
              <span className={elapsedInCurrent3Min >= 120 ? 'text-amber-300 font-bold' : ''}>2:00 (Harmonie)</span>
              <span className={elapsedInCurrent3Min >= 180 ? 'text-amber-400 font-bold' : ''}>3:00 (Cantique)</span>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-3 z-10">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 fill-slate-950" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                  <span>{secondsRemaining < targetMinutes * 60 ? 'Reprendre' : `Lancer la séance (${targetMinutes} min)`}</span>
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Réinitialiser la séance"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Duration Selector Tabs with Billes (Max 20 min) */}
          <div className="mt-5 w-full space-y-2 z-10">
            <span className="text-[11px] uppercase tracking-wider font-mono text-slate-400 block text-center">
              Choisir la durée (tranches de 3 min · Max 20 min) :
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800">
              {[
                { mins: 3, label: '3 min (1 bille standard)' },
                { mins: 6, label: '6 min (2 billes)' },
                { mins: 9, label: '9 min (3 billes)' },
                { mins: 12, label: '12 min (4 billes)' },
                { mins: 15, label: '15 min (5 billes)' },
                { mins: 18, label: '18 min (6 billes)' },
                { mins: 20, label: '20 min (MAX 7 billes)' },
              ].map(({ mins, label }) => (
                <button
                  key={mins}
                  onClick={() => handleSelectMinutes(mins)}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                    targetMinutes === mins
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Extra Audio Heartbeat Toggle */}
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 z-10">
            <input
              type="checkbox"
              id="heartbeatSound"
              checked={enableHeartSound}
              onChange={(e) => setEnableHeartSound(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <label htmlFor="heartbeatSound" className="cursor-pointer hover:text-slate-200">
              Pulsation cardiaque audio (« lub-dub » réaliste)
            </label>
          </div>
        </div>

        {/* Right: Scripture Meditation & Physiological Benefits */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Scripture Card */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-amber-500/30 relative shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Méditation Biblique Synchronisée (LSG 1910)
              </span>
              <button
                onClick={toggleSpeech}
                className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-colors"
                title={isSpeakingVerse ? 'Arrêter la lecture audio' : 'Écouter le verset'}
              >
                <Volume2 className={`w-4 h-4 ${isSpeakingVerse ? 'animate-bounce text-amber-400' : ''}`} />
              </button>
            </div>

            <blockquote className="font-scripture text-lg text-slate-100 italic leading-relaxed mb-3">
              « {currentVerse.text} »
            </blockquote>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
              <span className="font-display font-bold text-amber-300">
                {currentVerse.reference}
              </span>
              <button
                onClick={() => setActiveVerseIndex((i) => (i + 1) % meditationVerses.length)}
                className="text-slate-400 hover:text-amber-200 underline transition-colors"
              >
                Verset suivant &rarr;
              </button>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-amber-950/20 border border-amber-800/30 text-xs text-amber-200/90 leading-normal">
              <strong className="text-amber-300 block mb-0.5">Prière du cœur :</strong>
              {currentVerse.prayer}
            </div>
          </div>

          {/* Biological & Spiritual Cardio Impacts */}
          <div className="p-5 rounded-2xl bg-[#0e1626] border border-slate-800/80 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              Bienfaits pour le Muscle Cardiaque & la Santé
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Baisse de la Pression</strong>
                  <span className="text-slate-400">Diminution prouvée de la tension artérielle systolique.</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Variabilité Cardiaque</strong>
                  <span className="text-slate-400">Renforcement du nerf vague et harmonisation du rythme.</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Réduction du Cortisol</strong>
                  <span className="text-slate-400">Neutralisation de l’hormone du stress qui détériore les artères.</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Apaisement Spirituel</strong>
                  <span className="text-slate-400">Le cœur s’ancre dans la promesse divine de Jean 14:27.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
