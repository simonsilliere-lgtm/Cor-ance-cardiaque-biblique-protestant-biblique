export interface BibleVerse {
  id: string;
  reference: string;
  book: string;
  chapter: number;
  verse: string;
  text: string; // Louis Segond 1910
  category: 'coeur' | 'guerison' | 'endurance' | 'souffle' | 'compassion' | 'paix';
  categoryLabel: string;
  cardioInsight: string;
  prayer: string;
}

export const BIBLE_VERSES: BibleVerse[] = [
  {
    id: 'prov-4-23',
    reference: 'Proverbes 4:23',
    book: 'Proverbes',
    chapter: 4,
    verse: '23',
    text: 'Garde ton cœur plus que toute autre chose, car de lui jaillissent les sources de la vie.',
    category: 'coeur',
    categoryLabel: 'Le Cœur & la Vie',
    cardioInsight: 'Le cœur physique comme le cœur spirituel est le moteur vital. Veiller sur lui par l’exercice modéré et la paix intérieure protège l’ensemble du corps.',
    prayer: 'Seigneur, je Te confie les battements de mon cœur. Purifie mes pensées et fortifie mon muscle cardiaque afin que ma vie Te glorifie.'
  },
  {
    id: 'prov-17-22',
    reference: 'Proverbes 17:22',
    book: 'Proverbes',
    chapter: 17,
    verse: '22',
    text: 'Un cœur joyeux est un bon remède, mais un esprit abattu dessèche les os.',
    category: 'coeur',
    categoryLabel: 'Le Cœur & la Santé',
    cardioInsight: 'La médecine moderne confirme que la joie et l’espérance diminuent le cortisol, régulent la tension artérielle et favorisent la vasodilatation coronaire.',
    prayer: 'Père céleste, inonde mon cœur de Ta sainte joie. Chasse l’angoisse et la tristesse qui oppriment ma poitrine.'
  },
  {
    id: 'esaie-40-29-31',
    reference: 'Ésaïe 40:29-31',
    book: 'Ésaïe',
    chapter: 40,
    verse: '29-31',
    text: 'Il donne de la force à celui qui est fatigué, et il augmente la vigueur de celui qui tombe en défaillance. Ceux qui se confient en l\'Éternel renouvellent leur force. Ils prennent le vol comme les aigles; ils courent, et ne se lassent point; ils marchent, et ne se fatiguent point.',
    category: 'endurance',
    categoryLabel: 'Endurance & Vigueur',
    cardioInsight: 'Quand les jambes faiblissent ou que le souffle manque durant l\'effort physique ou la maladie, la confiance en Dieu oxygène l\'esprit et relance la détermination.',
    prayer: 'Éternel mon Dieu, ranime mes forces. Quand mon corps est épuisé, sois le second souffle qui me soutient et me relève.'
  },
  {
    id: 'psaume-103-2-3',
    reference: 'Psaume 103:2-3',
    book: 'Psaumes',
    chapter: 103,
    verse: '2-3',
    text: 'Mon âme, bénis l\'Éternel, et n\'oublie aucun de ses bienfaits! C\'est lui qui pardonne toutes tes iniquités, qui guérit toutes tes maladies.',
    category: 'guerison',
    categoryLabel: 'Guérison Divine',
    cardioInsight: 'La gratitude et la louange apaisent le système nerveux parasympathique et ouvrent l’être tout entier à la restauration cellulaire.',
    prayer: 'Béni sois-tu Seigneur, toi qui connais chaque cellule et chaque artère de mon corps. Viens toucher et guérir ce qui est malade.'
  },
  {
    id: 'esaie-53-5',
    reference: 'Ésaïe 53:5',
    book: 'Ésaïe',
    chapter: 53,
    verse: '5',
    text: 'Mais il était blessé pour nos péchés, brisé pour nos iniquités; le châtiment qui nous donne la paix est tombé sur lui, et c\'est par ses meurtrissures que nous sommes guéris.',
    category: 'guerison',
    categoryLabel: 'Guérison Divine',
    cardioInsight: 'Le sacrifice du Christ englobe le salut de l\'âme et la compassion active pour la souffrance corporelle des malades.',
    prayer: 'Jésus, par Tes blessures, je réclame la guérison pour mon corps et pour tous ceux qui luttent aujourd\'hui dans les hôpitaux.'
  },
  {
    id: 'jeremie-30-17',
    reference: 'Jérémie 30:17',
    book: 'Jérémie',
    chapter: 30,
    verse: '17',
    text: 'Mais je te guérirai, je panserai tes blessures, dit l\'Éternel.',
    category: 'guerison',
    categoryLabel: 'Guérison Divine',
    cardioInsight: 'Une promesse rassurante face au diagnostic médical intimidant : Dieu est le grand médecin qui accompagne chaque traitement.',
    prayer: 'Père de miséricorde, panse mes blessures physiques et intérieures. Restaure mes facultés et redonne du tonus à mon cœur.'
  },
  {
    id: 'jacques-5-14-15',
    reference: 'Jacques 5:14-15',
    book: 'Jacques',
    chapter: 5,
    verse: '14-15',
    text: 'Quelqu\'un parmi vous est-il malade? Qu\'il appelle les anciens de l\'Église, et que les anciens prient pour lui, en l\'oignant d\'huile au nom du Seigneur; la prière de la foi sauvera le malade, et le Seigneur le relèvera.',
    category: 'compassion',
    categoryLabel: 'Prière pour les Malades',
    cardioInsight: 'La prière communautaire rompt l\'isolement des malades, réconforte le moral et soutient l\'organisme dans son combat contre la pathologie.',
    prayer: 'Seigneur, nous élevons vers Toi tous les malades isolés du monde. Que la foi de Tes serviteurs apporte réconfort et relèvement.'
  },
  {
    id: '1-cor-9-24-27',
    reference: '1 Corinthiens 9:24-26',
    book: '1 Corinthiens',
    chapter: 9,
    verse: '24-26',
    text: 'Ne savez-vous pas que ceux qui courent dans le stade courent tous, mais qu\'un seul remporte le prix? Courez de manière à le remporter. Tous ceux qui combattent s\'imposent toute espèce d\'abstinences. Moi donc, je cours, non pas comme à l\'aventure; je frappe, non pas comme battant l\'air.',
    category: 'endurance',
    categoryLabel: 'Discipline & Cardio',
    cardioInsight: 'L\'exercice cardiovasculaire demande de la régularité et de la persévérance. Entraîner son corps honore le Créateur qui nous en a fait dépositaires.',
    prayer: 'Donne-moi la discipline de soigner ce temple corporel que Tu m\'as confié, pas pour l\'orgueil, mais pour Te servir avec vigueur.'
  },
  {
    id: 'hebreux-12-1-2',
    reference: 'Hébreux 12:1-2',
    book: 'Hébreux',
    chapter: 12,
    verse: '1-2',
    text: 'Rejetons tout fardeau, et le péché qui nous enveloppe si facilement, et courons avec persévérance dans la carrière qui nous est ouverte, ayant les regards sur Jésus, le chef et le consommateur de la foi.',
    category: 'endurance',
    categoryLabel: 'Course de Foi',
    cardioInsight: 'Débarrasser son cœur des fardeaux émotionnels réduit la charge cardiaque et permet d’avancer avec légèreté et souffle.',
    prayer: 'Je dépose à Tes pieds mes peurs et mes angoisses. Que mon souffle soit libre et mes pas affermis dans Ta direction.'
  },
  {
    id: 'genese-2-7',
    reference: 'Genèse 2:7',
    book: 'Genèse',
    chapter: 2,
    verse: '7',
    text: 'L\'Éternel Dieu forma l\'homme de la poussière de la terre, il souffla dans ses narines un souffle de vie et l\'homme devint un être vivant.',
    category: 'souffle',
    categoryLabel: 'Le Souffle Sacré',
    cardioInsight: 'Chaque inspiration consciente lors de la cohérence cardiaque rappelle le premier souffle accordé par Dieu pour animer notre cœur.',
    prayer: 'Merci mon Dieu pour chaque inspiration. Fais descendre Ta paix vivifiante dans mes poumons et dans mon flux sanguin.'
  },
  {
    id: 'psaume-73-26',
    reference: 'Psaume 73:26',
    book: 'Psaumes',
    chapter: 73,
    verse: '26',
    text: 'Ma chair et mon cœur peuvent défaillir: Dieu est le rocher de mon cœur et mon partage pour toujours.',
    category: 'coeur',
    categoryLabel: 'Le Cœur & la Faiblesse',
    cardioInsight: 'Même lors des faiblesses cardiovasculaires ou des malaises physiques, notre sécurité profonde réside en Dieu qui stabilise notre être.',
    prayer: 'Quand mon cœur faiblit et bat de manière irrégulière, sois mon ancre et mon rocher inébranlable.'
  },
  {
    id: 'ezechiel-36-26',
    reference: 'Ézéchiel 36:26',
    book: 'Ézéchiel',
    chapter: 36,
    verse: '26',
    text: 'Je vous donnerai un cœur nouveau, et je mettrai en vous un esprit nouveau; j\'ôterai de votre corps le cœur de pierre, et je vous donnerai un cœur de chair.',
    category: 'coeur',
    categoryLabel: 'Régénération Cardiaque',
    cardioInsight: 'Un cœur souple, sans rigidité artérielle ni durcissement intérieur, est la promesse d’une vie renouvelée et sensible à la grâce.',
    prayer: 'Ôte la dureté, l’amertume et les tensions accumulées dans ma poitrine. Donne-moi un cœur doux, souple et vigoureux.'
  },
  {
    id: 'philippiens-4-6-7',
    reference: 'Philippiens 4:6-7',
    book: 'Philippiens',
    chapter: 4,
    verse: '6-7',
    text: 'Ne vous inquiétez de rien; mais en toute chose faites connaître vos besoins à Dieu par des prières et des supplications, avec des actions de grâces. Et la paix de Dieu, qui surpasse toute intelligence, gardera vos cœurs et vos pensées en Jésus-Christ.',
    category: 'paix',
    categoryLabel: 'Paix & Rythme Cardiaque',
    cardioInsight: 'La prière de gratitude abaisse le rythme cardiaque au repos et équilibre la variabilité cardiaque (VRC), protégeant contre l\'arythmie de stress.',
    prayer: 'Que Ta paix surnaturelle vienne monter la garde autour de mon cœur et apaiser chaque battement trop rapide.'
  },
  {
    id: 'jean-14-27',
    reference: 'Jean 14:27',
    book: 'Jean',
    chapter: 14,
    verse: '27',
    text: 'Je vous laisse la paix, je vous donne ma paix. Je ne vous donne pas comme le monde donne. Que votre cœur ne se trouble point, et ne s\'alarme point.',
    category: 'paix',
    categoryLabel: 'Sérénité Intérieure',
    cardioInsight: 'La sérénité promise par le Christ est un puissant protecteur vasculaire contre l’hypertension nerveuse.',
    prayer: 'Jésus, je reçois Ta paix dans mon cœur. Aucune peur du monde ni de la maladie ne peut me ravir cette assurance.'
  },
  {
    id: '2-cor-12-9',
    reference: '2 Corinthiens 12:9',
    book: '2 Corinthiens',
    chapter: 12,
    verse: '9',
    text: 'Et il m\'a dit: Ma grâce te suffit, car ma puissance s\'accomplit dans la faiblesse. Je me glorifierai donc bien plus volontiers de mes faiblesses, afin que la puissance de Christ repose sur moi.',
    category: 'guerison',
    categoryLabel: 'Force dans l\'Infirmité',
    cardioInsight: 'Pour ceux dont le corps est limité par la maladie ou le cœur fatigué, la grâce offre une endurance intérieure insoupçonnée.',
    prayer: 'Même si mon corps est affaibli, Ta grâce me soutient. Révèle Ta force dans mes limites aujourd\'hui.'
  },
  {
    id: 'matthieu-25-36',
    reference: 'Matthieu 25:36',
    book: 'Matthieu',
    chapter: 25,
    verse: '36',
    text: 'J\'étais nu, et vous m\'avez vêtu; j\'étais malade, et vous m\'avez visité; j\'étais en prison, et vous êtes venus vers moi.',
    category: 'compassion',
    categoryLabel: 'Compassion Mondiale',
    cardioInsight: 'Porter attention aux malades de notre monde active l\'ocytocine et le nerf vague, renforçant notre propre santé cardiovasculaire.',
    prayer: 'Seigneur, mets dans mon cœur un amour actif pour les malades, les grabataires et ceux qui souffrent seuls en ce moment.'
  }
];

export const CATEGORIES_CONFIG = [
  { id: 'all', label: 'Tous les versets' },
  { id: 'coeur', label: 'Cœur & Rythme' },
  { id: 'guerison', label: 'Guérison Divine' },
  { id: 'endurance', label: 'Cardio & Vigueur' },
  { id: 'souffle', label: 'Souffle & Vie' },
  { id: 'compassion', label: 'Malades du Monde' },
  { id: 'paix', label: 'Paix & Anti-Stress' },
] as const;
