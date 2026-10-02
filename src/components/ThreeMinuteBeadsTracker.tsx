import React, { useState } from 'react';
import { CHRIST_MILESTONES, ChristMilestone, getMilestoneForMinute } from '../data/christMilestones';
import { Sparkles, Volume2, BookOpen, Music, Check, X } from 'lucide-react';
import { playChristHymnChord, speakScripture } from '../utils/audio';

interface ThreeMinuteBeadsTrackerProps {
  elapsedSeconds: number;
  totalDurationSeconds: number;
  soundEnabled: boolean;
  activeMilestoneAlert: ChristMilestone | null;
  onDismissMilestoneAlert: () => void;
}

export const ThreeMinuteBeadsTracker: React.FC<ThreeMinuteBeadsTrackerProps> = ({
  elapsedSeconds,
  totalDurationSeconds,
  soundEnabled,
  activeMilestoneAlert,
  onDismissMilestoneAlert,
}) => {
  const [selectedMilestone, setSelectedMilestone] = useState<ChristMilestone | null>(null);

  // Maximum cardio duration is 20 minutes as requested
  const cappedTotalSecs = Math.min(20 * 60, totalDurationSeconds);
  const totalMinutes = Math.ceil(cappedTotalSecs / 60);

  // Available beads for this session: every 3 min (3, 6, 9, 12, 15, 18) and capped at 20 min max
  const activeMilestones = CHRIST_MILESTONES.filter((m) => {
    if (m.minuteMark === 20) {
      return totalMinutes >= 19;
    }
    return m.minuteMark <= totalMinutes;
  });

  const elapsedMinutes = elapsedSeconds / 60;

  return (
    <div className="w-full space-y-4">
      {/* Beads Track Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0d1527] via-[#101b33] to-[#0d1527] border border-amber-500/30 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-200 font-display flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Repère des Billes de Grâce (Toutes les 3 minutes · Max 20 min)
            </h4>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Chaque bille = 3 min · Méditation sur l’œuvre du Christ & Cantique
          </span>
        </div>

        {/* Row of Beads */}
        <div className="relative flex items-center justify-between gap-1 sm:gap-3 py-3 overflow-x-auto scrollbar-none">
          {/* Background Connecting Line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-800 rounded-full z-0">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-rose-400 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (elapsedSeconds / cappedTotalSecs) * 100)}%`,
              }}
            ></div>
          </div>

          {activeMilestones.map((milestone, idx) => {
            const milestoneSecs = milestone.minuteMark * 60;
            const prevMilestoneSecs = idx === 0 ? 0 : activeMilestones[idx - 1].minuteMark * 60;
            const isCompleted = elapsedSeconds >= milestoneSecs;
            const isCurrentlyActive =
              elapsedSeconds >= prevMilestoneSecs && elapsedSeconds < milestoneSecs;

            // Fill percentage within this individual 3-minute interval
            const intervalDuration = milestoneSecs - prevMilestoneSecs;
            const intervalProgress = isCompleted
              ? 100
              : isCurrentlyActive
              ? Math.max(0, Math.min(100, ((elapsedSeconds - prevMilestoneSecs) / intervalDuration) * 100))
              : 0;

            return (
              <div key={milestone.minuteMark} className="relative z-10 flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setSelectedMilestone(milestone)}
                  className={`group relative flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? 'w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/30 ring-2 ring-amber-300'
                      : isCurrentlyActive
                      ? 'w-12 h-12 rounded-full bg-slate-900 border-2 border-amber-400 text-amber-300 shadow-xl shadow-amber-500/20 animate-pulse'
                      : 'w-10 h-10 rounded-full bg-slate-900 border border-slate-700 text-slate-500 hover:border-slate-500'
                  }`}
                  title={`${milestone.title} - Cliquez pour lire`}
                >
                  {/* Circular progress fill for currently active bead */}
                  {isCurrentlyActive && (
                    <div
                      className="absolute inset-0 rounded-full border-2 border-amber-400/30"
                      style={{
                        background: `radial-gradient(circle, rgba(245,158,11,${
                          intervalProgress / 200
                        }) 0%, transparent 70%)`,
                      }}
                    ></div>
                  )}

                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <span className="font-mono text-xs font-bold">
                      {milestone.minuteMark}'
                    </span>
                  )}

                  {/* Tiny badge indicating 3m milestone */}
                  <span className="absolute -bottom-5 text-[10px] font-mono text-slate-400 group-hover:text-amber-300 transition-colors whitespace-nowrap">
                    Bille {idx + 1}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Legend / Helper */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
          <span>
            Temps écoulé : <strong className="text-amber-300 font-mono">{Math.floor(elapsedSeconds / 60)}m {elapsedSeconds % 60}s</strong>
          </span>
          <span className="italic text-amber-200/80 flex items-center gap-1">
            <Music className="w-3 h-3 text-amber-400" />
            Accords d'orgue céleste & cantique joué à chaque bille
          </span>
        </div>
      </div>

      {/* POPUP / MODAL: ACTIVE 3-MINUTE MILESTONE ALERT (When a bead completes!) */}
      {activeMilestoneAlert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="max-w-lg w-full rounded-3xl bg-gradient-to-b from-[#131e36] to-[#0c1220] border-2 border-amber-400/80 p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button
              onClick={onDismissMilestoneAlert}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Sparkles className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-amber-400 font-semibold block">
                  Bille des 3 Minutes Franchie !
                </span>
                <h3 className="text-xl font-display font-bold text-amber-50">
                  {activeMilestoneAlert.title}
                </h3>
              </div>
            </div>

            {/* Cantique Accent Banner */}
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-600/40 space-y-2">
              <div className="flex items-center justify-between text-xs text-amber-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Music className="w-4 h-4 text-amber-400" />
                  Cantique du Cœur :
                </span>
                <button
                  onClick={() => playChristHymnChord()}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[11px] font-bold transition-colors"
                >
                  Rejouer l'orgue
                </button>
              </div>
              <p className="font-scripture italic text-sm text-amber-100">
                {activeMilestoneAlert.cantiqueExcerpt}
              </p>
            </div>

            {/* Scripture on the Work of Christ */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-amber-300">
                  {activeMilestoneAlert.scriptureRef} (Louis Segond)
                </span>
                <button
                  onClick={() =>
                    speakScripture(
                      `${activeMilestoneAlert.scriptureRef}. ${activeMilestoneAlert.scriptureText}`
                    )
                  }
                  className="p-1.5 rounded-lg text-amber-300 hover:bg-amber-500/20"
                  title="Écouter le verset"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <blockquote className="font-scripture italic text-slate-100 text-sm leading-relaxed">
                « {activeMilestoneAlert.scriptureText} »
              </blockquote>
            </div>

            {/* Spiritual Insight on the Body & Heart */}
            <p className="text-xs text-slate-300 italic leading-relaxed">
              {activeMilestoneAlert.christWorkInsight}
            </p>

            <button
              onClick={onDismissMilestoneAlert}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs tracking-wide shadow-md transition-all"
            >
              Poursuivre la séance avec foi
            </button>
          </div>
        </div>
      )}

      {/* POPUP / MODAL: VIEW ANY BEAD DETAILS WHEN CLICKED */}
      {selectedMilestone && !activeMilestoneAlert && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full rounded-3xl bg-[#111827] border border-amber-500/30 p-6 sm:p-8 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedMilestone(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-sm"
            >
              ✕
            </button>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
                Bille {selectedMilestone.minuteMark} min
              </span>
              <span className="text-xs text-slate-400">{selectedMilestone.theme}</span>
            </div>

            <h3 className="text-xl font-display font-bold text-amber-100">
              {selectedMilestone.title}
            </h3>

            <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-200">
              <div className="flex items-center justify-between mb-1 font-semibold text-amber-400">
                <span className="flex items-center gap-1">
                  <Music className="w-3.5 h-3.5" />
                  Cantique méditatif :
                </span>
                <button
                  onClick={() => playChristHymnChord()}
                  className="text-[11px] underline hover:text-amber-200"
                >
                  Jouer l'accord d'orgue
                </button>
              </div>
              <p className="font-scripture italic">{selectedMilestone.cantiqueExcerpt}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-300">
                  {selectedMilestone.scriptureRef} (Louis Segond)
                </span>
                <button
                  onClick={() =>
                    speakScripture(
                      `${selectedMilestone.scriptureRef}. ${selectedMilestone.scriptureText}`
                    )
                  }
                  className="p-1 text-amber-300 hover:bg-amber-500/20 rounded"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <blockquote className="font-scripture italic text-slate-200">
                « {selectedMilestone.scriptureText} »
              </blockquote>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedMilestone.christWorkInsight}
            </p>

            <button
              onClick={() => setSelectedMilestone(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
