import React, { useState, useEffect, useRef } from 'react';
import { Send, Volume2, VolumeX, Shield, Lock, Trash2, Sparkles, BookOpen, Music, Play, Pause, Headphones, EyeOff } from 'lucide-react';
import { speakScripture, stopSpeaking, isSpeaking } from '../utils/audio';
import { startBiblicalAmbience, stopBiblicalAmbience, isAmbiencePlaying, setAmbienceVolume } from '../utils/biblicalAmbience';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'model';
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'model',
    text: `Bienvenue dans votre Sanctuaire d'Écoute et de Prière. Je suis Élie, votre veilleur biblique.

Si vous avez des difficultés à lire, si vos yeux sont fatigués par la maladie ou si vous souhaitez simplement fermer les yeux pour vous concentrer sur la présence de Dieu, activez la lecture audio automatique ci-dessus : je vous lirai chaque parole et chaque verset de la Bible Louis Segond (1910).

Vos échanges demeurent strictement confidentiels entre vous et le Seigneur. De quoi votre cœur a-t-il besoin aujourd'hui ?`,
    timestamp: 'À l\'instant'
  }
];

export const BiblicalChatbotView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('coeur_vie_chat_history');
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);

  // Biblical Ambience State
  const [ambientPlaying, setAmbientPlaying] = useState<boolean>(isAmbiencePlaying());
  const [ambientMood, setAmbientMood] = useState<'harpe' | 'choeur' | 'sabbat'>('harpe');
  const [ambientVol, setAmbientVol] = useState<number>(0.35);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Save messages in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('coeur_vie_chat_history', JSON.stringify(messages));
    } catch (e) {
      console.warn(e);
    }
  }, [messages]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const toggleAmbience = () => {
    if (ambientPlaying) {
      stopBiblicalAmbience();
      setAmbientPlaying(false);
    } else {
      startBiblicalAmbience(ambientMood, ambientVol);
      setAmbientPlaying(true);
    }
  };

  const handleMoodChange = (mood: 'harpe' | 'choeur' | 'sabbat') => {
    setAmbientMood(mood);
    if (ambientPlaying) {
      startBiblicalAmbience(mood, ambientVol);
    }
  };

  const handleVolumeChange = (vol: number) => {
    setAmbientVol(vol);
    setAmbienceVolume(vol);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || inputMessage;
    if (!messageText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.slice(-10), // Send last 10 messages for context
          userMessage: messageText.trim()
        })
      });

      const data = await response.json();
      const replyText = data.reply || '« Que la paix de Dieu garde votre cœur. »';

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'model',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);

      // If Auto-Speak is enabled, immediately read the verse and prayer aloud!
      if (autoSpeak) {
        setActiveSpeakingId(botMsg.id);
        speakScripture(
          replyText,
          () => setActiveSpeakingId(null),
          () => setActiveSpeakingId(null)
        );
      }
    } catch (e) {
      console.error(e);
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'model',
        text: `« Ne crains rien, car je suis avec toi; ne promène pas des regards inquiets, car je suis ton Dieu; je te fortifie, je viens à ton secours, je te soutiens de ma droite triomphante. » — Ésaïe 41:10 (Louis Segond)\n\nPrière : Seigneur, apaise mon cœur et sois mon secours immédiat. Amen.`,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      if (autoSpeak) {
        speakScripture(fallbackMsg.text);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakSingle = (msg: ChatMessage) => {
    if (activeSpeakingId === msg.id && isSpeaking()) {
      stopSpeaking();
      setActiveSpeakingId(null);
    } else {
      setActiveSpeakingId(msg.id);
      speakScripture(
        msg.text,
        () => setActiveSpeakingId(null),
        () => setActiveSpeakingId(null)
      );
    }
  };

  const handleClearHistory = () => {
    stopSpeaking();
    setMessages(INITIAL_MESSAGES);
    try {
      localStorage.removeItem('coeur_vie_chat_history');
    } catch {
      // ignore
    }
  };

  const quickPrompts = [
    'Donne-moi un verset pour fortifier mon cœur fatigué',
    'Je ne peux pas lire : lis-moi une promesse de guérison',
    'Un verset pour calmer mes palpitations et mon angoisse',
    'Rappelle-moi ce que Jésus a accompli à la croix pour ma santé',
    'Un psaume de paix pour m\'endormir les yeux fermés'
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Top Confidentiality & Accessibility Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0d1627] via-[#101b33] to-[#0d1627] border border-amber-500/30 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-amber-200 text-sm">
                  Sanctuaire de Confidentialité Totale
                </span>
                <span className="text-[10px] font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                  100% Privé & Sans Compte
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Vos prières et soucis de santé restent strictement confidentiels et locaux.
              </p>
            </div>
          </div>

          {/* Accessibility toggle: Auto-Speech & Clear */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (autoSpeak) {
                  stopSpeaking();
                }
                setAutoSpeak(!autoSpeak);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                autoSpeak
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Lit automatiquement chaque verset et prière à voix haute pour ceux qui ne peuvent pas lire"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Lecture Vocale Auto {autoSpeak ? 'Activée' : 'Coupée'}</span>
            </button>

            <button
              onClick={handleClearHistory}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
              title="Effacer tout l'historique confidentiel"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ambient Biblical Music Controller */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleAmbience}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
                ambientPlaying
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {ambientPlaying ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-amber-400 ml-0.5" />}
              <span>{ambientPlaying ? 'Musique Biblique Active' : 'Lancer l\'ambiance biblique'}</span>
            </button>

            {/* Mood selector */}
            <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => handleMoodChange('harpe')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  ambientMood === 'harpe' ? 'bg-amber-500/30 text-amber-200 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Harpe de David
              </button>
              <button
                onClick={() => handleMoodChange('choeur')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  ambientMood === 'choeur' ? 'bg-amber-500/30 text-amber-200 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Chœur Céleste
              </button>
              <button
                onClick={() => handleMoodChange('sabbat')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  ambientMood === 'sabbat' ? 'bg-amber-500/30 text-amber-200 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Repos Sabbat (432Hz)
              </button>
            </div>
          </div>

          {/* Volume slider */}
          {ambientPlaying && (
            <div className="flex items-center gap-2 text-slate-400">
              <span>Volume :</span>
              <input
                type="range"
                min="0.05"
                max="0.8"
                step="0.05"
                value={ambientVol}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-20 accent-amber-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Thread Container */}
      <div className="rounded-3xl bg-[#0d1424]/90 border border-slate-800/90 shadow-2xl flex flex-col h-[600px] overflow-hidden">
        {/* Chat Messages Scrollable Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isBeingSpoken = activeSpeakingId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <BookOpen className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 space-y-2 text-xs sm:text-sm leading-relaxed shadow-lg ${
                    isUser
                      ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-medium rounded-tr-sm'
                      : 'bg-slate-900/95 border border-slate-800 text-slate-100 rounded-tl-sm'
                  }`}
                >
                  {/* Message Content */}
                  <div className="whitespace-pre-line font-sans">
                    {msg.text}
                  </div>

                  {/* Audio Listen & Meta */}
                  <div className="flex items-center justify-between pt-2 border-t border-black/10 text-[10px] text-slate-400">
                    <span className={isUser ? 'text-amber-950/80 font-mono' : 'text-slate-500 font-mono'}>
                      {msg.timestamp}
                    </span>

                    {!isUser && (
                      <button
                        onClick={() => handleSpeakSingle(msg)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors font-medium ${
                          isBeingSpoken
                            ? 'bg-amber-500 text-slate-950 font-bold animate-pulse'
                            : 'bg-slate-800 hover:bg-slate-700 text-amber-300'
                        }`}
                        title="Écouter ce message à voix haute (idéal pour fermer les yeux)"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{isBeingSpoken ? 'En cours de lecture...' : 'Écouter'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-amber-300 italic p-2 animate-pulse">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>Élie recherche les versets de la Bible Louis Segond pour votre cœur...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-2 sm:px-4 bg-slate-950/60 border-t border-slate-800/80 overflow-x-auto scrollbar-none flex items-center gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-200 hover:border-amber-500/40 text-[11px] whitespace-nowrap transition-all shadow-sm shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Écrivez ce qui pèse sur votre cœur ou ce que vous désirez entendre (ex: angoisse, douleur, verset du jour)..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold transition-all shadow-md shrink-0"
              title="Envoyer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
