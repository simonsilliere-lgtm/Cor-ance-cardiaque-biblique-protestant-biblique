import React, { useState, useEffect } from 'react';
import { BIBLE_VERSES, BibleVerse, CATEGORIES_CONFIG } from '../data/bibleVerses';
import { Search, Bookmark, BookmarkCheck, Volume2, Copy, Check, Sparkles, BookOpen, Layers } from 'lucide-react';
import { speakScripture } from '../utils/audio';

export const VerseLibraryView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('coeur_vie_favorite_verses');
      return saved ? JSON.parse(saved) : ['prov-4-23', 'esaie-53-5'];
    } catch {
      return ['prov-4-23'];
    }
  });
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [flashcardMode, setFlashcardMode] = useState<boolean>(false);
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);
  const [revealVerse, setRevealVerse] = useState<boolean>(false);

  // Save favorites
  useEffect(() => {
    try {
      localStorage.setItem('coeur_vie_favorite_verses', JSON.stringify(favorites));
    } catch (e) {
      console.warn(e);
    }
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopy = (text: string, ref: string, id: string) => {
    navigator.clipboard.writeText(`« ${text} » — ${ref} (Bible Louis Segond 1910)`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredVerses = BIBLE_VERSES.filter((verse) => {
    const matchesCategory =
      selectedCategory === 'all' || verse.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      verse.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      verse.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      verse.cardioInsight.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFav = onlyFavorites ? favorites.includes(verse.id) : true;
    return matchesCategory && matchesSearch && matchesFav;
  });

  const flashcardVerse = filteredVerses[flashcardIndex % (filteredVerses.length || 1)];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Intro Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Bible Louis Segond (LSG 1910)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-amber-50">
          Trésor Biblique du Cœur & de la Guérison
        </h2>
        <p className="text-sm text-slate-300">
          Explorez les passages de la Bible Louis Segond consacrés au cœur, au souffle, 
          à l'endurance et au relèvement divin face aux maladies corporelles et de l'âme.
        </p>

        {/* Mode switcher: List vs Flashcard */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={() => setFlashcardMode(false)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
              !flashcardMode
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            Bibliothèque complète ({filteredVerses.length})
          </button>
          <button
            onClick={() => {
              setFlashcardMode(true);
              setRevealVerse(false);
            }}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
              flashcardMode
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Mode Mémorisation</span>
          </button>
        </div>
      </div>

      {/* FLASHCARD MEMORIZATION MODE */}
      {flashcardMode && flashcardVerse && (
        <div className="max-w-xl mx-auto rounded-3xl bg-[#0f172a] border border-amber-500/30 p-8 text-center space-y-6 shadow-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-amber-400 font-semibold">
              Verset { (flashcardIndex % filteredVerses.length) + 1 } sur {filteredVerses.length}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {flashcardVerse.categoryLabel}
            </span>
          </div>

          <div className="py-6 space-y-4">
            <h3 className="text-2xl font-display font-bold text-amber-100">
              {flashcardVerse.reference}
            </h3>

            {revealVerse ? (
              <blockquote className="font-scripture italic text-xl text-amber-50 leading-relaxed max-w-md mx-auto transition-all">
                « {flashcardVerse.text} »
              </blockquote>
            ) : (
              <div
                onClick={() => setRevealVerse(true)}
                className="p-8 rounded-2xl bg-slate-900/90 border border-dashed border-slate-700 hover:border-amber-400/60 cursor-pointer transition-all space-y-2"
              >
                <Sparkles className="w-6 h-6 text-amber-400 mx-auto" />
                <p className="text-xs text-slate-300 font-medium">
                  Récitez le verset dans votre cœur, puis cliquez ici pour vérifier le texte Louis Segond.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setRevealVerse(!revealVerse);
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            >
              {revealVerse ? 'Masquer' : 'Révéler le texte'}
            </button>

            <button
              onClick={() => speakScripture(`${flashcardVerse.reference}. ${flashcardVerse.text}`)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300"
              title="Écouter le verset"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setFlashcardIndex((i) => i + 1);
                setRevealVerse(false);
              }}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
            >
              Verset suivant &rarr;
            </button>
          </div>
        </div>
      )}

      {/* FULL BROWSER MODE */}
      {!flashcardMode && (
        <div className="space-y-6">
          {/* Search bar & filter controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher par mot-clé (ex: cœur, maladie, force, souffle, paix)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => setOnlyFavorites(!onlyFavorites)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  onlyFavorites
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 fill-current" />
                <span>Mes favoris ({favorites.length})</span>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800 scrollbar-none">
            {CATEGORIES_CONFIG.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Verses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredVerses.map((verse) => {
              const isFav = favorites.includes(verse.id);
              return (
                <div
                  key={verse.id}
                  className="rounded-3xl bg-[#0f172a]/90 border border-slate-800 hover:border-amber-500/30 p-6 flex flex-col justify-between space-y-4 shadow-xl transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-mono tracking-wider font-semibold text-amber-400">
                        {verse.categoryLabel}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleFavorite(verse.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isFav ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                          }`}
                          title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                        >
                          {isFav ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleCopy(verse.text, verse.reference, verse.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
                          title="Copier le verset"
                        >
                          {copiedId === verse.id ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => speakScripture(`${verse.reference}. ${verse.text}`)}
                          className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-500/20 transition-colors"
                          title="Écouter le verset"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-display font-bold text-lg text-amber-100">
                      {verse.reference}
                    </h3>

                    <blockquote className="font-scripture italic text-base sm:text-lg text-slate-100 leading-relaxed">
                      « {verse.text} »
                    </blockquote>

                    <div className="pt-2 border-t border-slate-800/80 text-xs space-y-2">
                      <div className="text-slate-300">
                        <strong className="text-emerald-300 block mb-0.5">Portée Cardio & Santé :</strong>
                        {verse.cardioInsight}
                      </div>

                      <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/30 text-amber-200/90 italic">
                        <strong className="text-amber-400 block not-italic mb-0.5">Prière inspirée :</strong>
                        « {verse.prayer} »
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
