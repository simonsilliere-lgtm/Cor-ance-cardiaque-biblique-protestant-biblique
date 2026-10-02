import React, { useState } from 'react';
import { Heart, Wind, Activity, ShieldPlus, Flame, BookOpen, Volume2, VolumeX, Sword, Headphones, Music, Pause, Play, MessageSquareQuote } from 'lucide-react';
import { isAmbiencePlaying, startBiblicalAmbience, stopBiblicalAmbience } from '../utils/biblicalAmbience';

export type ActiveTab = 'coherence' | 'cardio' | 'bpm' | 'maladies' | 'spirituelles' | 'chatbot' | 'priere' | 'temoignages' | 'versets';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  soundEnabled,
  setSoundEnabled,
}) => {
  const [ambientActive, setAmbientActive] = useState<boolean>(isAmbiencePlaying());

  const toggleAmbienceHeader = () => {
    if (ambientActive) {
      stopBiblicalAmbience();
      setAmbientActive(false);
    } else {
      startBiblicalAmbience('harpe', 0.35);
      setAmbientActive(true);
    }
  };

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; shortLabel: string }[] = [
    {
      id: 'coherence',
      label: 'Cohérence Cardiaque',
      shortLabel: 'Cohérence',
      icon: <Wind className="w-4 h-4" />
    },
    {
      id: 'cardio',
      label: 'Stimulation Cardio',
      shortLabel: 'Cardio',
      icon: <Flame className="w-4 h-4" />
    },
    {
      id: 'chatbot',
      label: 'Élie — Veilleur & Écoute',
      shortLabel: 'Écoute / IA',
      icon: <Headphones className="w-4 h-4" />
    },
    {
      id: 'bpm',
      label: 'Mesure Pouls / BPM',
      shortLabel: 'Pouls BPM',
      icon: <Activity className="w-4 h-4" />
    },
    {
      id: 'temoignages',
      label: 'Témoignages de Foi',
      shortLabel: 'Témoignages',
      icon: <MessageSquareQuote className="w-4 h-4" />
    },
    {
      id: 'maladies',
      label: 'Maladies du Corps',
      shortLabel: 'Maladies Corps',
      icon: <ShieldPlus className="w-4 h-4" />
    },
    {
      id: 'spirituelles',
      label: 'Maladies Spirituelles',
      shortLabel: 'Âme & Combat',
      icon: <Sword className="w-4 h-4" />
    },
    {
      id: 'priere',
      label: 'Mur d\'Intercession',
      shortLabel: 'Intercession',
      icon: <Heart className="w-4 h-4" />
    },
    {
      id: 'versets',
      label: 'Versets Louis Segond',
      shortLabel: 'Bible LSG',
      icon: <BookOpen className="w-4 h-4" />
    }
  ];

  return (
    <header className="border-b border-slate-800/80 bg-[#0d131f]/95 backdrop-blur-md sticky top-0 z-50">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 via-rose-500/20 to-amber-600/10 border border-amber-500/30 text-rose-400 shadow-sm">
            <Heart className="w-5 h-5 fill-rose-500/30 stroke-rose-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-[#0d131f]"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-lg sm:text-xl font-bold tracking-wide text-amber-100">
                CŒUR & VIE
              </h1>
              <span className="text-[10px] tracking-widest uppercase font-mono px-1.5 py-0.5 rounded bg-amber-900/30 text-amber-300 border border-amber-700/40">
                Louis Segond
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Stimulation cardiovasculaire & réconfort divin face aux maladies
            </p>
          </div>
        </div>

        {/* Global Controls & Verse snippet */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden xl:flex items-center gap-2 text-xs text-slate-400 italic max-w-xs truncate border-l border-slate-800 pl-3">
            <span className="text-amber-400 font-semibold not-italic">Pr 4:23 :</span>
            « Garde ton cœur plus que toute autre chose... »
          </div>

          {/* Ambient Music Button */}
          <button
            onClick={toggleAmbienceHeader}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              ambientActive
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 shadow-sm shadow-amber-500/10'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800'
            }`}
            title={ambientActive ? 'Arrêter la musique d\'ambiance biblique' : 'Jouer la musique d\'ambiance (Harpe de David)'}
          >
            <Music className={`w-3.5 h-3.5 ${ambientActive ? 'text-amber-400 animate-bounce' : ''}`} />
            <span className="hidden sm:inline">{ambientActive ? 'Harpe Active' : 'Musique Biblique'}</span>
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              soundEnabled
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-200 hover:bg-amber-500/25'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800'
            }`}
            title={soundEnabled ? 'Sons et battements activés' : 'Sons coupés'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Audio</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Muet</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-1 scrollbar-none" aria-label="Sections principales">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap rounded-lg transition-all ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-200 border-b-2 border-amber-400 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <span className={isActive ? 'text-amber-400' : 'text-slate-500'}>
                  {item.icon}
                </span>
                <span className="hidden md:inline">{item.label}</span>
                <span className="inline md:hidden">{item.shortLabel}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

