import React, { useState, useEffect, useRef } from 'react';
import { Heart, Activity, Plus, Trash2, Shield, Sparkles, AlertCircle, Info } from 'lucide-react';
import { playHeartbeatSound } from '../utils/audio';

interface BpmTrackerViewProps {
  soundEnabled: boolean;
}

interface BpmRecord {
  id: string;
  bpm: number;
  date: string;
  context: string;
  zone: string;
  feeling: string;
}

export const BpmTrackerView: React.FC<BpmTrackerViewProps> = ({ soundEnabled }) => {
  const [tapTimestamps, setTapTimestamps] = useState<number[]>([]);
  const [currentBpm, setCurrentBpm] = useState<number | null>(null);
  const [isTapping, setIsTapping] = useState<boolean>(false);
  const [manualBpm, setManualBpm] = useState<string>('');
  const [selectedContext, setSelectedContext] = useState<string>('Repos & Prière');
  const [records, setRecords] = useState<BpmRecord[]>(() => {
    try {
      const saved = localStorage.getItem('coeur_vie_bpm_records');
      return saved ? JSON.parse(saved) : [
        {
          id: '1',
          bpm: 68,
          date: 'Aujourd\'hui 09:30',
          context: 'Prière matinale',
          zone: 'Repos & Paix',
          feeling: 'Cœur calme et confiant en Dieu'
        }
      ];
    } catch {
      return [];
    }
  });

  const resetTimeoutRef = useRef<number | null>(null);

  // Save records
  useEffect(() => {
    try {
      localStorage.setItem('coeur_vie_bpm_records', JSON.stringify(records));
    } catch (e) {
      console.warn(e);
    }
  }, [records]);

  // Handle tap
  const handleTap = () => {
    const now = performance.now();
    if (soundEnabled) {
      playHeartbeatSound(0.35);
    }

    setIsTapping(true);

    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    // Reset tap sequence after 3 seconds of inactivity
    resetTimeoutRef.current = window.setTimeout(() => {
      setTapTimestamps([]);
      setIsTapping(false);
    }, 3000);

    setTapTimestamps((prev) => {
      const updated = [...prev, now].slice(-8); // Keep last 8 taps
      if (updated.length >= 2) {
        const intervals: number[] = [];
        for (let i = 1; i < updated.length; i++) {
          intervals.push(updated[i] - updated[i - 1]);
        }
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const calculatedBpm = Math.round(60000 / avgInterval);
        if (calculatedBpm >= 40 && calculatedBpm <= 220) {
          setCurrentBpm(calculatedBpm);
        }
      }
      return updated;
    });
  };

  // Keyboard shortcut: spacebar tap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        handleTap();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const getBpmZoneInfo = (bpm: number) => {
    if (bpm < 60) {
      return {
        name: 'Repos Profond & Brûlage Lenteur',
        status: 'Basse Fréquence (Bradycardie possible)',
        color: 'text-sky-300',
        bg: 'bg-sky-950/40 border-sky-800/60',
        advice: 'Fréquence normale chez les athlètes ou au repos profond. Veillez à consulter si accompagné de vertiges.'
      };
    } else if (bpm <= 80) {
      return {
        name: 'Repos & Équilibre Physiologique',
        status: 'Rythme Idéal de Repos',
        color: 'text-emerald-300',
        bg: 'bg-emerald-950/40 border-emerald-800/60',
        advice: 'Zone optimale de cohérence cardiaque et de prière paisible. Le cœur s’oxygène sans fatigue artérielle.'
      };
    } else if (bpm <= 100) {
      return {
        name: 'Éveil Circulatoire / Marche Tranquille',
        status: 'Activité Légère',
        color: 'text-amber-300',
        bg: 'bg-amber-950/40 border-amber-800/60',
        advice: 'Bonne stimulation des vaisseaux. Idéal pour les personnes convalescentes ou après un repas.'
      };
    } else if (bpm <= 135) {
      return {
        name: 'Zone Aérobie & Cardio Santé',
        status: 'Cardio Modéré',
        color: 'text-orange-300',
        bg: 'bg-orange-950/40 border-orange-800/60',
        advice: 'Fortifie le muscle cardiaque, nettoie les lipides sanguins et stimule le renouvellement cellulaire.'
      };
    } else {
      return {
        name: 'Zone d\'Endurance Forte / Effort',
        status: 'Cardio Soutenu / Alerte',
        color: 'text-rose-400',
        bg: 'bg-rose-950/40 border-rose-800/60',
        advice: 'Effort intense ou tachycardie de stress. Si vous êtes au repos, respirez lentement et pratiquez la cohérence.'
      };
    }
  };

  const handleSaveCurrentBpm = (bpmToSave: number) => {
    const zoneInfo = getBpmZoneInfo(bpmToSave);
    const newRecord: BpmRecord = {
      id: Date.now().toString(),
      bpm: bpmToSave,
      date: new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }),
      context: selectedContext,
      zone: zoneInfo.name,
      feeling: 'Mesure enregistrée'
    };
    setRecords((prev) => [newRecord, ...prev]);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(manualBpm, 10);
    if (val >= 40 && val <= 220) {
      handleSaveCurrentBpm(val);
      setManualBpm('');
      setCurrentBpm(val);
    }
  };

  const handleDeleteRecord = (id: string) => {
    setRecords((r) => r.filter((rec) => rec.id !== id));
  };

  const activeZone = currentBpm ? getBpmZoneInfo(currentBpm) : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
          <Activity className="w-3.5 h-3.5 text-rose-400" />
          <span>Télémétrie Cardiaque & Tappeur de Pouls</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-amber-50">
          Écoute & Mesure du Cœur
        </h2>
        <p className="text-sm text-slate-300">
          Posez deux doigts sur votre carotide ou votre poignet. Tapez sur le cœur à chaque battement 
          pour connaître votre fréquence cardiaque (BPM) et sa zone physiologique.
        </p>
      </div>

      {/* Main Tap Card & Live Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Interactive Heart Tap Box */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#111827] to-[#0c1220] border border-amber-500/20 shadow-2xl relative text-center">
          <span className="text-xs uppercase font-mono tracking-widest text-slate-400 mb-2">
            Tappez en rythme ou appuyez sur [ESPACE]
          </span>

          {/* Big Interactive Heart Button */}
          <button
            onClick={handleTap}
            className="my-6 relative group focus:outline-none"
            aria-label="Taper pour mesurer le rythme cardiaque"
          >
            <div
              className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full flex items-center justify-center transition-all duration-150 border ${
                isTapping
                  ? 'scale-95 bg-rose-500/25 border-rose-400 shadow-2xl shadow-rose-500/40 ring-4 ring-rose-500/30'
                  : 'bg-rose-950/30 border-rose-700/50 hover:border-amber-400/60 shadow-lg'
              }`}
            >
              <Heart
                className={`w-20 h-20 sm:w-24 sm:h-24 transition-transform duration-100 ${
                  isTapping ? 'scale-110 fill-rose-500 stroke-rose-300' : 'fill-rose-600/40 stroke-rose-400 group-hover:scale-105'
                }`}
              />
            </div>

            <span className="absolute bottom-2 inset-x-0 text-[11px] font-medium text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded-full mx-auto w-max border border-slate-700">
              Tapez ici
            </span>
          </button>

          {/* Measured BPM display */}
          <div className="space-y-1">
            <div className="flex items-baseline justify-center gap-2">
              <span className="font-mono text-5xl sm:text-6xl font-bold text-amber-200">
                {currentBpm !== null ? currentBpm : '--'}
              </span>
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                BPM (Pulsations / min)
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {tapTimestamps.length > 1
                ? `${tapTimestamps.length} battements enregistrés...`
                : 'Tapez au moins 3 à 5 fois de manière régulière'}
            </p>
          </div>

          {/* Context and Save action */}
          {currentBpm && (
            <div className="mt-6 pt-6 border-t border-slate-800 w-full space-y-3">
              <div className="flex items-center justify-center gap-2">
                <select
                  value={selectedContext}
                  onChange={(e) => setSelectedContext(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
                >
                  <option value="Repos & Prière">Au Repos & Prière</option>
                  <option value="Méditation du Souffle">Méditation du Souffle</option>
                  <option value="Après Cardio / Marche">Après Cardio / Marche</option>
                  <option value="Pendant Faiblesse / Maladie">Pendant Faiblesse / Maladie</option>
                  <option value="Moment d'Angoisse">Moment d'Angoisse</option>
                </select>

                <button
                  onClick={() => handleSaveCurrentBpm(currentBpm)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Enregistrer</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Zone interpretation & Biblical guidance */}
        <div className="lg:col-span-6 space-y-6">
          {/* Active Zone card */}
          {activeZone ? (
            <div className={`p-6 rounded-3xl border ${activeZone.bg} space-y-3 shadow-xl backdrop-blur-sm`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest font-semibold text-slate-300">
                  Zone Détectée
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${activeZone.color} bg-black/40`}>
                  {activeZone.status}
                </span>
              </div>

              <h3 className={`text-2xl font-display font-bold ${activeZone.color}`}>
                {activeZone.name}
              </h3>

              <p className="text-xs text-slate-200 leading-relaxed">
                {activeZone.advice}
              </p>

              <div className="pt-3 border-t border-white/10 text-xs text-slate-300 italic font-scripture">
                « L'Éternel est ma force et mon bouclier; en lui mon cœur se confie, et je suis secouru. »
                <span className="block not-italic font-sans font-semibold text-amber-300 text-[11px] mt-0.5">
                  Psaume 28:7
                </span>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="text-sm font-semibold text-amber-200 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400" />
                Comment prendre son pouls manuellement ?
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Placez l'index et le majeur à la base du pouce sur votre poignet ou le long de la trachée sous la mâchoire. 
                Appuyez doucement jusqu'à sentir le battement. Tapez ensuite le cœur ci-contre avec votre autre main.
              </p>
              <div className="pt-2 text-xs text-slate-400">
                <strong className="text-slate-300">Valeurs de référence adulte au repos :</strong> 60 à 80 BPM en moyenne.
              </div>
            </div>
          )}

          {/* Manual Entry Form */}
          <div className="p-5 rounded-2xl bg-[#0d1422] border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Ou saisie manuelle (si vous avez un tensiomètre)
            </h4>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="number"
                min="40"
                max="220"
                placeholder="Ex: 72"
                value={manualBpm}
                onChange={(e) => setManualBpm(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 w-28 focus:border-amber-400 focus:outline-none font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
              >
                Valider
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* History log */}
      {records.length > 0 && (
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-display font-bold text-amber-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              Journal des Mesures Cardiaques
            </h3>
            <span className="text-xs text-slate-500">{records.length} mesure(s)</span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {records.map((r) => (
              <div key={r.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800/90 flex items-center justify-center font-mono font-bold text-amber-300">
                    {r.bpm}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-200">{r.context}</span>
                    <p className="text-[11px] text-slate-400">{r.zone} · {r.date}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteRecord(r.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                  title="Supprimer cette mesure"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
