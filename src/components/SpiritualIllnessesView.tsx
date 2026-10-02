import React, { useState, useEffect } from 'react';
import { SPIRITUAL_ILLNESSES, SpiritualIllness, SpiritualBattleEntry } from '../data/spiritualIllnesses';
import { ShieldCheck, Heart, Sparkles, Volume2, BookOpen, Flame, Plus, CheckCircle, Clock, Trash2, ArrowRight, Sword } from 'lucide-react';
import { speakScripture } from '../utils/audio';

interface SpiritualIllnessesViewProps {
  soundEnabled: boolean;
}

const INITIAL_ENTRIES: SpiritualBattleEntry[] = [
  {
    id: 'entry-1',
    illnessId: 'decouragement',
    illnessName: 'Le Découragement & L\'Abattement',
    date: 'Aujourd\'hui 08:45',
    intensityLevel: 3,
    notes: 'Fatigue physique pesante après une nuit courte. Tentation de baisser les bras face aux difficultés du travail.',
    appliedPrescription: 'Marche de 15 minutes + proclamation d\'Ésaïe 40:29-31',
    status: 'victoire',
    scriptureMeditated: 'Ésaïe 40:29-31'
  },
  {
    id: 'entry-2',
    illnessId: 'doute',
    illnessName: 'Le Doute & L\'Incrédulité',
    date: 'Hier',
    intensityLevel: 2,
    notes: 'Inquiétude pour un proche malade. Prière fervente avec remise du fardeau.',
    appliedPrescription: 'Méditation de Marc 9:24 et cohérence cardiaque',
    status: 'progression',
    scriptureMeditated: 'Marc 9:24'
  }
];

