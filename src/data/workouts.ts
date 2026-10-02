export interface WorkoutStep {
  id: string;
  name: string;
  durationSeconds: number;
  // Step instructions adapted to the 3 intensity degrees
  instructionDegre1: string; // Très doux / assis / lent
  instructionDegre2: string; // Doux / marche tranquille
  instructionDegre3: string; // Modéré / tonique sans à-coups
  intensity: 'repos' | 'doux' | 'modere';
  cadenceDegre1: string;
  cadenceDegre2: string;
  cadenceDegre3: string;
  verseSnippet: string;
  verseRef: string;
  targetBpmDegre1: string;
  targetBpmDegre2: string;
  targetBpmDegre3: string;
}

export interface CardioWorkout {
  id: string;
  title: string;
  subtitle: string;
  biblicalTheme: string;
  description: string;
  defaultDegreeId: 'degre-1' | 'degre-2' | 'degre-3';
  totalDurationMinutes: number; // Max 20 minutes
  beadsCount: number; // Number of 3-min beads
  idealFor: string;
  iconType: 'walk' | 'heart' | 'mountain' | 'dove';
  colorGradient: string;
  steps: WorkoutStep[];
}

export const CARDIO_WORKOUTS: CardioWorkout[] = [
  {
    id: 'seance-20min-maitre',
    title: 'La Marche Cardiaque des 20 Minutes (Réglage Doux)',
    subtitle: 'Séance Maîtresse avec 3 Degrés d’Intensité au Choix (Max 20 min)',
    biblicalTheme: 'Ésaïe 40:29-31 & Psaume 23',
    description: 'La séance fondamentale de 20 minutes maximum spécialement conçue pour respecter votre cœur. Ajustez la douceur et la durée selon vos forces sans jamais subir de rythme trop rapide.',
    defaultDegreeId: 'degre-2',
    totalDurationMinutes: 20, // Strict MAXIMUM 20 minutes
    beadsCount: 7,
    idealFor: 'Tous profils : choisissez le Degré 1 (convalescent), Degré 2 (doux) ou Degré 3 (modéré).',
    iconType: 'dove',
    colorGradient: 'from-amber-500/25 via-emerald-600/20 to-teal-700/25',
    steps: [
      {
        id: 's20-1',
        name: '1. Éveil du Temple Corporel (Bille 1 : 3 min)',
        durationSeconds: 180,
        instructionDegre1: 'Assis ou debout adossé, respirez lentement par le nez. Roulez très doucement les épaules vers l’arrière 5 fois. Posez la main sur votre poitrine.',
        instructionDegre2: 'Debout, commencez une marche très tranquille sur place. Balancement naturel et fluide des bras sans forcer.',
        instructionDegre3: 'Marche sur place dynamique mais souple. Grandissez-vous et synchronisez votre pas avec un souffle régulier.',
        intensity: 'doux',
        cadenceDegre1: '40 - 50 pas/min (Très calme)',
        cadenceDegre2: '60 - 65 pas/min (Rythme naturel)',
        cadenceDegre3: '75 - 80 pas/min (Actif)',
        verseSnippet: 'Garde ton cœur plus que toute autre chose, car de lui jaillissent les sources de la vie.',
        verseRef: 'Proverbes 4:23',
        targetBpmDegre1: '55 - 68 BPM',
        targetBpmDegre2: '68 - 80 BPM',
        targetBpmDegre3: '80 - 95 BPM'
      },
      {
        id: 's20-2',
        name: '2. Activation Circulatoire Douce (Bille 2 : 6 min)',
        durationSeconds: 180,
        instructionDegre1: 'Toujours en douceur, levez alternativement les talons tout en gardant les orteils au sol. Active la pompe veineuse sans fatigue.',
        instructionDegre2: 'Pas calmes sur place avec petites ouvertures douces des bras vers le ciel à chaque inspiration pour oxygéner le thorax.',
        instructionDegre3: 'Pas cadencés avec légères flexions des genoux et élévation des mains en signe de prière.',
        intensity: 'doux',
        cadenceDegre1: 'Mouvements lents et réguliers',
        cadenceDegre2: '65 pas/min avec respiration ample',
        cadenceDegre3: '80 pas/min contrôlé',
        verseSnippet: 'Ce sera la santé pour tes muscles, et un rafraîchissement pour tes os.',
        verseRef: 'Proverbes 3:8',
        targetBpmDegre1: '58 - 70 BPM',
        targetBpmDegre2: '72 - 82 BPM',
        targetBpmDegre3: '85 - 100 BPM'
      },
      {
        id: 's20-3',
        name: '3. La Marche Paisible de la Grâce (Bille 3 : 9 min)',
        durationSeconds: 180,
        instructionDegre1: 'Mouvements doux des chevilles et des poignets. Respirez profondément en remerciant Dieu pour chaque battement.',
        instructionDegre2: 'Marche légère d’un pied sur l’autre. Faites un petit pas à droite puis un pas à gauche, les bras détendus.',
        instructionDegre3: 'Marche rythmée avec légères montées de genoux à mi-hauteur. Gardez le dos droit sans à-coups.',
        intensity: 'doux',
        cadenceDegre1: 'Rythme de repos actif',
        cadenceDegre2: '65 - 70 pas/min',
        cadenceDegre3: '80 - 85 pas/min',
        verseSnippet: 'Il me conduit près des eaux paisibles. Il restaure mon âme.',
        verseRef: 'Psaume 23:2-3',
        targetBpmDegre1: '60 - 72 BPM',
        targetBpmDegre2: '75 - 85 BPM',
        targetBpmDegre3: '90 - 105 BPM'
      },
      {
        id: 's20-4',
        name: '4. Intervalles de Renouvellement (Bille 4 : 12 min)',
        durationSeconds: 180,
        instructionDegre1: 'Levez doucement les bras vers le ciel sur 4 secondes, puis abaissez-les lentement en expirant sur 6 secondes. Zéro essoufflement.',
        instructionDegre2: 'Alternez 30 secondes de marche un peu plus alerte et 30 secondes de pas très lents de récupération.',
        instructionDegre3: 'Intervalles réguliers : 40s de pas stimulants, puis 20s de marche douce pour habituer le cœur à la souplesse vasculaire.',
        intensity: 'modere',
        cadenceDegre1: 'Mouvement respiratoire ample',
        cadenceDegre2: 'Modulation douce 60-70 pas/min',
        cadenceDegre3: 'Intervalles 75-85 pas/min',
        verseSnippet: 'Ceux qui se confient en l\'Éternel renouvellent leur force.',
        verseRef: 'Ésaïe 40:31',
        targetBpmDegre1: '60 - 72 BPM',
        targetBpmDegre2: '75 - 85 BPM',
        targetBpmDegre3: '95 - 110 BPM'
      },
      {
        id: 's20-5',
        name: '5. La Joie du Cœur Reconnaissant (Bille 5 : 15 min)',
        durationSeconds: 180,
        instructionDegre1: 'Assis ou debout, balancez doucement le buste d’un côté puis de l’autre en priant pour les malades du monde.',
        instructionDegre2: 'Marche continue à allure confortable. Sentez la chaleur bienfaisante dans vos mains et vos pieds.',
        instructionDegre3: 'Foulées douces avec petites poussées des bras vers l’avant sans forcer sur les épaules.',
        intensity: 'doux',
        cadenceDegre1: 'Douceur continue',
        cadenceDegre2: '65 pas/min stable',
        cadenceDegre3: '80 pas/min mesuré',
        verseSnippet: 'Un cœur joyeux est un bon remède, mais un esprit abattu dessèche les os.',
        verseRef: 'Proverbes 17:22',
        targetBpmDegre1: '60 - 70 BPM',
        targetBpmDegre2: '72 - 82 BPM',
        targetBpmDegre3: '90 - 105 BPM'
      },
      {
        id: 's20-6',
        name: '6. Décélération Douce & Oxygénation (Bille 6 : 18 min)',
        durationSeconds: 180,
        instructionDegre1: 'Ralentissez au maximum. Posez les mains sur les genoux, inspirez par le nez et soufflez longuement par la bouche.',
        instructionDegre2: 'Ralentissez l’allure vers un pas très lent. Laissez redescendre vos pulsations en paix.',
        instructionDegre3: 'Marche de décompression progressive. Relâchez complètement les trapèzes et la nuque.',
        intensity: 'doux',
        cadenceDegre1: 'Décroissance totale',
        cadenceDegre2: 'Pas ralentis (50 pas/min)',
        cadenceDegre3: 'Pas ralentis (55 pas/min)',
        verseSnippet: 'Mon âme, bénis l\'Éternel, et n\'oublie aucun de ses bienfaits! C\'est lui qui guérit toutes tes maladies.',
        verseRef: 'Psaume 103:2-3',
        targetBpmDegre1: '55 - 65 BPM',
        targetBpmDegre2: '65 - 75 BPM',
        targetBpmDegre3: '75 - 85 BPM'
      },
      {
        id: 's20-7',
        name: '7. Couronnement & Repos Céleste (Bille 7 : 20 min MAX)',
        durationSeconds: 120, // Reaches exactly 20 minutes (18 min + 2 min = 20 min)
        instructionDegre1: 'Immobilité complète. Fermez les yeux. Sentez la paix de Dieu calmer chaque cellule de votre être.',
        instructionDegre2: 'Arrêt de tout mouvement. Mains jointes sur la poitrine, écoutez la résonance du cantique et rendez grâce.',
        instructionDegre3: 'Repos absolu. Le cœur ralentit calmement. Vous avez honoré le Créateur dans votre corps.',
        intensity: 'repos',
        cadenceDegre1: 'Immobilité et paix',
        cadenceDegre2: 'Repos complet',
        cadenceDegre3: 'Repos complet',
        verseSnippet: 'J\'ai combattu le bon combat, j\'ai achevé la course, j\'ai gardé la foi. Désormais la couronne de justice m\'est réservée.',
        verseRef: '2 Timothée 4:7-8',
        targetBpmDegre1: '50 - 65 BPM',
        targetBpmDegre2: '60 - 72 BPM',
        targetBpmDegre3: '65 - 75 BPM'
      }
    ]
  },
  {
    id: 'marche-guerison',
    title: 'Marche de la Grâce & Convalescence (9 min)',
    subtitle: 'Séance Ultra-Douce pour corps affaibli ou cœur sensible (3 billes)',
    biblicalTheme: 'Proverbes 3:7-8 & Ésaïe 42:3',
    description: 'Une séance très courte et ultra-douce de 9 minutes (3 billes de 3 min) sans aucun saut ni mouvement brusque. Conçue pour les personnes convalescentes ou alitées.',
    defaultDegreeId: 'degre-1',
    totalDurationMinutes: 9,
    beadsCount: 3,
    idealFor: 'Personnes convalescentes, personnes âgées, reprise douce, cœur sensible.',
    iconType: 'walk',
    colorGradient: 'from-teal-600/30 to-emerald-600/20',
    steps: [
      {
        id: 'w1-1',
        name: 'Éveil Apaisé du Cœur (Bille 1 : 3 min)',
        durationSeconds: 180,
        instructionDegre1: 'Assis confortablement, fermez les yeux. Respirez calmement par le nez en détendant votre cage thoracique.',
        instructionDegre2: 'Debout sans forcer, pas très lents sur place avec balancement doux des bras.',
        instructionDegre3: 'Marche modérée sur place, dos droit, épaules relâchées.',
        intensity: 'doux',
        cadenceDegre1: '40 pas/min très tranquille',
        cadenceDegre2: '55 pas/min',
        cadenceDegre3: '70 pas/min',
        verseSnippet: 'Garde ton cœur plus que toute autre chose, car de lui jaillissent les sources de la vie.',
        verseRef: 'Proverbes 4:23',
        targetBpmDegre1: '55 - 65 BPM',
        targetBpmDegre2: '65 - 75 BPM',
        targetBpmDegre3: '75 - 85 BPM'
      },
      {
        id: 'w1-2',
        name: 'Pompe Veineuse Douce (Bille 2 : 6 min)',
        durationSeconds: 180,
        instructionDegre1: 'Flexion lente des chevilles et des doigts de pied. Stimule le retour veineux sans fatiguer le cœur.',
        instructionDegre2: 'Montée très douce sur la pointe des pieds, redescente lente en expirant.',
        instructionDegre3: 'Montées de talons avec petite flexion des genoux sans à-coups.',
        intensity: 'doux',
        cadenceDegre1: 'Lenteur et amplitude',
        cadenceDegre2: 'Montées régulières',
        cadenceDegre3: 'Cadence souple',
        verseSnippet: 'Il donne de la force à celui qui est fatigué.',
        verseRef: 'Ésaïe 40:29',
        targetBpmDegre1: '58 - 68 BPM',
        targetBpmDegre2: '68 - 78 BPM',
        targetBpmDegre3: '80 - 90 BPM'
      },
      {
        id: 'w1-3',
        name: 'Retour au Calme & Bénédiction (Bille 3 : 9 min)',
        durationSeconds: 180,
        instructionDegre1: 'Immobilité complète. Posez les deux mains sur le cœur et laissez la paix de Christ vous entourer.',
        instructionDegre2: 'Ralentissez doucement vers l’arrêt. Longue expiration et prière d\'action de grâce.',
        instructionDegre3: 'Marche de décélération complète, mains jointes sur le sternum.',
        intensity: 'repos',
        cadenceDegre1: 'Immobilité bienfaisante',
        cadenceDegre2: 'Ralentissement total',
        cadenceDegre3: 'Ralentissement total',
        verseSnippet: 'C\'est par ses meurtrissures que nous sommes guéris.',
        verseRef: 'Ésaïe 53:5',
        targetBpmDegre1: '50 - 62 BPM',
        targetBpmDegre2: '60 - 70 BPM',
        targetBpmDegre3: '65 - 75 BPM'
      }
    ]
  },
  {
    id: 'endurance-david',
    title: 'L\'Endurance Paisible de David (15 min)',
    subtitle: 'Cardio Doux à Modéré pour tonifier les artères (5 billes)',
    biblicalTheme: 'Psaume 18:32-33 & 1 Chroniques 29:12',
    description: 'Une séance douce et fluide de 15 minutes (5 billes de 3 min) combinant marche sans heurt, ouvertures thoraciques et respirations rythmées.',
    defaultDegreeId: 'degre-2',
    totalDurationMinutes: 15,
    beadsCount: 5,
    idealFor: 'Fortification cardiaque progressive, baisse naturelle de la tension artérielle.',
    iconType: 'mountain',
    colorGradient: 'from-amber-500/20 to-orange-600/30',
    steps: [
      {
        id: 'w2-1',
        name: 'Échauffement Doux (Bille 1 : 3 min)',
        durationSeconds: 180,
        instructionDegre1: 'Marche assise ou petits pas lents avec roulement des épaules.',
        instructionDegre2: 'Marche tranquille sur place avec balancement naturel des bras.',
        instructionDegre3: 'Marche rythmée et respiration nasale constante.',
        intensity: 'doux',
        cadenceDegre1: '45 pas/min',
        cadenceDegre2: '65 pas/min',
        cadenceDegre3: '80 pas/min',
        verseSnippet: 'C\'est Dieu qui me ceint de force, et qui aplanit mon chemin.',
        verseRef: 'Psaume 18:32',
        targetBpmDegre1: '55 - 68 BPM',
        targetBpmDegre2: '70 - 82 BPM',
        targetBpmDegre3: '85 - 95 BPM'
      },
      {
        id: 'w2-2',
        name: 'Pas Réguliers de Foi (Bille 2 : 6 min)',
        durationSeconds: 180,
        instructionDegre1: 'Levez alternativement les talons en respirant avec le ventre.',
        instructionDegre2: 'Pas tranquilles avec ouvertures douces des bras vers le ciel.',
        instructionDegre3: 'Pas cadencés avec légères élévations des genoux sans forcer.',
        intensity: 'doux',
        cadenceDegre1: 'Lenteur réparatrice',
        cadenceDegre2: '65 pas/min fluide',
        cadenceDegre3: '80 pas/min dynamique',
        verseSnippet: 'Il rend mes pieds semblables à ceux des biches, et il me place sur mes lieux élevés.',
        verseRef: 'Psaume 18:33',
        targetBpmDegre1: '58 - 70 BPM',
        targetBpmDegre2: '72 - 82 BPM',
        targetBpmDegre3: '88 - 100 BPM'
      },
      {
        id: 'w2-3',
        name: 'Pas Chassés Doux (Bille 3 : 9 min)',
        durationSeconds: 180,
        instructionDegre1: 'Mouvements d’ouverture et fermeture des mains en respiration 5s/5s.',
        instructionDegre2: 'Deux petits pas lents vers la droite, puis deux vers la gauche.',
        instructionDegre3: 'Pas chassés latéraux contrôlés avec légères poussées douces des bras.',
        intensity: 'modere',
        cadenceDegre1: 'Douceur continue',
        cadenceDegre2: '60 pas/min',
        cadenceDegre3: '75 pas/min',
        verseSnippet: 'Dans ta main sont la force et la puissance, et c\'est ta main qui affermit tout.',
        verseRef: '1 Chroniques 29:12',
        targetBpmDegre1: '60 - 70 BPM',
        targetBpmDegre2: '75 - 85 BPM',
        targetBpmDegre3: '90 - 105 BPM'
      },
      {
        id: 'w2-4',
        name: 'Flexions Légères & Louange (Bille 4 : 12 min)',
        durationSeconds: 180,
        instructionDegre1: 'Assis, levez les bras vers le Très-Haut en inspirant, ramenez-les sur les genoux en expirant.',
        instructionDegre2: 'Flexions très douces des genoux (demi-squat) puis redressement tranquille.',
        instructionDegre3: 'Flexions douces et continues sans descendre trop bas pour préserver le cœur.',
        intensity: 'modere',
        cadenceDegre1: 'Mouvement fluide',
        cadenceDegre2: 'Descente et remontée lentes',
        cadenceDegre3: 'Cadence régulière',
        verseSnippet: 'L\'Éternel est ma force et mon bouclier; en lui mon cœur se confie, et je suis secouru.',
        verseRef: 'Psaume 28:7',
        targetBpmDegre1: '60 - 72 BPM',
        targetBpmDegre2: '75 - 85 BPM',
        targetBpmDegre3: '95 - 110 BPM'
      },
      {
        id: 'w2-5',
        name: 'Récupération & Bénédiction (Bille 5 : 15 min)',
        durationSeconds: 180,
        instructionDegre1: 'Immobilité totale, les yeux clos. Laissez votre cœur se poser dans les bras de Dieu.',
        instructionDegre2: 'Marche très lente de décompression. Sentez vos pulsations revenir au calme.',
        instructionDegre3: 'Ralentissement progressif vers l’arrêt total. Mains sur le cœur.',
        intensity: 'repos',
        cadenceDegre1: 'Repos céleste',
        cadenceDegre2: 'Décroissance lente',
        cadenceDegre3: 'Décroissance lente',
        verseSnippet: 'La paix de Dieu, qui surpasse toute intelligence, gardera vos cœurs.',
        verseRef: 'Philippiens 4:7',
        targetBpmDegre1: '50 - 65 BPM',
        targetBpmDegre2: '60 - 72 BPM',
        targetBpmDegre3: '65 - 75 BPM'
      }
    ]
  }
];
