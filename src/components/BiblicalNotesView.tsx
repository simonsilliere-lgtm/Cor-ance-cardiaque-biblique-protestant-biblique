import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  Pin,
  Search,
  BookOpen,
  Sparkles,
  Share2,
  Send,
  Heart,
  FileText,
  Check,
  RotateCcw,
  Copy,
  PenTool,
} from 'lucide-react';
import { speakScripture, stopSpeaking } from '../utils/audio';

export interface BiblicalNote {
  id: string;
  title: string;
  content: string;
  category: 'temoignage' | 'priere' | 'promesse' | 'sante' | 'meditation';
  categoryLabel: string;
  color: 'gold' | 'sapphire' | 'emerald' | 'amber' | 'rose';
  verseRef?: string;
  isPinned: boolean;
  createdAt: string;
  transcribedWithVoice: boolean;
}

const INITIAL_NOTES: BiblicalNote[] = [
  {
    id: 'n-1',
    title: 'Promesse pour mon souffle et mes artères',
    content: 'Psaume 103: « Il rassasie de biens ta vieillesse, et te fait rajeunir comme l\'aigle. » Chaque matin après ma cohérence cardiaque de 3 minutes, je remercie le Créateur pour chaque battement régulier de mon cœur.',
    category: 'promesse',
    categoryLabel: 'Promesse & Verset',
    color: 'gold',
    verseRef: 'Psaume 103:5',
    isPinned: true,
    createdAt: 'Hier à 09:30',
    transcribedWithVoice: false,
  },
  {
    id: 'n-2',
    title: 'Ma note dictée au micro après ma marche',
    content: 'J\'ai marché 15 minutes en Degré 1 aujourd\'hui. Mes jambes étaient légères et mon cœur est resté à 82 BPM dans un calme total. Gloire à Jésus pour le retour de ma force.',
    category: 'temoignage',
    categoryLabel: 'Récit de Foi & Guérison',
    color: 'emerald',
    verseRef: 'Ésaïe 40:29',
    isPinned: false,
    createdAt: 'Aujourd\'hui à 11:15',
    transcribedWithVoice: true,
  },
];

interface BiblicalNotesViewProps {
  onTransferToTestimony?: (noteText: string, noteTitle: string) => void;
}