export const SpiritualIllnessesView: React.FC<SpiritualIllnessesViewProps> = () => {
  const [activeSubTab, setActiveSubTab] = useState<'guide' | 'journal'>('guide');
  const [selectedIllness, setSelectedIllness] = useState<SpiritualIllness>(SPIRITUAL_ILLNESSES[0]);
  
  // Battle Journal state
  const [entries, setEntries] = useState<SpiritualBattleEntry[]>(() => {
    try {
      const saved = localStorage.getItem('coeur_vie_spiritual_battles');
      return saved ? JSON.parse(saved) : INITIAL_ENTRIES;
    } catch {
      return INITIAL_ENTRIES;
    }
  });

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [formIllnessId, setFormIllnessId] = useState<string>(SPIRITUAL_ILLNESSES[0].id);
  const [formIntensity, setFormIntensity] = useState<number>(3);
  const [formNotes, setFormNotes] = useState<string>('');
  const [formPrescription, setFormPrescription] = useState<string>('');
  const [formStatus, setFormStatus] = useState<SpiritualBattleEntry['status']>('en_combat');

  // Save entries in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('coeur_vie_spiritual_battles', JSON.stringify(entries));
    } catch (e) {
      console.warn(e);
    }
  }, [entries]);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const illnessObj = SPIRITUAL_ILLNESSES.find((i) => i.id === formIllnessId) || SPIRITUAL_ILLNESSES[0];
    
    const newEntry: SpiritualBattleEntry = {
      id: Date.now().toString(),
      illnessId: illnessObj.id,
      illnessName: illnessObj.name,
      date: new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }),
      intensityLevel: formIntensity,
      notes: formNotes.trim() || 'Combat remis entre les mains du Seigneur.',
      appliedPrescription: formPrescription.trim() || illnessObj.practicalPrescription[0],
      status: formStatus,
      scriptureMeditated: illnessObj.keyVerse.reference
    };

    setEntries([newEntry, ...entries]);
    setShowAddModal(false);
    setFormNotes('');
    setFormPrescription('');
  };

  const handleToggleVictory = (id: string) => {
    setEntries((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'victoire' ? 'progression' : 'victoire';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const handleDeleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((item) => item.id !== id));
  };

  const victoriesCount = entries.filter((e) => e.status === 'victoire').length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
          <Sword className="w-3.5 h-3.5 text-amber-400" />
          <span>Combat Spirituel & Santé de l'Âme</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-display font-bold text-amber-50">
          Maladies Spirituelles & Remèdes Bibliques
        </h2>
        <p className="text-sm text-slate-300">
          Tout comme le muscle cardiaque peut souffrir d'hypertension, notre âme peut être attaquée 
          par le doute, le découragement, le péché ou l'amertume. Suivez vos combats et saisissez 
          les ordonnances de la Bible Louis Segond pour triompher par la foi.
        </p>

        {/* Sub-tab navigation */}
        <div className="pt-2 flex items-center justify-center">
          <div className="inline-flex p-1 bg-slate-900/90 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveSubTab('guide')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                activeSubTab === 'guide'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Diagnostic & Remèdes Bibliques</span>
            </button>

            <button
              onClick={() => setActiveSubTab('journal')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                activeSubTab === 'journal'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Journal de Combat Spirituel ({entries.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: GUIDE DES MALADIES SPIRITUELLES */}
      {activeSubTab === 'guide' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Selector List */}
          <div className="lg:col-span-4 space-y-2">
            <h3 className="text-xs uppercase tracking-wider font-mono text-slate-400 px-2 mb-3">
              Sélectionnez une lutte de l'âme :
            </h3>
            <div className="space-y-2">
              {SPIRITUAL_ILLNESSES.map((illness) => {
                const isSelected = selectedIllness.id === illness.id;
                return (
                  <button
                    key={illness.id}
                    onClick={() => setSelectedIllness(illness)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-100 shadow-md'
                        : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <h4 className="font-display font-bold text-sm text-amber-50">
                        {illness.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {illness.tagline}
                      </p>
                    </div>
                    <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-amber-400 translate-x-1' : 'text-slate-600'}`} />
                  </button>
                );
              })}
            </div>

            {/* Quick Action Button */}
            <div className="pt-4">
              <button
                onClick={() => {
                  setFormIllnessId(selectedIllness.id);
                  setShowAddModal(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Consigner ce combat dans mon journal</span>
              </button>
            </div>
          </div>

          {/* Right: Detailed Spiritual Diagnostic & Biblical Remedy Card */}
          <div className="lg:col-span-8 rounded-3xl bg-[#0f172a] border border-amber-500/30 p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Header of selected card */}
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                Ordonnance Spirituelle selon Louis Segond
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-amber-50 mt-1">
                {selectedIllness.name}
              </h3>
              <p className="text-xs text-slate-300 mt-1 italic">
                {selectedIllness.tagline}
              </p>
            </div>

            {/* Symptoms & Impact on Physical Heart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <strong className="text-amber-300 block font-semibold">
                  Symptômes spirituels de l'épreuve :
                </strong>
                <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                  {selectedIllness.spiritualSymptoms.map((s, idx) => (
                    <li key={idx} className="leading-snug">{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-800/40 space-y-2">
                <strong className="text-rose-300 block font-semibold flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  Impact sur le Cœur Physique :
                </strong>
                <p className="text-slate-300 leading-relaxed">
                  {selectedIllness.impactOnPhysicalHeart}
                </p>
              </div>
            </div>

            {/* Biblical Diagnosis */}
            <div className="text-xs text-slate-200 leading-relaxed bg-[#131d31] p-4 rounded-2xl border border-slate-800 space-y-1">
              <strong className="text-amber-300 block">Diagnostic de la Parole de Dieu :</strong>
              <p>{selectedIllness.biblicalDiagnosis}</p>
            </div>

            {/* Key Verse Box (LSG 1910) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/25 border border-amber-600/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-sm text-amber-300">
                  {selectedIllness.keyVerse.reference} (LSG 1910)
                </span>
                <button
                  onClick={() => speakScripture(`${selectedIllness.keyVerse.reference}. ${selectedIllness.keyVerse.text}`)}
                  className="p-1.5 rounded-lg text-amber-300 hover:bg-amber-500/20 transition-colors"
                  title="Écouter le verset"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <blockquote className="font-scripture italic text-base sm:text-lg text-amber-50 leading-relaxed">
                « {selectedIllness.keyVerse.text} »
              </blockquote>
            </div>

            {/* Supporting Verses */}
            {selectedIllness.supportingVerses.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">
                  Autres versets de fortification :
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {selectedIllness.supportingVerses.map((sv, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-amber-300">{sv.reference}</span>
                        <button
                          onClick={() => speakScripture(`${sv.reference}. ${sv.text}`)}
                          className="p-1 text-slate-400 hover:text-amber-300"
                          title="Écouter"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-scripture italic text-slate-300">« {sv.text} »</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Practical Prescriptions */}
            <div className="space-y-2">
              <strong className="text-xs uppercase tracking-wider text-emerald-300 block flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Ordonnance Pratique & Exercices de Foi :
              </strong>
              <div className="space-y-2 text-xs">
                {selectedIllness.practicalPrescription.map((step, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                    <span className="font-mono text-amber-400 font-bold shrink-0">{idx + 1}.</span>
                    <span className="text-slate-200 leading-snug">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Declaration of Victory & Prayer */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
              <div className="space-y-1">
                <strong className="text-amber-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  Déclaration de Victoire :
                </strong>
                <p className="text-slate-200 font-semibold italic">
                  « {selectedIllness.victoryDeclaration} »
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-rose-300">Prière du Cœur :</strong>
                  <button
                    onClick={() => speakScripture(selectedIllness.prayer)}
                    className="p-1 text-slate-400 hover:text-rose-300"
                    title="Écouter la prière"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-slate-300 italic leading-relaxed">
                  « {selectedIllness.prayer} »
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: MON JOURNAL DE COMBAT SPIRITUEL */}
      {activeSubTab === 'journal' && (
        <div className="space-y-6">
          {/* Header Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Sword className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-mono font-bold text-amber-100">{entries.length}</span>
                <p className="text-xs text-slate-400">Combats consignés</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-mono font-bold text-emerald-200">{victoriesCount}</span>
                <p className="text-xs text-slate-400">Victoires célébrées par la grâce</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-amber-400 block font-semibold">
                  Armure de Dieu
                </span>
                <p className="text-xs text-slate-300 mt-1">« Prenez l'épée de l'Esprit qui est la parole de Dieu »</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow"
              >
                + Noter un combat
              </button>
            </div>
          </div>

          {/* Entries List */}
          {entries.length === 0 ? (
            <div className="text-center py-12 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
              <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
              <h3 className="font-display font-bold text-lg text-slate-200">
                Aucun combat consigné pour l'instant
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Notez vos luttes intérieures contre le doute, le découragement ou la rancune pour 
                constater les victoires que Dieu opère jour après jour.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-2 px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                Ajouter mon premier combat
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                    entry.status === 'victoire'
                      ? 'bg-[#11231a] border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                      : 'bg-[#0f172a] border-slate-800'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-300 font-display">
                        {entry.illnessName}
                      </span>
                      <span className="text-slate-500 text-[11px]">{entry.date}</span>
                    </div>

                    {/* Intensity meter */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <span>Intensité de la lutte :</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <div
                            key={lvl}
                            className={`w-3.5 h-2 rounded-sm ${
                              lvl <= entry.intensityLevel
                                ? entry.intensityLevel >= 4
                                  ? 'bg-rose-500'
                                  : 'bg-amber-400'
                                : 'bg-slate-800'
                            }`}
                          ></div>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                      {entry.notes}
                    </p>

                    <div className="text-xs space-y-1">
                      <span className="text-slate-400 block text-[11px]">
                        Remède appliqué : <strong className="text-emerald-300">{entry.appliedPrescription}</strong>
                      </span>
                      <span className="text-slate-400 block text-[11px]">
                        Verset médité : <strong className="text-amber-300">{entry.scriptureMeditated}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => handleToggleVictory(entry.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        entry.status === 'victoire'
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{entry.status === 'victoire' ? 'Victoire remportée !' : 'Marquer comme victoire'}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                      title="Supprimer cette note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: ADD BATTLE ENTRY */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-display font-bold text-lg text-amber-100 flex items-center gap-2">
                <Sword className="w-4 h-4 text-amber-400" />
                Consigner une lutte de l'âme
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEntry} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Maladie spirituelle / Épreuve traversée
                </label>
                <select
                  value={formIllnessId}
                  onChange={(e) => setFormIllnessId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-400 focus:outline-none"
                >
                  {SPIRITUAL_ILLNESSES.map((ill) => (
                    <option key={ill.id} value={ill.id}>
                      {ill.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Intensité du combat intérieur (1 = faible, 5 = intense) : {formIntensity}/5
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formIntensity}
                  onChange={(e) => setFormIntensity(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Description de la situation ou de la tentation
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ce qui pèse sur mon cœur en ce moment..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-400 focus:outline-none resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Action de foi / Remède appliqué
                </label>
                <input
                  type="text"
                  placeholder="Ex: 5 min de cohérence cardiaque + prière d'abandon"
                  value={formPrescription}
                  onChange={(e) => setFormPrescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  État du combat
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormStatus('en_combat')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      formStatus === 'en_combat'
                        ? 'bg-rose-950/60 border-rose-500 text-rose-200 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    En combat
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormStatus('progression')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      formStatus === 'progression'
                        ? 'bg-amber-950/60 border-amber-500 text-amber-200 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    En progrès
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormStatus('victoire')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      formStatus === 'victoire'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    Victoire !
                  </button>
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
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors shadow-md"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
