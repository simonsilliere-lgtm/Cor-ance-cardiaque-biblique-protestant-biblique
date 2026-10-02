import React, { useState } from 'react';
import { ILLNESS_TOPICS, IllnessTopic } from '../data/illnessesWorld';
import { ShieldAlert, Heart, Wind, Stethoscope, Volume2, Sparkles, HandHeart, BookOpen, Copy, Check } from 'lucide-react';
import { speakScripture, stopSpeaking } from '../utils/audio';

interface IllnessesWorldViewProps {
  onIntercedeForTopic: (topic: IllnessTopic) => void;
}

export const IllnessesWorldView: React.FC<IllnessesWorldViewProps> = ({ onIntercedeForTopic }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Toutes les épreuves' },
    { id: 'cardio', label: 'Cœur & Hypertension' },
    { id: 'chronique', label: 'Douleurs Chroniques' },
    { id: 'respiratoire', label: 'Affections Pulmonaires' },
    { id: 'anxiete', label: 'Anxiété & Tachycardie' },
    { id: 'convalescence', label: 'Convalescence & Alités' },
    { id: 'hopital', label: 'Hôpitaux & Soignants' },
  ];

  const filteredTopics = selectedCategory === 'all'
    ? ILLNESS_TOPICS
    : ILLNESS_TOPICS.filter((t) => t.category === selectedCategory);

  const handleCopyPrayer = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Hero Presentation */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span>Compassion Chrétienne & Guérison selon Louis Segond</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-display font-bold text-amber-50">
          Face aux Maladies qui Frappent le Monde
        </h2>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Dans un monde où tant de nos semblables souffrent de cardiopathies, de douleurs incurables, 
          d'essoufflement et d’angoisses nocturnes, la Parole de Dieu n’est pas silencieuse. 
          Découvrez les promesses de guérison, l’espérance biblique et des conseils cardio adaptés.
        </p>

        {/* Global Key Scripture Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/20 border border-amber-600/30 text-left flex items-start gap-4">
          <BookOpen className="w-5 h-5 text-amber-400 shrink-0 mt-1" />
          <div className="space-y-1">
            <blockquote className="font-scripture italic text-base sm:text-lg text-amber-100 leading-snug">
              « Mais il était blessé pour nos péchés, brisé pour nos iniquités; le châtiment qui nous donne la paix est tombé sur lui, et c'est par ses meurtrissures que nous sommes guéris. »
            </blockquote>
            <span className="font-sans text-xs font-bold text-amber-300 block">
              Ésaïe 53:5 (Bible Louis Segond 1910)
            </span>
          </div>
        </div>
      </div>

      {/* Category filter pills (interactive buttons) */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800 scrollbar-none max-w-4xl mx-auto">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all ${
              selectedCategory === c.id
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid of Illnesses, Biblical Light & Cardio Solutions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            className="flex flex-col justify-between rounded-3xl bg-[#0f172a]/95 border border-slate-800/90 hover:border-amber-500/30 p-6 sm:p-7 space-y-6 shadow-xl transition-all"
          >
            <div className="space-y-4">
              {/* Category indicator & title */}
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                  {topic.subtitle}
                </span>
                <h3 className="text-xl font-display font-bold text-amber-100 mt-1">
                  {topic.title}
                </h3>
              </div>

              {/* Medical context in the world */}
              <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                <strong className="text-slate-200 block mb-1">Réalité médicale dans le monde :</strong>
                {topic.medicalContext}
              </div>

              {/* Biblical light */}
              <div className="text-xs text-amber-200/90 leading-relaxed space-y-1">
                <strong className="text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  La Lumière des Écritures :
                </strong>
                <p>{topic.biblicalLight}</p>
              </div>

              {/* Key Scripture Quote */}
              <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-700/40 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-amber-300">{topic.keyVerse.reference}</span>
                  <button
                    onClick={() => speakScripture(`${topic.keyVerse.reference}. ${topic.keyVerse.text}`)}
                    className="p-1 rounded-md text-amber-300 hover:bg-amber-500/20 transition-colors"
                    title="Écouter le verset"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="font-scripture italic text-slate-100 leading-relaxed">
                  « {topic.keyVerse.text} »
                </p>
              </div>

              {/* Cardio Advice */}
              <div className="text-xs text-emerald-300/90 bg-emerald-950/20 border border-emerald-800/40 p-3 rounded-2xl">
                <strong className="text-emerald-300 block mb-1">Conseil Cardio & Santé :</strong>
                {topic.cardioAdvice}
              </div>

              {/* Prayer */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-rose-300 flex items-center gap-1.5">
                    <HandHeart className="w-3.5 h-3.5" />
                    Prière de relèvement :
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => speakScripture(topic.prayer)}
                      className="p-1 text-slate-400 hover:text-amber-300 rounded"
                      title="Écouter la prière"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleCopyPrayer(topic.prayer, topic.id)}
                      className="p-1 text-slate-400 hover:text-amber-300 rounded"
                      title="Copier la prière"
                    >
                      {copiedId === topic.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="italic text-slate-300 leading-relaxed">
                  « {topic.prayer} »
                </p>
              </div>
            </div>

            {/* CTA: Intercede on prayer wall */}
            <div className="pt-2">
              <button
                onClick={() => onIntercedeForTopic(topic)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800/90 hover:bg-amber-500 hover:text-slate-950 text-amber-200 border border-slate-700 hover:border-amber-400 text-xs font-semibold transition-all"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Porter ce sujet sur le Mur d'Intercession</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