export const BiblicalNotesView: React.FC<BiblicalNotesViewProps> = ({ onTransferToTestimony }) => {
  const [notes, setNotes] = useState<BiblicalNote[]>(() => {
    try {
      const saved = localStorage.getItem('coeur_vie_biblical_notes');
      return saved ? JSON.parse(saved) : INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);

  // New Note modal / creation state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteContent, setNoteContent] = useState<string>('');
  const [noteCategory, setNoteCategory] = useState<BiblicalNote['category']>('temoignage');
  const [noteColor, setNoteColor] = useState<BiblicalNote['color']>('gold');
  const [noteVerseRef, setNoteVerseRef] = useState<string>('Ésaïe 53:5');

  // Speech Recognition (Micro Transcripteur)
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [transcriptNotice, setTranscriptNotice] = useState<string>('');
  const recognitionRef = useRef<any>(null);

  // Success toast
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Save notes locally
  useEffect(() => {
    try {
      localStorage.setItem('coeur_vie_biblical_notes', JSON.stringify(notes));
    } catch (e) {
      console.warn(e);
    }
  }, [notes]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'fr-FR';

      recognition.onstart = () => {
        setIsRecording(true);
        setTranscriptNotice('Microphone actif : parlez avec votre voix, vos paroles s\'écrivent...');
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }

        if (currentTranscript.trim()) {
          setNoteContent((prev) => {
            const separator = prev.trim() ? ' ' : '';
            return prev + separator + currentTranscript.trim();
          });
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          setTranscriptNotice('Accès au microphone refusé par le navigateur. Veuillez autoriser le micro.');
        } else {
          setTranscriptNotice('Le micro s\'est arrêté. Cliquez à nouveau pour reprendre.');
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.error('Speech initialization error:', err);
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!speechSupported) {
      alert('La transcription vocale directe n\'est pas prise en charge sur ce navigateur. Vous pouvez saisir le texte au clavier.');
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
      setTranscriptNotice('Transcription vocale enregistrée.');
    } else {
      setTranscriptNotice('');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // If already started, restart
          recognitionRef.current.stop();
          setTimeout(() => recognitionRef.current?.start(), 200);
        }
      }
    }
  };

  const handleListenNote = (note: BiblicalNote) => {
    if (activeSpeechId === note.id) {
      stopSpeaking();
      setActiveSpeechId(null);
    } else {
      setActiveSpeechId(note.id);
      const textToRead = `${note.title}. ${note.content}. Verset associé : ${note.verseRef || 'Parole de Dieu'}.`;
      speakScripture(
        textToRead,
        () => setActiveSpeechId(null),
        () => setActiveSpeechId(null)
      );
    }
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    let catLabel = 'Récit de Foi';
    if (noteCategory === 'priere') catLabel = 'Prière du Cœur';
    if (noteCategory === 'promesse') catLabel = 'Promesse & Verset';
    if (noteCategory === 'sante') catLabel = 'Santé & Cardio';
    if (noteCategory === 'meditation') catLabel = 'Méditation';

    const newNote: BiblicalNote = {
      id: Date.now().toString(),
      title: noteTitle.trim() || 'Parole dictée au micro',
      content: noteContent.trim(),
      category: noteCategory,
      categoryLabel: catLabel,
      color: noteColor,
      verseRef: noteVerseRef.trim() || undefined,
      isPinned: false,
      createdAt: 'À l\'instant',
      transcribedWithVoice: isRecording || noteContent.length > 0,
    };

    setNotes([newNote, ...notes]);
    setShowAddModal(false);
    setNoteTitle('');
    setNoteContent('');
    setTranscriptNotice('');
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const togglePin = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (activeSpeechId === id) {
      stopSpeaking();
      setActiveSpeechId(null);
    }
  };

  const handleCopyNote = (note: BiblicalNote) => {
    navigator.clipboard.writeText(`${note.title}\n\n${note.content}\n\n— ${note.verseRef || ''}`);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Color schemes for biblical note cards
  const colorMap = {
    gold: 'bg-amber-950/30 border-amber-500/40 text-amber-100 shadow-amber-500/5',
    sapphire: 'bg-blue-950/30 border-blue-500/40 text-blue-100 shadow-blue-500/5',
    emerald: 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100 shadow-emerald-500/5',
    amber: 'bg-orange-950/30 border-orange-500/40 text-orange-100 shadow-orange-500/5',
    rose: 'bg-rose-950/30 border-rose-500/40 text-rose-100 shadow-rose-500/5',
  };

  const filteredNotes = notes
    .filter((n) => {
      const matchCat = selectedCategory === 'all' || n.category === selectedCategory;
      const matchQuery =
        !searchQuery.trim() ||
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.verseRef && n.verseRef.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchQuery;
    })
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>« Écris la vision, grave-la sur des tables » (Habacuc 2:2)</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-display font-bold text-amber-50">
          Les Tablettes de Foi — Bloc-Notes Biblique
        </h2>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Votre carnet spirituel souverain et confidentiel. Consignez vos prières, vos promesses reçues et 
          vos progrès de santé. <strong>Équipé d'un transcripteur vocal au micro</strong> spécialement pensé 
          pour les personnes qui ne savent pas écrire ou dont les mains sont douloureuses, afin de leur 
          permettre de formuler leur témoignage par la simple voix.
        </p>

        {/* Micro Transcripteur Quick Launcher Hero */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border border-amber-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="space-y-1">
            <span className="font-display font-bold text-amber-200 text-sm sm:text-base flex items-center gap-2">
              <Mic className="w-4 h-4 text-amber-400" />
              Transcripteur Vocal pour Témoignages & Prières
            </span>
            <p className="text-xs text-slate-300">
              Vous avez des difficultés à taper ou à écrire ? Cliquez sur le micro, parlez normalement : 
              vos paroles se transforment en texte biblique prêt à être partagé.
            </p>
          </div>

          <button
            onClick={() => {
              setNoteTitle('Témoignage dicté au micro');
              setNoteCategory('temoignage');
              setShowAddModal(true);
              setTimeout(() => toggleRecording(), 300);
            }}
            className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Mic className="w-4 h-4" />
            <span>Parler au micro pour écrire</span>
          </button>
        </div>
      </div>

      {/* Action Bar: Search, Category Filters, New Note Button */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher dans mes notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* New note button */}
          <button
            onClick={() => {
              setNoteTitle('');
              setNoteContent('');
              setShowAddModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nouvelle note</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none text-xs">
          {[
            { id: 'all', label: 'Toutes' },
            { id: 'temoignage', label: 'Témoignages' },
            { id: 'priere', label: 'Prières' },
            { id: 'promesse', label: 'Promesses' },
            { id: 'sante', label: 'Santé & Cardio' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* NOTES GRID (GOOGLE KEEP STYLE IN BIBLICAL DESIGN) */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 space-y-3">
          <PenTool className="w-8 h-8 text-amber-400 mx-auto opacity-60" />
          <h3 className="font-display font-bold text-lg text-slate-300">
            Aucune note pour le moment
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Utilisez le transcripteur micro pour dicter vos prières ou vos victoires de santé, 
            ou créez votre première note au clavier.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotes.map((note) => {
            const isSpeaking = activeSpeechId === note.id;
            return (
              <div
                key={note.id}
                className={`rounded-3xl border p-5 flex flex-col justify-between space-y-4 shadow-lg transition-all relative ${
                  colorMap[note.color]
                } ${note.isPinned ? 'ring-2 ring-amber-400/50' : ''}`}
              >
                <div className="space-y-3">
                  {/* Card Header: Category & Pin */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                      {note.transcribedWithVoice && (
                        <span title="Dictée au microphone" className="inline-flex">
                          <Mic className="w-3 h-3 text-amber-400" />
                        </span>
                      )}
                      {note.categoryLabel}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => togglePin(note.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          note.isPinned ? 'text-amber-400 bg-amber-400/20' : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title={note.isPinned ? 'Détacher' : 'Épingler en haut'}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                        title="Supprimer la note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-base text-amber-50 leading-snug">
                    {note.title}
                  </h3>

                  {/* Content */}
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {note.content}
                  </p>

                  {/* Attached Scripture Verse */}
                  {note.verseRef && (
                    <div className="p-2.5 rounded-xl bg-black/30 border border-white/10 text-xs space-y-0.5">
                      <span className="font-bold text-amber-300 text-[11px] flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        Verset d'ancrage : {note.verseRef}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer Actions: Listen, Copy, Date */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {note.createdAt}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Read Aloud Button (Great for people who struggle to read) */}
                    <button
                      onClick={() => handleListenNote(note)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        isSpeaking
                          ? 'bg-amber-500 text-slate-950 font-bold animate-pulse'
                          : 'bg-black/40 hover:bg-black/60 text-amber-200'
                      }`}
                      title="Écouter la note lue à voix haute"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>{isSpeaking ? 'Lecture...' : 'Écouter'}</span>
                    </button>

                    {/* Copy to clipboard */}
                    <button
                      onClick={() => handleCopyNote(note)}
                      className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-slate-300 transition-colors"
                      title="Copier le texte"
                    >
                      {copiedId === note.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: CREATE / DICTATE NOTE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-display font-bold text-lg text-amber-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                Tablette de Foi & Dictée Vocale
              </h3>
              <button
                onClick={() => {
                  if (isRecording && recognitionRef.current) recognitionRef.current.stop();
                  setShowAddModal(false);
                }}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            {/* BIG MICROPHONE TRANSCRIBER SECTION */}
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-center space-y-3">
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-xl ${
                    isRecording
                      ? 'bg-rose-600 text-white animate-pulse scale-105 shadow-rose-600/40'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 active:scale-95'
                  }`}
                  title={isRecording ? 'Arrêter la dictée' : 'Démarrer la dictée au micro'}
                >
                  {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                </button>
              </div>

              <div>
                <span className="font-bold text-xs text-amber-200 block">
                  {isRecording ? 'Écoute en cours... Parlez avec le cœur !' : 'Appuyez sur le micro pour dicter vos paroles'}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Idéal pour ceux qui ne savent pas écrire : parlez simplement, vos mots s'écrivent ci-dessous.
                </span>
              </div>

              {transcriptNotice && (
                <p className="text-[11px] text-amber-300 font-mono bg-amber-950/40 py-1 px-3 rounded-lg inline-block">
                  {transcriptNotice}
                </p>
              )}
            </div>

            <form onSubmit={handleCreateNote} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Titre de la note
                </label>
                <input
                  type="text"
                  placeholder="Ex: Guérison après la marche et paix du soir"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Vos paroles ou votre récit (écrit ou dicté) *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Ce que vous dites au micro s'inscrit ici automatiquement..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-400 focus:outline-none resize-none leading-relaxed text-sm"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Catégorie
                  </label>
                  <select
                    value={noteCategory}
                    onChange={(e) => setNoteCategory(e.target.value as BiblicalNote['category'])}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="temoignage">Récit de Foi & Guérison</option>
                    <option value="priere">Prière du Cœur</option>
                    <option value="promesse">Promesse & Verset reçu</option>
                    <option value="sante">Santé, Tension & Cardio</option>
                    <option value="meditation">Méditation Biblique</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Verset de soutien (Optionnel)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Ésaïe 53:5, Psaume 23:1"
                    value={noteVerseRef}
                    onChange={(e) => setNoteVerseRef(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Color picker */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Couleur de la tablette
                </label>
                <div className="flex items-center gap-3">
                  {[
                    { id: 'gold', bg: 'bg-amber-500', label: 'Or' },
                    { id: 'emerald', bg: 'bg-emerald-500', label: 'Émeraude' },
                    { id: 'sapphire', bg: 'bg-blue-500', label: 'Saphir' },
                    { id: 'amber', bg: 'bg-orange-500', label: 'Ambre' },
                    { id: 'rose', bg: 'bg-rose-500', label: 'Pourpre' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setNoteColor(c.id as BiblicalNote['color'])}
                      className={`w-7 h-7 rounded-full ${c.bg} transition-transform ${
                        noteColor === c.id ? 'ring-4 ring-white/30 scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Enregistrer ma tablette</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
