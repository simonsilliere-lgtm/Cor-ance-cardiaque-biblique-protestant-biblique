export interface IllnessTopic {
  id: string;
  category: 'cardio' | 'chronique' | 'respiratoire' | 'anxiete' | 'convalescence' | 'hopital';
  title: string;
  subtitle: string;
  medicalContext: string;
  biblicalLight: string;
  keyVerse: {
    reference: string;
    text: string;
  };
  cardioAdvice: string;
  prayer: string;
  intercessionSubject: string;
}

export const ILLNESS_TOPICS: IllnessTopic[] = [
  {
    id: 'maladies-cardiovasculaires',
    category: 'cardio',
    title: 'Maladies Cardiaques, Hypertension & Cœur Fatigué',
    subtitle: 'Première cause d\'affliction corporelle dans le monde moderne',
    medicalContext: 'Dans le monde actuel, les cardiopathies, l’insuffisance cardiaque, l’infarctus et l’hypertension touchent des centaines de millions d’hommes et de femmes. Le stress chronique, l’alimentation et le manque de mouvement fragilisent les artères.',
    biblicalLight: 'La Bible accorde au cœur une place centrale: siège des émotions, de la volonté et de la vie physique. Proverbes 4:23 nous ordonne de veiller sur lui. Dieu compatit à la fragilité de nos cœurs et promet de nous donner un « cœur nouveau » délivré de l’endurcissement.',
    keyVerse: {
      reference: 'Proverbes 4:23 & Psaume 73:26',
      text: 'Garde ton cœur plus que toute autre chose, car de lui jaillissent les sources de la vie. [...] Ma chair et mon cœur peuvent défaillir: Dieu est le rocher de mon cœur et mon partage pour toujours.'
    },
    cardioAdvice: 'Marche quotidienne de 15 à 30 minutes à allure constante, réduction du sel, pratique de la cohérence cardiaque 3 fois par jour pour baisser la pression artérielle et réguler le nerf vague.',
    prayer: 'Père de grâce, je Te remets mon cœur malade ou fatigué, ainsi que tous les frères et sœurs hospitalisés en cardiologie dans le monde. Viens réguler ce muscle précieux, dissoudre les craintes et insuffler Ta vie nouvelle dans chaque vaisseau sanguin.',
    intercessionSubject: 'Pour toutes les personnes atteintes de troubles cardiaques, d\'hypertension ou en attente d\'une chirurgie du cœur.'
  },
  {
    id: 'douleurs-chroniques',
    category: 'chronique',
    title: 'Maladies Chroniques, Articulations & Corps Douloureux',
    subtitle: 'Quand la maladie s\'installe dans la durée et use l\'espérance',
    medicalContext: 'Arthrose, fibromyalgie, rhumatismes, maladies auto-immunes... Des millions de personnes vivent chaque jour avec une douleur physique persistante qui ronge l’humeur et immobilise.',
    biblicalLight: 'L’apôtre Paul lui-même vivait avec « une écharde dans la chair » (2 Co 12:7-9). Jésus a passé son ministère terrestre à s\'approcher des lépreux, des paralytiques et de ceux que la maladie tenait courbés depuis des années (Luc 13:11-13). Il n\'est jamais indifférent à nos larmes physiques.',
    keyVerse: {
      reference: '2 Corinthiens 12:9',
      text: 'Ma grâce te suffit, car ma puissance s\'accomplit dans la faiblesse. Je me glorifierai donc bien plus volontiers de mes faiblesses, afin que la puissance de Christ repose sur moi.'
    },
    cardioAdvice: 'Mobilisation articulaire douce et étirements sans impact brusque. La stimulation cardio douce libère des endorphines naturelles qui agissent comme analgésique divinement conçu par l’organisme.',
    prayer: 'Seigneur compatissant, Toi qui as porté nos douleurs sur la croix, pose Ta main apaisante sur mes membres endoloris. Donne-moi la force de me lever chaque matin et soutiens tous ceux qui souffrent en silence sur leur lit de douleur.',
    intercessionSubject: 'Pour les personnes luttant contre la douleur chronique, les rhumatismes et les maladies auto-immunes.'
  },
  {
    id: 'affections-respiratoires',
    category: 'respiratoire',
    title: 'Maladies Pulmonaires, Asthme & Souffle Court',
    subtitle: 'Quand respirer devient un combat quotidien',
    medicalContext: 'Bronchopneumopathies, asthme sévère, séquelles d’infections virales, pollution des grandes villes : le souffle est menacé et la cage thoracique s’oppresse, créant une angoisse d’étouffement.',
    biblicalLight: 'Le mot hébreu « Rouah » signifie à la fois souffle, vent et Esprit Saint. Le premier don de Dieu à l\'humain fut un souffle dans ses narines (Genèse 2:7). Jésus ressuscité souffla sur ses disciples pour leur donner la paix (Jean 20:22).',
    keyVerse: {
      reference: 'Job 33:4 & Psaume 150:6',
      text: 'L\'esprit de Dieu m\'a créé, et le souffle du Tout-Puissant m\'anime. Que tout ce qui respire loue l\'Éternel!'
    },
    cardioAdvice: 'Exercices de respiration ventrale lente par le nez avec lèvres pincées à l’expiration pour désencombrer les alvéoles et ouvrir les bronches en douceur sans forcer.',
    prayer: 'Dieu de vie, Toi qui as soufflé dans les narines d\'Adam, déploie Ta guérison sur mes poumons et mes bronches. Accorde un souffle libre et ample à tous ceux qui luttent aujourd\'hui pour chaque inspiration.',
    intercessionSubject: 'Pour les malades d\'asthme, de BPCO, sous assistance respiratoire et éprouvés par la dyspnée.'
  },
  {
    id: 'anxiete-oppression',
    category: 'anxiete',
    title: 'Anxiété, Arythmie Nerveuse & Dépression',
    subtitle: 'L\'impact du tourment intérieur sur le rythme cardiaque',
    medicalContext: 'La tachycardie anxieuse, les crises d’angoisse et la dépression créent des palpitations violentes, des sensations de boule au ventre et d’oppression thoracique, simulant des urgences cardiaques.',
    biblicalLight: 'David s’écriait dans le Psaume 42: « Pourquoi t\'abats-tu, mon âme, et gémis-tu au dedans de moi? Espère en Dieu ». La Bible ne méprise pas la détresse psychologique : elle offre l’ancre de la prière et la certitude que Dieu est proche de ceux qui ont le cœur brisé (Psaume 34:18).',
    keyVerse: {
      reference: 'Philippiens 4:6-7 & Jean 14:27',
      text: 'Ne vous inquiétez de rien... Et la paix de Dieu, qui surpasse toute intelligence, gardera vos cœurs et vos pensées en Jésus-Christ. Je vous laisse la paix, je vous donne ma paix.'
    },
    cardioAdvice: 'La cohérence cardiaque (5 minutes, 6 cycles respiratoires par minute) réinitialise le système nerveux autonome, enraye la boucle de panique et stabilise le pouls.',
    prayer: 'Prince de Paix, viens dissiper l’angoisse qui serre ma gorge et accélère follement les battements de mon cœur. Remplis mon esprit de Ta présence rassurante et délivre le monde du fléau de l’anxiété destructrice.',
    intercessionSubject: 'Pour ceux qui traversent la dépression, les attaques de panique, le burn-out et l\'oppression nerveuse.'
  },
  {
    id: 'convalescence-faiblesse',
    category: 'convalescence',
    title: 'Convalescence, Alitement & Vieillesse Fragile',
    subtitle: 'Accompagner la lente reconstruction des forces',
    medicalContext: 'Après une opération, une maladie infectieuse grave ou avec le grand âge, la masse musculaire fond rapidement et le cœur perd de son endurance à l\'effort.',
    biblicalLight: 'Le prophète Ésaïe proclame que même les jeunes gens peuvent chanceler, mais que ceux qui placent leur confiance en l’Éternel renouvellent leur force (Ésaïe 40:31). La guérison est souvent un chemin d’humilité et de fidélité jour après jour.',
    keyVerse: {
      reference: 'Ésaïe 40:31',
      text: 'Mais ceux qui se confient en l\'Éternel renouvellent leur force. Ils prennent le vol comme les aigles; ils courent, et ne se lassent point; ils marchent, et ne se fatiguent point.'
    },
    cardioAdvice: 'Commencer par de simples mouvements des chevilles et des poignets dans le lit, puis progresser vers la station debout et quelques pas cadencés sans précipitation.',
    prayer: 'Père fidèle, sois le tuteur de mes pas hésitants. Redonne de la vigueur à mes muscles fatigués et visite avec tendresse nos aînés et les convalescents esseulés.',
    intercessionSubject: 'Pour les personnes en rééducation, les résidents en EHPAD et ceux qui réapprennent à marcher.'
  },
  {
    id: 'hopitaux-monde',
    category: 'hopital',
    title: 'Hôpitaux, Urgences & Soignants dans le Monde',
    subtitle: 'La ligne de front contre la maladie sur tous les continents',
    medicalContext: 'Chaque seconde, des millions de médecins, chirurgiens, infirmières et aides-soignants luttent au chevet des malades dans des conditions parfois précaires ou submergées.',
    biblicalLight: 'Le bon Samaritain (Luc 10:33-35) a soigné les plaies avec de l’huile et du vin et a pris en charge les frais de l’auberge. La médecine et la compassion chrétienne marchent main dans la main depuis les premiers siècles de l’Église.',
    keyVerse: {
      reference: 'Matthieu 25:40 & Galates 6:2',
      text: 'Toutes les fois que vous avez fait ces choses à l\'un de ces plus petits de mes frères, c\'est à moi que vous les avez faites. Portez les fardeaux les uns des autres, et vous accomplirez ainsi la loi de Christ.'
    },
    cardioAdvice: 'Prier pour les soignants réduit le sentiment d’impuissance et élève l’âme dans une communion solidaire active.',
    prayer: 'Seigneur Dieu, bénis les mains des chirurgiens, la vigilance des infirmières et la recherche médicale. Réconforte chaque patient hospitalisé cette nuit et apporte la paix dans les chambres de réanimation.',
    intercessionSubject: 'Pour le personnel soignant mondial, les hôpitaux de campagne et les pays privés d\'accès aux soins vitaux.'
  }
];
