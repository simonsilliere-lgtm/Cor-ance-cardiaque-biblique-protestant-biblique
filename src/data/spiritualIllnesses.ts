export interface SpiritualIllness {
  id: string;
  name: string;
  tagline: string;
  category: 'foi' | 'emotion' | 'moral' | 'communion';
  spiritualSymptoms: string[];
  impactOnPhysicalHeart: string;
  biblicalDiagnosis: string;
  keyVerse: {
    reference: string;
    text: string; // Louis Segond 1910
  };
  supportingVerses: {
    reference: string;
    text: string;
  }[];
  practicalPrescription: string[];
  victoryDeclaration: string;
  prayer: string;
}

export const SPIRITUAL_ILLNESSES: SpiritualIllness[] = [
  {
    id: 'doute',
    name: 'Le Doute & L\'Incrédulité',
    tagline: 'L\'érosion de la foi sous le coup des épreuves et du silence divin',
    category: 'foi',
    spiritualSymptoms: [
      'Remise en question des promesses de Dieu',
      'Prière hésitante et sans conviction d’exaucement',
      'Regard constamment fixé sur les circonstances plutôt que sur le Seigneur',
      'Sensation que Dieu est lointain ou indifférent'
    ],
    impactOnPhysicalHeart: 'Provoque une tension nerveuse sourde, une arythmie émotionnelle et une difficulté à trouver le repos vagal profond.',
    biblicalDiagnosis: 'Jacques compare celui qui doute au flot de la mer agité par le vent (Jacques 1:6). Jésus a tendu la main à Pierre qui coulait en disant : « Homme de peu de foi, pourquoi as-tu douté? » (Matthieu 14:31). Le doute est une brèche, mais Christ y répond par sa fidélité.',
    keyVerse: {
      reference: 'Jacques 1:6',
      text: 'Mais qu\'il la demande avec foi, sans douter; car celui qui doute est semblable au flot de la mer, agité par le vent et poussé de côté et d\'autre.'
    },
    supportingVerses: [
      {
        reference: 'Marc 9:24',
        text: 'Aussitôt le père de l\'enfant s\'écria: Je crois! viens au secours de mon incrédulité!'
      },
      {
        reference: 'Hébreux 11:1',
        text: 'Or la foi est une ferme assurance des choses qu\'on espère, une démonstration de celles qu\'on ne voit pas.'
      }
    ],
    practicalPrescription: [
      'Crier sincèrement à Jésus comme le père dans Marc 9:24 : « Viens au secours de mon incrédulité! »',
      'Lire à voix haute 3 psaumes de louange (ex: Psaume 23, 103, 139) pour rééduquer votre esprit par la Parole entendue (Romains 10:17).',
      'Tenir un carnet des bienfaits passés de Dieu pour contrer les mensonges de l’oubli.',
      'Associer 5 minutes de respiration de cohérence cardiaque en répétant mentalement : « Jésus, j’ai confiance en Toi ».'
    ],
    victoryDeclaration: 'Par la foi en Jésus-Christ, je repousse le doute. La Parole de Dieu est vérité immuable et mon ancre sûre dans la tempête.',
    prayer: 'Seigneur Jésus, pardonne mes doutes. Quand mes yeux ne voient que des montagnes et des maladies, fortifie ma foi. Viens au secours de mon incrédulité et ancre mon cœur dans Ta Parole éternelle.'
  },
  {
    id: 'decouragement',
    name: 'Le Découragement & L\'Abattement',
    tagline: 'L\'épuisement de l’âme quand la lutte semble vaine et prolongée',
    category: 'emotion',
    spiritualSymptoms: [
      'Perte d’élan dans la prière et sentiment d’inutilité',
      'Désir de tout abandonner ou de fuir (comme Élie sous le genêt)',
      'Focalisation exclusive sur les échecs et la fatigue physique',
      'Sommeil non réparateur et lassitude dès le réveil'
    ],
    impactOnPhysicalHeart: 'Hypotension de fatigue ou élévation du cortisol chronique, sensation de cœur « lourd comme une pierre » dans la poitrine.',
    biblicalDiagnosis: 'Élie le prophète a connu ce point de rupture (1 Rois 19:4). Dieu n\'a pas condamné son découragement : Il lui a envoyé un ange pour lui donner du pain, de l’eau et du repos, avant de lui parler d’une voix douce.',
    keyVerse: {
      reference: 'Ésaïe 40:29-31',
      text: 'Il donne de la force à celui qui est fatigué, et il augmente la vigueur de celui qui tombe en défaillance... Ceux qui se confient en l\'Éternel renouvellent leur force. Ils prennent le vol comme les aigles; ils courent, et ne se lassent point; ils marchent, et ne se fatiguent point.'
    },
    supportingVerses: [
      {
        reference: 'Josué 1:9',
        text: 'Ne t\'ai-je pas donné cet ordre: Fortifie-toi et prends courage? Ne t\'effraie point et ne t\'épouvante point, car l\'Éternel, ton Dieu, est avec toi dans tout ce que tu entreprendras.'
      },
      {
        reference: 'Galates 6:9',
        text: 'Ne nous lassons pas de faire le bien; car nous moissonnerons au temps convenable, si nous ne nous relâchons pas.'
      }
    ],
    practicalPrescription: [
      'Respecter le repos sabbatique du corps : dormir, s’hydrater et marcher 15 minutes en pleine lumière pour stimuler la circulation.',
      'Refuser d’écouter la voix de l’accusateur ; proclamer Josué 1:9 chaque matin devant le miroir.',
      'Rompre l’isolement en partageant son fardeau avec un frère ou une sœur de foi.',
      'Effectuer la séance « Marche de la Grâce & Guérison » pour relancer la dopamine et la vigueur corporelle.'
    ],
    victoryDeclaration: 'Je ne succomberai point au découragement. Mon secours vient de l’Éternel qui a fait les cieux et la terre; Il ne permettra point que mon pied chancelle.',
    prayer: 'Père des miséricordes, relève mon esprit abattu. Comme Tu as nourri Élie au désert, viens raviver mon âme fatiguée et mon cœur languissant. Remplis-moi d’une sainte espérance.'
  },
  {
    id: 'peche-culpabilite',
    name: 'Le Péché, La Chute & La Culpabilité',
    tagline: 'L\'oppression morale consécutive à la faute et le sentiment d’indignité',
    category: 'moral',
    spiritualSymptoms: [
      'Honte paralysante et fuite de la présence de Dieu',
      'Peur du châtiment et croyance que le pardon est impossible',
      'Rechutes répétées dans une faiblesse charnelle',
      'Voix intérieure d’auto-condamnation'
    ],
    impactOnPhysicalHeart: 'Psaume 32:3 : « Tant que je me suis tu, mes os se consumaient ». La culpabilité non confessée resserre les coronaires et augmente l’angoisse cardiaque.',
    biblicalDiagnosis: 'David après sa faute a trouvé le relèvement par la repentance humble : « Ô Dieu! crée en moi un cœur pur » (Psaume 51:12). 1 Jean 1:9 garantit que si nous confessons nos péchés, Il est fidèle et juste pour nous les pardonner.',
    keyVerse: {
      reference: '1 Jean 1:9',
      text: 'Si nous confessons nos péchés, il est fidèle et juste pour nous les pardonner, et pour nous purifier de toute iniquité.'
    },
    supportingVerses: [
      {
        reference: 'Romains 8:1',
        text: 'Il n\'y a donc maintenant aucune condamnation pour ceux qui sont en Jésus-Christ.'
      },
      {
        reference: 'Psaume 51:12',
        text: 'Ô Dieu! crée en moi un cœur pur, renouvelle en moi un esprit bien disposé.'
      }
    ],
    practicalPrescription: [
      'Confession immédiate et transparente à Dieu dans le secret, sans chercher à minimiser ni à s’apitoyer.',
      'S’approprier fermement le sang de Jésus qui purifie toute conscience des œuvres mortes (Hébreux 9:14).',
      'Rejeter l’accusation diabolique : il n’y a AUCUNE condamnation en Christ (Romains 8:1).',
      'Mettre en place des gardes-fous concrets (éloigner les tentations, couper les accès néfastes).'
    ],
    victoryDeclaration: 'Par le sang de l’Agneau, je suis purifié et réconcilié. Le péché n’a plus de pouvoir sur moi car je suis sous la grâce souveraine de Christ.',
    prayer: 'Seigneur Dieu, j’ai péché contre Toi. Dans Ta compassion infinie, efface mes transgressions. Lave-moi et je serai plus blanc que la neige. Donne-moi la force de marcher désormais dans la sainteté.'
  },
  {
    id: 'amertume',
    name: 'L\'Amertume & Le Ressentiment',
    tagline: 'Le poison de la rancune qui durcit le muscle et l’âme',
    category: 'moral',
    spiritualSymptoms: [
      'Ruminations constantes sur les torts subis et les offenses d’autrui',
      'Désir secret de revanche ou joie maligne devant le malheur d’autrui',
      'Fermeture affective et méfiance généralisée envers les autres',
      'Incapacité à bénir ceux qui ont fait du mal'
    ],
    impactOnPhysicalHeart: 'L’amertume est un puissant facteur de rigidité artérielle, de pics hypertensifs et d’infarctus du myocarde prouvé par la cardiologie moderne.',
    biblicalDiagnosis: 'Hébreux 12:15 avertit qu’une racine d’amertume produit du trouble et infecte un grand nombre. Ézéchiel 36:26 parle de ce « cœur de pierre » que Dieu désire remplacer par un « cœur de chair ».',
    keyVerse: {
      reference: 'Éphésiens 4:31-32',
      text: 'Que toute amertume, toute animosité, toute colère, toute clameur, toute calomnie, et toute espèce de méchanceté, disparaissent du milieu de vous. Soyez bons les uns envers les autres, compatissants, vous pardonnant réciproquement, comme Dieu vous a pardonné en Christ.'
    },
    supportingVerses: [
      {
        reference: 'Hébreux 12:15',
        text: 'Veillez à ce que nul ne se prive de la grâce de Dieu; à ce qu\'aucune racine d\'amertume, poussant des rejetons, ne produise du trouble, et que plusieurs n\'en soient infectés.'
      },
      {
        reference: 'Matthieu 6:14-15',
        text: 'Si vous pardonnez aux hommes leurs offenses, votre Père céleste vous pardonnera aussi.'
      }
    ],
    practicalPrescription: [
      'Distinguer pardon et sentiment : le pardon est un acte de volonté et d’obéissance, pas une émotion.',
      'Prier nominativement pour la personne blessante : « Père, bénis [Nom] et sauve son âme » (Matthieu 5:44).',
      'Exercice de libération respiratoire : expirer longuement en relâchant la rancune entre les mains du Juste Juge.',
      'Remplacer le souvenir de la blessure par la méditation de la croix où Jésus pria : « Père, pardonne-leur ».'
    ],
    victoryDeclaration: 'Je déracine toute amertume de ma poitrine. Je choisis de pardonner comme Christ m’a pardonné, et mon cœur retrouve sa liberté et sa douceur.',
    prayer: 'Jésus, Toi qui as pardonné à Tes bourreaux, brise la coquille d’amertume qui enserre mon cœur. Je remets entre Tes mains les personnes qui m\'ont blessé(e). Libère-moi et rends mon cœur doux et compatissant.'
  },
  {
    id: 'peur-angoisse',
    name: 'La Peur, L\'Angoisse & La Panique Spirituelle',
    tagline: 'La terreur de l’avenir, de la maladie et de la mort',
    category: 'emotion',
    spiritualSymptoms: [
      'Anticipation catastrophiste permanente du lendemain',
      'Peur de la maladie grave ou d’une mauvaise nouvelle soudaine',
      'Agitation fébrile et incapacité à rester en silence devant Dieu',
      'Paralysie dans l’action et repli peureux'
    ],
    impactOnPhysicalHeart: 'Tachycardie nerveuse récurrente, extrasystoles bénignes mais angoissantes, palpitations et sensation de gorge serrée.',
    biblicalDiagnosis: 'Paul rappelle à Timothée : « Ce n\'est pas un esprit de timidité que Dieu nous a donné, mais un esprit de force, d\'amour et de sagesse » (2 Timothée 1:7). La peur est un esprit d’esclavage chassé par l’amour parfait (1 Jean 4:18).',
    keyVerse: {
      reference: '2 Timothée 1:7',
      text: 'Car ce n\'est pas un esprit de timidité que Dieu nous a donné, mais un esprit de force, d\'amour et de sagesse.'
    },
    supportingVerses: [
      {
        reference: 'Psaume 34:5',
        text: 'J\'ai cherché l\'Éternel, et il m\'a répondu; il m\'a délivré de toutes mes frayeurs.'
      },
      {
        reference: 'Ésaïe 41:10',
        text: 'Ne crains rien, car je suis avec toi; ne promène pas des regards inquiets, car je suis ton Dieu; je te fortifie, je viens à ton secours, je te soutiens de ma droite triomphante.'
      }
    ],
    practicalPrescription: [
      'Effectuer 5 à 10 minutes de cohérence cardiaque céleste pour désactiver l’amygdale cérébrale.',
      'Déclarer à haute voix Ésaïe 41:10 dès l’apparition des premiers signes de panique ou de palpitations.',
      'Couper les flux d’informations anxiogènes et les réseaux sociaux pendant 48 heures.',
      'Faire une marche de prière en plein air en observant les oiseaux du ciel (Matthieu 6:26).'
    ],
    victoryDeclaration: 'L’Éternel est ma lumière et mon salut : de qui aurais-je crainte? L’Éternel est le soutien de ma vie : de qui aurais-je peur? Je suis en sécurité sous ses ailes.',
    prayer: 'Éternel mon Dieu, chasse la terreur et l’angoisse qui oppriment ma poitrine. Répands Ton amour parfait qui bannit toute crainte. Sois mon bouclier et mon rocher inébranlable.'
  },
  {
    id: 'tiedeure',
    name: 'La Tiédeur & La Négligence Spirituelle',
    tagline: 'L\'assoupissement de la vigilance et la perte du premier amour',
    category: 'communion',
    spiritualSymptoms: [
      'Disparition progressive de la prière quotidienne et de la lecture biblique',
      'Conformisme aux mœurs du monde sans remords de conscience',
      'Indifférence face aux souffrances d’autrui et aux malades',
      'Pratique religieuse machinale et sans flamme intérieure'
    ],
    impactOnPhysicalHeart: 'Sédentarité physique couplée à la somnolence spirituelle : perte de tonicité cardio-vasculaire et apathie générale.',
    biblicalDiagnosis: 'Dans Apocalypse 3:15-16, le Christ avertit l\'Église de Laodicée : « Parce que tu es tiède, et que tu n\'es ni froid ni bouillant, je te vomirai de ma bouche ». Dieu nous appelle au zèle ardent de l\'Esprit.',
    keyVerse: {
      reference: 'Apocalypse 3:19-20',
      text: 'Moi, je reprends et je châtie tous ceux que j\'aime. Aie donc du zèle, et repens-toi. Voici, je me tiens à la porte, et je frappe. Si quelqu\'un entend ma voix et ouvre la porte, j\'entrerai chez lui, je souperai avec lui, et lui avec moi.'
    },
    supportingVerses: [
      {
        reference: 'Romains 12:11',
        text: 'Ayez du zèle, et non de la paresse. Soyez fervents d\'esprit. Servez le Seigneur.'
      },
      {
        reference: 'Psaume 63:2',
        text: 'Ô Dieu! tu es mon Dieu, je te cherche; mon âme a soif de toi, mon corps soupire après toi, dans une terre aride, desséchée, sans eau.'
      }
    ],
    practicalPrescription: [
      'Fixer un rendez-vous sacré non négociable de 15 minutes chaque matin avec le Seigneur.',
      'S’engager dans une action de compassion concrète : visiter un malade ou soutenir une personne souffrante.',
      'Commencer une séance de stimulation cardio énergique (« Course de l\'Apôtre Paul ») pour réveiller le corps et secouer l’apathie.',
      'Jeûner d’un repas ou d’un divertissement pour réaffamer l’esprit.'
    ],
    victoryDeclaration: 'Mon cœur ne demeurera pas tiède. Par le feu du Saint-Esprit, je retrouve le zèle et la passion pour la gloire de mon Sauveur!',
    prayer: 'Seigneur Jésus, pardonne ma tiédeur et ma négligence. Rallume en moi la flamme de Ton premier amour. Fais de mon cœur un autel vivant brûlant de foi et de sainteté.'
  }
];

export interface SpiritualBattleEntry {
  id: string;
  illnessId: string;
  illnessName: string;
  date: string;
  intensityLevel: number; // 1 to 5
  notes: string;
  appliedPrescription: string;
  status: 'en_combat' | 'victoire' | 'progression';
  scriptureMeditated: string;
}
