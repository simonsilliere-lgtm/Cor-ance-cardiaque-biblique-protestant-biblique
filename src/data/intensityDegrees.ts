export interface IntensityDegree {
  id: 'degre-1' | 'degre-2' | 'degre-3';
  degreeNumber: 1 | 2 | 3;
  name: string;
  shortName: string;
  tagline: string;
  targetBpm: string;
  recommendedCadence: string; // e.g. 45-55 pas/min
  metronomeBpm: number;
  suitableFor: string;
  biblicalPromise: string;
  colorClass: {
    bg: string;
    border: string;
    text: string;
    badge: string;
  };
}

export const INTENSITY_DEGREES: IntensityDegree[] = [
  {
    id: 'degre-1',
    degreeNumber: 1,
    name: 'Degré 1 — Très Doux & Réparateur',
    shortName: 'Degré 1 (Très Doux)',
    tagline: 'Pour personnes alitées, malades, convalescentes ou au cœur fragile',
    targetBpm: '55 - 70 BPM',
    recommendedCadence: '45 - 55 pas ou flexions par minute (Très lent)',
    metronomeBpm: 50,
    suitableFor: 'Insuffisance cardiaque, convalescence post-opératoire, fatigue chronique, personnes âgées ou mobilité réduite.',
    biblicalPromise: '« Il ne brisera point le roseau froissé, et il n\'éteindra point le lumignon qui fume. » (Ésaïe 42:3)',
    colorClass: {
      bg: 'bg-teal-950/40',
      border: 'border-teal-600/50',
      text: 'text-teal-300',
      badge: 'bg-teal-900/60 text-teal-200 border-teal-700/60',
    }
  },
  {
    id: 'degre-2',
    degreeNumber: 2,
    name: 'Degré 2 — Doux & Circulatoire',
    shortName: 'Degré 2 (Doux)',
    tagline: 'Marche tranquille et activation veineuse sans essoufflement',
    targetBpm: '70 - 85 BPM',
    recommendedCadence: '65 - 75 pas par minute (Rythme naturel apaisé)',
    metronomeBpm: 68,
    suitableFor: 'Hypertension artérielle, reprise d’activité progressive, soulagement du stress artériel.',
    biblicalPromise: '« Il me conduit près des eaux paisibles. Il restaure mon âme. » (Psaume 23:2-3)',
    colorClass: {
      bg: 'bg-amber-950/40',
      border: 'border-amber-500/50',
      text: 'text-amber-300',
      badge: 'bg-amber-900/60 text-amber-200 border-amber-700/60',
    }
  },
  {
    id: 'degre-3',
    degreeNumber: 3,
    name: 'Degré 3 — Modéré & Tonifiant',
    shortName: 'Degré 3 (Modéré)',
    tagline: 'Fortification du muscle cardiaque avec endurance contrôlée',
    targetBpm: '85 - 110 BPM',
    recommendedCadence: '80 - 90 pas par minute (Vigueur mesurée sans forcer)',
    metronomeBpm: 84,
    suitableFor: 'Maintien de la santé cardiovasculaire, renforcement du myocarde, énergie retrouvée.',
    biblicalPromise: '« Ceux qui se confient en l\'Éternel renouvellent leur force. » (Ésaïe 40:31)',
    colorClass: {
      bg: 'bg-orange-950/40',
      border: 'border-orange-500/50',
      text: 'text-orange-300',
      badge: 'bg-orange-900/60 text-orange-200 border-orange-700/60',
    }
  }
];

export function getDegreeById(id: string): IntensityDegree {
  return INTENSITY_DEGREES.find((d) => d.id === id) || INTENSITY_DEGREES[1];
}
