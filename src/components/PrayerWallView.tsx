import React, { useState, useEffect } from 'react';
import { Heart, Flame, Plus, Shield, Volume2, Sparkles, Filter, Check, Send } from 'lucide-react';
import { speakScripture } from '../utils/audio';
import { IllnessTopic } from '../data/illnessesWorld';

export interface PrayerItem {
  id: string;
  author: string;
  beneficiary: string;
  category: string;
  illnessDesc: string;
  verseRef: string;
  verseText: string;
  date: string;
  prayersCount: number;
  hasPrayed: boolean;
}

const INITIAL_PRAYERS: PrayerItem[] = [
  {
    id: 'pr-1',
    author: 'Un disciple',
    beneficiary: 'Pour tous les patients en unité de cardiologie',
    category: 'Maladies Cardiaques',
    illnessDesc: 'Nous remettons à Dieu les personnes hospitalisées pour infarctus, arythmie sévère et insuffisance cardiaque dans les hôpitaux de France et du monde entier.',
    verseRef: 'Psaume 73:26',
    verseText: 'Ma chair et mon cœur peuvent défaillir: Dieu est le rocher de mon cœur et mon partage pour toujours.',
    date: 'Il y a 2 heures',
    prayersCount: 42,
    hasPrayed: false
  },
  {
    id: 'pr-2',
    author: 'Marie',
    beneficiary: 'Pour Thomas (34 ans)',
    category: 'Convalescence & Rééducation',
    illnessDesc: 'Rééducation motrice difficile après un grave accident. Que Dieu fortifie ses poumons et restaure son tonus cardiaque pour remarcher.',
    verseRef: 'Ésaïe 40:29',
    verseText: 'Il donne de la force à celui qui est fatigué, et il augmente la vigueur de celui qui tombe en défaillance.',
    date: 'Hier',
    prayersCount: 28,
    hasPrayed: false
  },
  {
    id: 'pr-3',
    author: 'David',
    beneficiary: 'Pour les personnes alitées souffrant de douleurs chroniques',
    category: 'Douleurs Chroniques',
    illnessDesc: 'Face à la lassitude des traitements lourds et des nuits sans sommeil, que la paix de Christ inonde chaque chambre de malade.',
    verseRef: '2 Corinthiens 12:9',
    verseText: 'Ma grâce te suffit, car ma puissance s\'accomplplit dans la faiblesse.',
    date: 'Il y a 3 jours',
    prayersCount: 35,
    hasPrayed: false
  },
  {
    id: 'pr-4',
    author: 'Esther',
    beneficiary: 'Pour ma grand-mère hospitalisée pour détresse respiratoire',
    category: 'Affections Pulmonaires',
    illnessDesc: 'Que le souffle de vie divin dégage ses bronches et que les soignants soient guidés avec sagesse.',
    verseRef: 'Genèse 2:7',
    verseText: 'Il souffla dans ses narines un souffle de vie et l\'homme devint un être vivant.',
    date: 'Il y a 4 jours',
    prayersCount: 19,
    hasPrayed: false
  }
];

interface PrayerWallViewProps {
  initialTopicToIntercede?: IllnessTopic | null;
  onClearInitialTopic?: () => void;
}

