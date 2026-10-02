import React, { useState, useEffect, useRef } from 'react';
import { CARDIO_WORKOUTS, CardioWorkout, WorkoutStep } from '../data/workouts';
import { INTENSITY_DEGREES, IntensityDegree, getDegreeById } from '../data/intensityDegrees';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Volume2, Trophy, Clock, Heart, Shield, Activity, Sparkles, Sliders, CheckCircle2, ChevronRight } from 'lucide-react';
import { playChimeSound, playChristHymnChord, playHeartbeatSound, speakScripture, stopSpeaking } from '../utils/audio';
import { ThreeMinuteBeadsTracker } from './ThreeMinuteBeadsTracker';
import { getMilestoneForMinute, ChristMilestone } from '../data/christMilestones';

interface CardioWorkoutsViewProps {
  soundEnabled: boolean;
}

interface CompletedSession {
  id: string;
  workoutTitle: string;
  date: string;
  durationMinutes: number;
  degreeName: string;
}

export const CardioWorkoutsView: React.FC<CardioWorkoutsViewProps> = ({ soundEnabled }) => {
  const [selectedWorkout, setSelectedWorkout] = useState<CardioWorkout>(CARDIO_WORKOUTS[0]);
  
  // 3 Curated Intensity Degrees (Degré 1: Très Doux, Degré 2: Doux, Degré 3: Modéré)
  const [activeDegreeId, setActiveDegreeId] = useState<'degre-1' | 'degre-2' | 'degre-3'>('degre-2');
  
  // Custom minutes regulator (from 6 min up to 20 min MAX)
  const [customMinutes, setCustomMinutes] = useState<number>(20);

  const [isActiveSession, setIsActiveSession] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [stepSecondsRemaining, setStepSecondsRemaining] = useState<number>(0);
  const [sessionElapsedSeconds, setSessionElapsedSeconds] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  
  // Gentle pacing metronome sound toggle
  const [metronomeSound, setMetronomeSound] = useState<boolean>(false);

  // 3-Minute Milestone tracking
  const [lastAnnouncedMilestoneMinute, setLastAnnouncedMilestoneMinute] = useState<number>(0);
  const [activeMilestoneAlert, setActiveMilestoneAlert] = useState<ChristMilestone | null>(null);

  const [history, setHistory] = useState<CompletedSession[]>(() => {
    try {
      const saved = localStorage.getItem('coeur_vie_cardio_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const timerRef = useRef<number | null>(null);
  const metronomeRef = useRef<number | null>(null);

  const activeDegree = getDegreeById(activeDegreeId);
  const currentStep: WorkoutStep | undefined = selectedWorkout.steps[currentStepIndex];
  const nextStep: WorkoutStep | undefined = selectedWorkout.steps[currentStepIndex + 1];

  const effectiveWorkoutMinutes = Math.min(20, customMinutes);
  const totalWorkoutSeconds = effectiveWorkoutMinutes * 60;

  // Save history on change
  useEffect(() => {
    try {
      localStorage.setItem('coeur_vie_cardio_history', JSON.stringify(history));
    } catch (e) {
      console.warn(e);
    }
  }, [history]);

  // Start selected workout
  const handleStartWorkout = (workout: CardioWorkout, chosenDegreeId?: 'degre-1' | 'degre-2' | 'degre-3') => {
    setSelectedWorkout(workout);
    if (chosenDegreeId) {
      setActiveDegreeId(chosenDegreeId);
    }
    setCustomMinutes(workout.totalDurationMinutes);
    setCurrentStepIndex(0);
    setStepSecondsRemaining(workout.steps[0].durationSeconds);
    setSessionElapsedSeconds(0);
    setLastAnnouncedMilestoneMinute(0);
    setActiveMilestoneAlert(null);
    setIsActiveSession(true);
    setIsPaused(false);
    setIsCompleted(false);
    if (soundEnabled) playChimeSound('interval');
  };

  // Workout runner timer
  useEffect(() => {
    if (isActiveSession && !isPaused && !isCompleted) {
      timerRef.current = window.setInterval(() => {
        // Track overall session elapsed seconds
        setSessionElapsedSeconds((prevElapsed) => {
          const nextElapsed = prevElapsed + 1;
          const currentElapsedMins = Math.floor(nextElapsed / 60);

          // Check if hitting a 3-minute milestone (180s, 360s, 540s, 720s, 900s, 1080s, 1200s)
          const isAtExact3MinBoundary = nextElapsed > 0 && nextElapsed % 180 === 0;
          const isAt20MinMaxBoundary = effectiveWorkoutMinutes === 20 && nextElapsed === 1200;

          if (isAtExact3MinBoundary || isAt20MinMaxBoundary) {
            const milestoneMinute = isAt20MinMaxBoundary ? 20 : currentElapsedMins;
            if (milestoneMinute !== lastAnnouncedMilestoneMinute) {
              setLastAnnouncedMilestoneMinute(milestoneMinute);
              const milestoneObj = getMilestoneForMinute(milestoneMinute);
              if (milestoneObj) {
                // Play sacred cantique organ chord progression! NO harsh ding!
                if (soundEnabled) {
                  playChristHymnChord();
                }
                setActiveMilestoneAlert(milestoneObj);
              }
            }
          }

          // Check if session reached custom maximum minutes
          if (nextElapsed >= effectiveWorkoutMinutes * 60) {
            setIsCompleted(true);
            setIsActiveSession(false);
            if (soundEnabled) playChristHymnChord();

            // Log in history
            const newEntry: CompletedSession = {
              id: Date.now().toString(),
              workoutTitle: selectedWorkout.title,
              date: new Date().toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              }),
              durationMinutes: effectiveWorkoutMinutes,
              degreeName: activeDegree.shortName
            };
            setHistory((h) => [newEntry, ...h]);
          }

          return nextElapsed;
        });

        // Track current step seconds
        setStepSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Advance to next step
            if (currentStepIndex < selectedWorkout.steps.length - 1) {
              const nextIndex = currentStepIndex + 1;
              setCurrentStepIndex(nextIndex);
              if (soundEnabled) playChimeSound('interval');
              return selectedWorkout.steps[nextIndex].durationSeconds;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActiveSession, isPaused, isCompleted, currentStepIndex, selectedWorkout, soundEnabled, lastAnnouncedMilestoneMinute, effectiveWorkoutMinutes, activeDegree.shortName]);

  // Gentle metronome audio pulse for chosen cadence
  useEffect(() => {
    if (isActiveSession && !isPaused && soundEnabled && metronomeSound) {
      const intervalMs = Math.round(60000 / activeDegree.metronomeBpm);
      metronomeRef.current = window.setInterval(() => {
        playHeartbeatSound(0.18);
      }, intervalMs);
    } else {
      if (metronomeRef.current) clearInterval(metronomeRef.current);
    }

    return () => {
      if (metronomeRef.current) clearInterval(metronomeRef.current);
    };
  }, [isActiveSession, isPaused, soundEnabled, metronomeSound, activeDegree.metronomeBpm]);

  const handleSkipNext = () => {
    if (currentStepIndex < selectedWorkout.steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setStepSecondsRemaining(selectedWorkout.steps[nextIndex].durationSeconds);
      if (soundEnabled) playChimeSound('interval');
    }
  };

  const handleSkipPrev = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      setStepSecondsRemaining(selectedWorkout.steps[prevIndex].durationSeconds);
    }
  };

  const handleExitWorkout = () => {
    setIsActiveSession(false);
    setIsPaused(false);
    stopSpeaking();
  };

  const formatSecs = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get active step instruction based on selected degree
  const getActiveInstruction = (step: WorkoutStep) => {
    switch (activeDegreeId) {
      case 'degre-1':
        return step.instructionDegre1;
      case 'degre-2':
        return step.instructionDegre2;
      case 'degre-3':
        return step.instructionDegre3;
    }
  };

  const getActiveCadence = (step: WorkoutStep) => {
    switch (activeDegreeId) {
      case 'degre-1':
        return step.cadenceDegre1;
      case 'degre-2':
        return step.cadenceDegre2;
      case 'degre-3':
        return step.cadenceDegre3;
    }
  };

  const getActiveTargetBpm = (step: WorkoutStep) => {
    switch (activeDegreeId) {
      case 'degre-1':
        return step.targetBpmDegre1;
      case 'degre-2':
        return step.targetBpmDegre2;
      case 'degre-3':
        return step.targetBpmDegre3;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* View Header */}
      {!isActiveSession && !isCompleted && (
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Réglage Doux de l'Intensité & des Minutes (Max 20 min)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-amber-50">
            Cardio Doux & Respectueux du Cœur
          </h2>
          <p className="text-sm text-slate-300">
            Fini les rythmes trop rapides ! Choisissez parmi les <strong>3 degrés d’intensité bien distincts</strong> et 
            ajustez la durée en toute douceur jusqu’à <strong>20 minutes maximum</strong>, jalonné par les billes de 3 minutes.
          </p>
        </div>
      )}

      {/* 3 DEGREES OF INTENSITY SELECTOR BAR */}
      {!isActiveSession && !isCompleted && (
        <div className="p-6 rounded-3xl bg-[#0d1527] border border-amber-500/30 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-display font-bold text-base text-amber-100 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-500/20" />
                Sélectionnez Votre Degré d'Intensité (3 Niveaux Clairs)
              </h3>
              <p className="text-xs text-slate-400">
                Chaque niveau adapte la cadence, les exercices et le rythme cardiaque cible.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/40 border border-amber-800/40 px-2.5 py-1 rounded-xl">
              Niveau actif : {activeDegree.shortName}
            </span>
          </div>

          {/* 3 Degree Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {INTENSITY_DEGREES.map((degree) => {
              const isSelected = activeDegreeId === degree.id;
              return (
                <button
                  key={degree.id}
                  type="button"
                  onClick={() => setActiveDegreeId(degree.id)}
                  className={`text-left p-4 rounded-2xl border transition-all space-y-2.5 relative ${
                    isSelected
                      ? `${degree.colorClass.bg} ${degree.colorClass.border} ring-2 ring-amber-400/40 shadow-lg`
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-lg border ${degree.colorClass.badge}`}>
                      {degree.shortName}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                  </div>

                  <h4 className="font-display font-bold text-sm text-slate-100">
                    {degree.name}
                  </h4>

                  <p className="text-xs text-slate-300 leading-snug">
                    {degree.tagline}
                  </p>

                  <div className="pt-2 border-t border-slate-800/60 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Pouls cible :</span>
                      <strong className={`font-mono ${degree.colorClass.text}`}>{degree.targetBpm}</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Cadence :</span>
                      <strong className="font-mono text-slate-300">{degree.recommendedCadence}</strong>
                    </div>
                  </div>

                  <div className="text-[10px] text-amber-200/80 italic font-scripture pt-1">
                    {degree.biblicalPromise}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Smooth Minutes Regulator (Slider from 6 min to 20 min MAX) */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Réglage de la durée souhaitée : <strong className="text-amber-300 font-mono text-sm">{customMinutes} minutes (Max 20 min)</strong>
              </span>
              <p className="text-[11px] text-slate-400">
                Correspond à {Math.ceil(customMinutes / 3)} billes de 3 minutes sur le parcours.
              </p>
            </div>

            {/* Stepper buttons for 6, 9, 12, 15, 18, 20 min */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800">
              {[6, 9, 12, 15, 18, 20].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setCustomMinutes(mins)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-xl transition-all ${
                    customMinutes === mins
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mins === 20 ? '20\' (Max)' : `${mins}'`}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE WORKOUT RUNNER SCREEN */}
      {isActiveSession && currentStep && (
        <div className="max-w-3xl mx-auto rounded-3xl bg-gradient-to-b from-[#11192b] to-[#0c1220] border border-amber-500/30 p-6 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Top Workout metadata bar */}
          <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-4">
            <div>
              <span className="text-amber-400 uppercase tracking-wider font-semibold font-mono">
                {selectedWorkout.title}
              </span>
              <p className="text-slate-400">
                Étape {currentStepIndex + 1} sur {selectedWorkout.steps.length} · Durée : {effectiveWorkoutMinutes} min max
              </p>
            </div>
            <button
              onClick={handleExitWorkout}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Quitter la séance
            </button>
          </div>

          {/* Live Intensity Degree Switcher during session! */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-300 font-semibold">
              Degré d'intensité en direct :
            </span>
            <div className="flex items-center gap-1.5">
              {INTENSITY_DEGREES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setActiveDegreeId(d.id)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                    activeDegreeId === d.id
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {d.shortName}
                </button>
              ))}
            </div>

            {/* Metronome audio toggle */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 border-l border-slate-800 pl-3">
              <input
                type="checkbox"
                id="metronome"
                checked={metronomeSound}
                onChange={(e) => setMetronomeSound(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="metronome" className="cursor-pointer hover:text-slate-200">
                Pulsation guidée ({activeDegree.metronomeBpm} pas/min)
              </label>
            </div>
          </div>

          {/* 3-MINUTE BEADS TRACKER INSIDE WORKOUT RUNNER */}
          <ThreeMinuteBeadsTracker
            elapsedSeconds={sessionElapsedSeconds}
            totalDurationSeconds={totalWorkoutSeconds}
            soundEnabled={soundEnabled}
            activeMilestoneAlert={activeMilestoneAlert}
            onDismissMilestoneAlert={() => setActiveMilestoneAlert(null)}
          />

          {/* Large Countdown & Pulse */}
          <div className="text-center space-y-2 py-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className={`text-xs px-2.5 py-0.5 rounded-full border ${activeDegree.colorClass.badge}`}>
                {activeDegree.shortName}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Pouls conseillé : {getActiveTargetBpm(currentStep)}
              </span>
            </div>

            <div className="font-mono text-5xl sm:text-6xl font-bold tracking-tight text-amber-100 flex items-center justify-center gap-2">
              <span>{formatSecs(stepSecondsRemaining)}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-display font-bold text-amber-50 mt-2">
              {currentStep.name}
            </h3>

            {/* Active instruction adapted to selected degree */}
            <p className="text-sm text-slate-200 max-w-lg mx-auto mt-2 leading-relaxed bg-slate-900/70 p-4 rounded-2xl border border-amber-500/20 shadow-inner">
              {getActiveInstruction(currentStep)}
            </p>

            <p className="text-xs text-amber-300 font-mono italic mt-1">
              Cadence douce conseillée : {getActiveCadence(currentStep)}
            </p>
          </div>

          {/* Step Scripture Banner */}
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-700/40 relative">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-400">
                  Méditation pendant l’effort (Louis Segond)
                </span>
                <p className="font-scripture italic text-sm text-amber-100 leading-snug">
                  « {currentStep.verseSnippet} »
                </p>
                <span className="text-xs font-bold text-amber-300 block">
                  — {currentStep.verseRef}
                </span>
              </div>
              <button
                onClick={() => speakScripture(`${currentStep.verseRef}. ${currentStep.verseSnippet}`)}
                className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-colors shrink-0"
                title="Écouter le verset de l'intervalle"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Next exercise preview */}
          {nextStep && (
            <div className="text-xs text-slate-400 flex items-center justify-between px-2 pt-1">
              <span>À suivre : <strong className="text-slate-200">{nextStep.name}</strong> ({nextStep.durationSeconds}s)</span>
              <span className="text-slate-500 font-mono">{getActiveTargetBpm(nextStep)}</span>
            </div>
          )}

          {/* Step Progress indicators */}
          <div className="flex items-center gap-1.5 w-full pt-1">
            {selectedWorkout.steps.map((st, i) => (
              <div
                key={st.id}
                className={`h-2 flex-1 rounded-full transition-all ${
                  i < currentStepIndex
                    ? 'bg-amber-400'
                    : i === currentStepIndex
                    ? 'bg-amber-500/90 animate-pulse'
                    : 'bg-slate-800'
                }`}
                title={st.name}
              ></div>
            ))}
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={handleSkipPrev}
              disabled={currentStepIndex === 0}
              className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition-colors"
              title="Étape précédente"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 active:scale-95 transition-all"
            >
              {isPaused ? (
                <>
                  <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                  <span>Reprendre</span>
                </>
              ) : (
                <>
                  <Pause className="w-5 h-5 fill-slate-950" />
                  <span>Pause</span>
                </>
              )}
            </button>

            <button
              onClick={handleSkipNext}
              disabled={currentStepIndex === selectedWorkout.steps.length - 1}
              className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition-colors"
              title="Étape suivante"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* COMPLETED WORKOUT CELEBRATION */}
      {isCompleted && (
        <div className="max-w-2xl mx-auto rounded-3xl bg-[#111827] border border-amber-500/40 p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest font-mono text-amber-400">
              Séance achevée avec persévérance & douceur
            </span>
            <h3 className="text-3xl font-display font-bold text-amber-50">
              « J'ai combattu le bon combat »
            </h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Vous avez complété <strong>{selectedWorkout.title}</strong> ({effectiveWorkoutMinutes} minutes au <strong>{activeDegree.name}</strong>). 
              Votre cœur et vos vaisseaux ont été stimulés dans le respect de vos forces.
            </p>
          </div>

          <blockquote className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 font-scripture italic text-amber-200/90 text-sm">
            « Ne savez-vous pas que votre corps est le temple du Saint-Esprit qui est en vous? Glorifiez donc Dieu dans votre corps. »
            <span className="block mt-1 font-sans text-xs font-bold text-amber-400 not-italic">
              1 Corinthiens 6:19-20 (Louis Segond)
            </span>
          </blockquote>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => handleStartWorkout(selectedWorkout, activeDegreeId)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Refaire cette séance</span>
            </button>

            <button
              onClick={() => {
                setIsCompleted(false);
                setIsActiveSession(false);
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-md"
            >
              <span>Retour au catalogue</span>
            </button>
          </div>
        </div>
      )}

      {/* WORKOUT CATALOG GRID */}
      {!isActiveSession && !isCompleted && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CARDIO_WORKOUTS.map((workout) => (
              <div
                key={workout.id}
                className="flex flex-col justify-between rounded-3xl bg-[#0f172a]/90 border border-slate-800 hover:border-amber-500/40 p-6 sm:p-7 transition-all hover:shadow-xl group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
                      {workout.beadsCount} billes de grâce
                    </span>
                    <span className="text-xs font-mono font-semibold text-amber-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {workout.totalDurationMinutes} min max
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-display font-bold text-amber-100 group-hover:text-amber-300 transition-colors">
                      {workout.title}
                    </h3>
                    <p className="text-xs text-amber-400/90 font-medium mt-0.5">
                      {workout.biblicalTheme}
                    </p>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {workout.description}
                    </p>
                  </div>

                  {/* Beads Visual Preview for this workout */}
                  <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
                    <span className="text-[11px] font-mono text-slate-400 block font-semibold">
                      Repères des 3 min avec cantiques :
                    </span>
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: workout.beadsCount }).map((_, bIdx) => (
                        <div
                          key={bIdx}
                          className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold"
                          title={`Bille ${bIdx + 1} (${(bIdx + 1) * 3} min)`}
                        >
                          {bIdx === 6 ? '20\'' : `${(bIdx + 1) * 3}'`}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                    <p>
                      <strong className="text-slate-300">Recommandé pour :</strong> {workout.idealFor}
                    </p>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => handleStartWorkout(workout, activeDegreeId)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500 hover:to-amber-600 text-amber-200 hover:text-slate-950 border border-amber-500/30 hover:border-transparent font-bold text-xs tracking-wide transition-all shadow-sm group-hover:shadow-amber-500/10"
                  >
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                    <span>Lancer en {activeDegree.shortName}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Completed workouts history */}
          {history.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  Historique de vos séances de cardio doux
                </h4>
                <span className="text-xs text-slate-500">{history.length} séance(s) effectuée(s)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {history.slice(0, 6).map((h) => (
                  <div
                    key={h.id}
                    className="p-3 rounded-xl bg-[#0b0f17] border border-slate-800 text-xs flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-amber-200">{h.workoutTitle}</p>
                      <span className="text-[10px] text-slate-500">{h.date} · {h.degreeName}</span>
                    </div>
                    <span className="font-mono text-xs text-amber-400 font-bold">
                      {h.durationMinutes} min
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
