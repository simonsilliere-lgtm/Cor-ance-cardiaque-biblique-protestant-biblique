export interface FaithTestimony {
  id: string;
  author: string;
  location?: string;
  category: 'cardio' | 'convalescence' | 'angoisse' | 'douleur' | 'paix';
  categoryLabel: string;
  title: string;
  story: string;
  keyVerseRef: string;
  keyVerseText: string;
  appPracticeUsed: string; // e.g. "Cohérence cardiaque 5 min", "Marche douce Degré 1", "Écoute du Veilleur Élie"
  amenCount: number;
  hasSaidAmen: boolean;
  date: string;
  attestedUnderGod: boolean; // Confirmed solemn oath before God
}

// Strict zero mock testimonies: ONLY real testimonies written by actual users of the site
export const INITIAL_TESTIMONIES: FaithTestimony[] = [];

export const BIBLICAL_TRUTH_VERSES = [
  {
    ref: 'Exode 20:16',
    text: 'Tu ne porteras point de faux témoignage contre ton prochain.'
  },
  {
    ref: 'Proverbes 12:22',
    text: 'Les lèvres fausses sont en horreur à l\'Éternel, mais ceux qui agissent avec vérité lui sont agréables.'
  },
  {
    ref: 'Proverbes 19:5',
    text: 'Le faux témoin ne restera point impuni, et celui qui dit des mensonges n\'échappera pas.'
  },
  {
    ref: 'Matthieu 12:36',
    text: 'Au jour du jugement, les hommes rendront compte de toute parole vaine qu\'ils auront proférée.'
  },
  {
    ref: 'Colossiens 3:9',
    text: 'Ne mentez pas les uns aux autres, vous étant dépouillés du vieil homme et de ses œuvres.'
  }
];