export const PrayerWallView: React.FC<PrayerWallViewProps> = ({
  initialTopicToIntercede,
  onClearInitialTopic
}) => {
  const [prayers, setPrayers] = useState<PrayerItem[]>(() => {
    try {
      const saved = localStorage.getItem('coeur_vie_prayer_wall');
      return saved ? JSON.parse(saved) : INITIAL_PRAYERS;
    } catch {
      return INITIAL_PRAYERS;
    }
  });

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [beneficiary, setBeneficiary] = useState<string>('');
  const [category, setCategory] = useState<string>('Maladies Cardiaques');
  const [illnessDesc, setIllnessDesc] = useState<string>('');
  const [verseRef, setVerseRef] = useState<string>('Ésaïe 53:5');
  const [verseText, setVerseText] = useState<string>(
    'C\'est par ses meurtrissures que nous sommes guéris.'
  );

  // If a topic was clicked from IllnessesWorldView, pre-populate
  useEffect(() => {
    if (initialTopicToIntercede) {
      setBeneficiary(initialTopicToIntercede.intercessionSubject);
      setCategory(initialTopicToIntercede.title);
      setIllnessDesc(`Prière pour ceux qui souffrent de : ${initialTopicToIntercede.title}. ${initialTopicToIntercede.prayer}`);
      setVerseRef(initialTopicToIntercede.keyVerse.reference);
      setVerseText(initialTopicToIntercede.keyVerse.text);
      setShowAddModal(true);
      onClearInitialTopic?.();
    }
  }, [initialTopicToIntercede, onClearInitialTopic]);

  // Save prayers
  useEffect(() => {
    try {
      localStorage.setItem('coeur_vie_prayer_wall', JSON.stringify(prayers));
    } catch (e) {
      console.warn(e);
    }
  }, [prayers]);

  const handlePrayFor = (id: string) => {
    setPrayers((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const hasAlready = item.hasPrayed;
          return {
            ...item,
            hasPrayed: !hasAlready,
            prayersCount: hasAlready ? item.prayersCount - 1 : item.prayersCount + 1
          };
        }
        return item;
      })
    );
  };

  const handleCreatePrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!beneficiary.trim() || !illnessDesc.trim()) return;

    const newPrayer: PrayerItem = {
      id: Date.now().toString(),
      author: 'Vous',
      beneficiary: beneficiary.trim(),
      category: category,
      illnessDesc: illnessDesc.trim(),
      verseRef: verseRef || 'Psaume 103:3',
      verseText: verseText || 'C\'est lui qui guérit toutes tes maladies.',
      date: 'À l\'instant',
      prayersCount: 1,
      hasPrayed: true
    };

    setPrayers([newPrayer, ...prayers]);
    setShowAddModal(false);
    setBeneficiary('');
    setIllnessDesc('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Intro Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
          <Heart className="w-3.5 h-3.5 fill-rose-500" />
          <span>Solidarité & Prière pour les Malades du Monde</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-amber-50">
          Mur d'Intercession & de Compassion
        </h2>
        <p className="text-sm text-slate-300">
          « La prière de la foi sauvera le malade, et le Seigneur le relèvera » (Jacques 5:15). 
          Portez dans votre cœur ceux qui luttent contre la maladie et allumez une veilleuse de prière.
        </p>

        <div className="pt-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wide transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Déposer une intention de prière pour un malade</span>
          </button>
        </div>
      </div>

      {/* Modal Form for new prayer intent */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-display font-bold text-lg text-amber-100 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                Déposer une Intention de Prière
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePrayer} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Pour qui priez-vous ? (Nom, parent, groupe hospitalier)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pour mon père atteint d'insuffisance cardiaque"
                  value={beneficiary}
                  onChange={(e) => setBeneficiary(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Catégorie de l'épreuve
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-400 focus:outline-none"
                >
                  <option value="Maladies Cardiaques">Maladies Cardiaques & Hypertension</option>
                  <option value="Douleurs Chroniques">Douleurs Chroniques & Articulations</option>
                  <option value="Affections Pulmonaires">Affections Pulmonaires & Souffle</option>
                  <option value="Convalescence & Rééducation">Convalescence & Rééducation</option>
                  <option value="Angoisse & Dépression">Angoisse, Tachycardie & Moral</option>
                  <option value="Soignants & Hôpitaux">Soignants & Milieu Hospitalier</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Description & Sujet d'intercession
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Décrivez brièvement la situation pour laquelle intercéder..."
                  value={illnessDesc}
                  onChange={(e) => setIllnessDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-400 focus:outline-none resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Référence biblique de soutien
                  </label>
                  <input
                    type="text"
                    value={verseRef}
                    onChange={(e) => setVerseRef(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Extrait du verset (LSG)
                  </label>
                  <input
                    type="text"
                    value={verseText}
                    onChange={(e) => setVerseText(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publier l'intention</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prayers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {prayers.map((item) => (
          <div
            key={item.id}
            className={`rounded-3xl p-6 border transition-all space-y-4 flex flex-col justify-between ${
              item.hasPrayed
                ? 'bg-[#131d33] border-amber-500/40 shadow-lg shadow-amber-500/5'
                : 'bg-[#0f172a]/90 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-amber-400 uppercase tracking-wider">
                  {item.category}
                </span>
                <span className="text-slate-500">{item.date}</span>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-display font-bold text-amber-50">
                  {item.beneficiary}
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {item.illnessDesc}
                </p>
              </div>

              {/* Biblical Promise Box */}
              <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-800/30 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-amber-300">{item.verseRef}</span>
                  <button
                    onClick={() => speakScripture(`${item.verseRef}. ${item.verseText}`)}
                    className="p-1 text-amber-400 hover:bg-amber-500/20 rounded"
                    title="Écouter le verset"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <blockquote className="font-scripture italic text-slate-200">
                  « {item.verseText} »
                </blockquote>
              </div>
            </div>

            {/* Prayer Action Button */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => handlePrayFor(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  item.hasPrayed
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold scale-[1.02]'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                <Flame className={`w-3.5 h-3.5 ${item.hasPrayed ? 'fill-current text-slate-950' : 'text-amber-400'}`} />
                <span>{item.hasPrayed ? 'J\'ai prié pour ce malade' : 'Prier pour cette intention'}</span>
              </button>

              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-500/40" />
                <strong className="text-slate-200">{item.prayersCount}</strong> prières
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
