/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header, ActiveTab } from './components/Header';
import { CoherenceView } from './components/CoherenceView';
import { CardioWorkoutsView } from './components/CardioWorkoutsView';
import { BpmTrackerView } from './components/BpmTrackerView';
import { IllnessesWorldView } from './components/IllnessesWorldView';
import { SpiritualIllnessesView } from './components/SpiritualIllnessesView';
import { BiblicalChatbotView } from './components/BiblicalChatbotView';
import { TestimonialsView } from './components/TestimonialsView';
import { PrayerWallView } from './components/PrayerWallView';
import { VerseLibraryView } from './components/VerseLibraryView';
import { IllnessTopic } from './data/illnessesWorld';
import { Heart, BookOpen, Shield, Wind, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('coherence');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [topicToIntercede, setTopicToIntercede] = useState<IllnessTopic | null>(null);

  const handleIntercedeFromIllness = (topic: IllnessTopic) => {
    setTopicToIntercede(topic);
    setActiveTab('priere');
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'coherence' && (
          <CoherenceView soundEnabled={soundEnabled} />
        )}

        {activeTab === 'cardio' && (
          <CardioWorkoutsView soundEnabled={soundEnabled} />
        )}

        {activeTab === 'bpm' && (
          <BpmTrackerView soundEnabled={soundEnabled} />
        )}

        {activeTab === 'maladies' && (
          <IllnessesWorldView onIntercedeForTopic={handleIntercedeFromIllness} />
        )}

        {activeTab === 'spirituelles' && (
          <SpiritualIllnessesView soundEnabled={soundEnabled} />
        )}

        {activeTab === 'chatbot' && (
          <BiblicalChatbotView />
        )}

        {activeTab === 'temoignages' && (
          <TestimonialsView />
        )}

        {activeTab === 'priere' && (
          <PrayerWallView
            initialTopicToIntercede={topicToIntercede}
            onClearInitialTopic={() => setTopicToIntercede(null)}
          />
        )}

        {activeTab === 'versets' && (
          <VerseLibraryView />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#080c14] py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500/30" />
            <span className="font-display font-bold text-amber-200">Cœur & Vie</span>
            <span>·</span>
            <span>Inspiré de la Bible Louis Segond (1910)</span>
          </div>

          <p className="text-slate-400 text-center max-w-md">
            « Ne savez-vous pas que votre corps est le temple du Saint-Esprit qui est en vous, 
            que vous avez reçu de Dieu? Glorifiez donc Dieu dans votre corps. » (1 Co 6:19-20)
          </p>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Aucun compte requis</span>
            <span>·</span>
            <span>Données locales</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
