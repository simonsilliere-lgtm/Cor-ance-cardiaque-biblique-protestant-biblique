import React, { useState, useEffect } from 'react';
import { INITIAL_TESTIMONIES, FaithTestimony, BIBLICAL_TRUTH_VERSES } from '../data/testimonialsData';
import { Sparkles, Heart, Flame, Plus, Volume2, BookOpen, CheckCircle, MessageSquareQuote, Check, X, Send, Scale, ShieldAlert, Trash2 } from 'lucide-react';
import { speakScripture, stopSpeaking } from '../utils/audio';

export const TestimonialsView: React.FC = () => {
  const [testimonies, setTestimonies] = useState<FaithTestimony[]>(() => {
    try {
      const saved = localStorage.getItem('coeur_vie_user_real_testimonies');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure old mock IDs (t-1, t-2, t-3, t-4) are completely filtered out
        return parsed.filter((item: FaithTestimony) => !['t-1', 't-2', 't-3', 't-4'].includes(item.id));
      }
      return INITIAL_TESTIMONIES;
    } catch {
      return INITIAL_TESTIMONIES;
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);

  // Form states
  const [formAuthor, setFormAuthor] = useState<string>('');
  const [formLocation, setFormLocation] = useState<string>('');
  const [formCategory, setFormCategory] = useState<FaithTestimony['category']>('cardio');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formStory, setFormStory] = useState<string>('');
  const [formVerseRef, setFormVerseRef] = useState<string>('Psaume 103:2-3');
  const [formVerseText, setFormVerseText] = useState<string>('C\'est lui qui pardonne toutes tes iniquités, qui guérit toutes tes maladies.');
  const [formPractice, setFormPractice] = useState<string>('Cohérence Cardiaque & Cardio Doux');
  
  // Mandatory Biblical Truth Pledge
  const [solemnTruthPledge, setSolemnTruthPledge] = useState<boolean>(false);
  const [pledgeError, setPledgeError] = useState<boolean>(false);

  // Save testimonies in localStorage under a dedicated clean key
  useEffect(() => {
    try {
      localStorage.setItem('coeur_vie_user_real_testimonies', JSON.stringify(testimonies));
    } catch (e) {
      console.warn(e);
    }
  }, [testimonies]);

  const handleAmen = (id: string) => {
    setTestimonies((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const hasSaid = item.hasSaidAmen;
          return {
            ...item,
            hasSaidAmen: !hasSaid,
            amenCount: hasSaid ? item.amenCount - 1 : item.amenCount + 1,
          };
        }
        return item;
      })
    );
  };

  const handleDeleteTestimony = (id: string) => {
    setTestimonies((prev) => prev.filter((item) => item.id !== id));
    if (activeSpeechId === id) {
      stopSpeaking();
      setActiveSpeechId(null);
    }
  };

  const handleListenTestimony = (item: FaithTestimony) => {
    if (activeSpeechId === item.id) {
      stopSpeaking();
      setActiveSpeechId(null);
    } else {
      setActiveSpeechId(item.id);
      const textToSpeak = `Témoignage authentique de ${item.author}. ${item.title}. ${item.story}. Verset biblique de soutien : ${item.keyVerseRef}. ${item.keyVerseText}. Gloire à Dieu pour sa vérité.`;
      speakScripture(
        textToSpeak,
        () => setActiveSpeechId(null),
        () => setActiveSpeechId(null)
      );
    }
  };

  const handleSubmitTestimony = (e: React.FormEvent) => {
    e.preventDefault();
    if (!solemnTruthPledge) {
      setPledgeError(true);
      return;
    }
    setPledgeError(false);

    if (!formAuthor.trim() || !formTitle.trim() || !formStory.trim()) return;

    let catLabel = 'Cœur & Tension';
    if (formCategory === 'convalescence') catLabel = 'Convalescence & Force';
    if (formCategory === 'angoisse') catLabel = 'Palpitations & Angoisse';
    if (formCategory === 'douleur') catLabel = 'Douleurs Chroniques';
    if (formCategory === 'paix') catLabel = 'Paix Intérieure';

    const newTestimony: FaithTestimony = {
      id: Date.now().toString(),
      author: formAuthor.trim(),
      location: formLocation.trim() || undefined,
      category: formCategory,
      categoryLabel: catLabel,
      title: formTitle.trim(),
      story: formStory.trim(),
      keyVerseRef: formVerseRef.trim() || 'Ésaïe 53:5',
      keyVerseText: formVerseText.trim() || 'C\'est par ses meurtrissures que nous sommes guéris.',
      appPracticeUsed: formPractice.trim() || 'Usage réel de l\'application',
      amenCount: 1,
      hasSaidAmen: true,
      date: 'À l\'instant',
      attestedUnderGod: true,
    };

    setTestimonies([newTestimony, ...testimonies]);
    setShowModal(false);
    setFormAuthor('');
    setFormLocation('');
    setFormTitle('');
    setFormStory('');
    setSolemnTruthPledge(false);
  };

  const filteredTestimonies =
    selectedCategory === 'all'
      ? testimonies
      : testimonies.filter((t) => t.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'Tous les témoignages réels' },
    { id: 'cardio', label: 'Cœur & Tension' },
    { id: 'convalescence', label: 'Convalescence & Force' },
    { id: 'angoisse', label: 'Palpitations & Angoisse' },
    { id: 'douleur', label: 'Douleurs Chroniques' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Banner with Biblical Truth Charter */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
          <Scale className="w-3.5 h-3.5 text-amber-400" />
          <span>Vérité Biblique & Jugement de Dieu (Exode 20:16)</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-display font-bold text-amber-50">
          Témoignages Réels des Utilisateurs
        </h2>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Sur cette application, <strong>aucun faux témoignage n'est inventé</strong>. 
          Comme le prescrit la Sainte Bible : <em>« Tu ne porteras point de faux témoignage »</em> (Exode 20:16) et 
          <em>« Au jour du jugement, les hommes rendront compte de toute parole vaine »</em> (Matthieu 12:36).
          Seuls les récits réellement vécus par des utilisateurs sont admis ici devant Dieu.
        </p>

        {/* Solemn Scripture Charter */}
        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-600/40 text-left space-y-2 text-xs">
          <div className="flex items-center gap-2 text-amber-300 font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>La Parole de Dieu sur la Vérité du Témoignage :</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 italic font-scripture">
            <p>« Les lèvres fausses sont en horreur à l'Éternel, mais ceux qui agissent avec vérité lui sont agréables. » — Pr 12:22</p>
            <p>« Le faux témoin ne restera point impuni, et celui qui dit des mensonges n'échappera pas. » — Pr 19:5</p>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Déposer mon vrai témoignage sous le regard de Dieu</span>
          </button>
        </div>
      </div>

      {/* Category filter pills */}
      {testimonies.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800 scrollbar-none max-w-3xl mx-auto">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all ${
                selectedCategory === c.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      {/* EMPTY STATE: ZERO FAKE TESTIMONIES */}
      {testimonies.length === 0 ? (
        <div className="max-w-2xl mx-auto rounded-3xl bg-[#0f172a] border border-dashed border-amber-500/30 p-8 sm:p-12 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 flex items-center justify-center mx-auto">
            <Scale className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest font-mono text-amber-400 font-semibold">
              Registre Sacré Ouvert — Zéro Faux Récit
            </span>
            <h3 className="text-2xl font-display font-bold text-amber-50">
              Aucun faux témoignage n'a été pré-rempli
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
              Nous refusons formellement les témoignages fictifs ou inventés pour tromper autrui. 
              Selon la Bible, chaque parole sera jugée dans la vérité.
              Si vous êtes un utilisateur réel et que la cohérence cardiaque, la marche douce ou 
              les versets de cette application vous ont apporté soulagement, guérison ou réconfort, 
              venez glorifier le Seigneur en vérité.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              Être le premier utilisateur à témoigner
            </button>
          </div>
        </div>
      ) : (
        /* REAL TESTIMONIES GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTestimonies.map((item) => {
            const isSpeaking = activeSpeechId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-3xl bg-[#0f172a]/95 border border-amber-500/25 p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-xl transition-all"
              >
                <div className="space-y-3">
                  {/* Verified Truth Badge */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1 font-mono text-amber-400 font-bold text-[11px] bg-amber-950/40 border border-amber-700/40 px-2 py-0.5 rounded-md">
                      <Scale className="w-3 h-3 text-amber-400" />
                      Attesté en vérité devant Dieu
                    </span>
                    <span className="text-slate-500 text-[11px]">{item.date}</span>
                  </div>

                  {/* Title & Author */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-amber-50 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Par un utilisateur réel : <strong className="text-slate-200">{item.author}</strong>
                      {item.location ? ` (${item.location})` : ''}
                    </p>
                  </div>

                  {/* The story */}
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                    {item.story}
                  </p>

                  {/* Scripture Support Card */}
                  <div className="p-3.5 rounded-2xl bg-amber-950/25 border border-amber-800/40 text-xs space-y-1">
                    <span className="font-display font-bold text-amber-300 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      Verset Louis Segond vécu : {item.keyVerseRef}
                    </span>
                    <blockquote className="font-scripture italic text-slate-100">
                      « {item.keyVerseText} »
                    </blockquote>
                  </div>

                  {/* App Practice Badge */}
                  <div className="text-[11px] text-emerald-300/90 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Pratique vécue sur le site : <strong>{item.appPracticeUsed}</strong></span>
                  </div>
                </div>

                {/* Bottom Actions: Listen Audio, Amen Reaction, Delete */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleListenTestimony(item)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isSpeaking
                          ? 'bg-amber-500 text-slate-950 font-bold animate-pulse'
                          : 'bg-slate-800 hover:bg-slate-700 text-amber-200'
                      }`}
                      title="Écouter le témoignage à voix haute"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isSpeaking ? 'En écoute...' : 'Écouter'}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteTestimony(item.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 transition-colors"
                      title="Supprimer mon témoignage"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleAmen(item.id)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      item.hasSaidAmen
                        ? 'bg-amber-500/20 border border-amber-400 text-amber-200 shadow-sm'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    <Flame className={`w-3.5 h-3.5 ${item.hasSaidAmen ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
                    <span>Gloire à Dieu ({item.amenCount})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: SUBMIT NEW TESTIMONY WITH SOLEMN OATH */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-display font-bold text-lg text-amber-100 flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-400" />
                Déposer mon Témoignage en Vérité
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Solemn reminder */}
            <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-800/50 text-xs text-rose-200 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-rose-300">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Avertissement selon la Bible :
              </span>
              <p>
                « Tu ne porteras point de faux témoignage » (Exode 20:16). Dieu voit toute chose et chaque parole sera jugée. 
                Ne déposez que ce que vous avez réellement vécu personnellement sur cette application.
              </p>
            </div>

            <form onSubmit={handleSubmitTestimony} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Votre prénom ou nom (Utilisateur réel) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: David S., 45 ans"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Ville ou Pays (Optionnel)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Lyon, France"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Catégorie du bienfait reçu
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as FaithTestimony['category'])}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-400 focus:outline-none"
                >
                  <option value="cardio">Cœur, Régulation de Tension & Circulation</option>
                  <option value="convalescence">Convalescence & Reprise de la Marche</option>
                  <option value="angoisse">Apaisement des Palpitations & Délivrance de l'Angoisse</option>
                  <option value="douleur">Soulagement des Douleurs Corporelles & Rhumatismes</option>
                  <option value="paix">Paix Intérieure & Foi Renouvelée</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Titre du témoignage réel *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ma tension s'est apaisée et j'ai retrouvé le sommeil"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Votre récit véridique (Ce que vous avez vécu avec l'application) *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Décrivez avec sincérité votre expérience : les exercices pratiqués, la prière, le verset et le résultat bienfaisant..."
                  value={formStory}
                  onChange={(e) => setFormStory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-400 focus:outline-none resize-none leading-relaxed"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Verset biblique qui vous a porté
                  </label>
                  <input
                    type="text"
                    value={formVerseRef}
                    onChange={(e) => setFormVerseRef(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Extrait du verset (Louis Segond)
                  </label>
                  <input
                    type="text"
                    value={formVerseText}
                    onChange={(e) => setFormVerseText(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Pratique de l'application utilisée
                </label>
                <input
                  type="text"
                  placeholder="Ex: Cohérence Cardiaque 6 min + Marche Douce Degré 1"
                  value={formPractice}
                  onChange={(e) => setFormPractice(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* MANDATORY SOLEMN PLEDGE CHECKBOX */}
              <div className={`p-3.5 rounded-2xl border transition-all ${
                pledgeError ? 'bg-rose-950/40 border-rose-500' : 'bg-slate-900/90 border-amber-500/40'
              }`}>
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={solemnTruthPledge}
                    onChange={(e) => {
                      setSolemnTruthPledge(e.target.checked);
                      if (e.target.checked) setPledgeError(false);
                    }}
                    className="mt-0.5 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0 cursor-pointer shrink-0"
                  />
                  <span className="text-[11px] text-amber-200 leading-snug">
                    <strong className="block text-amber-300 mb-0.5">Engagement solennel devant Dieu :</strong>
                    « Devant le Dieu souverain qui sonde mon cœur et devant qui tout homme sera jugé selon la vérité (Matthieu 12:36), 
                    j'atteste sur l'honneur que ce témoignage est mon expérience réelle vécue, sans mensonge ni invention. »
                  </span>
                </label>
                {pledgeError && (
                  <p className="text-[11px] text-rose-400 font-semibold mt-2">
                    Veuillez cocher cet engagement de vérité pour publier votre témoignage.
                  </p>
                )}
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publier en vérité</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
