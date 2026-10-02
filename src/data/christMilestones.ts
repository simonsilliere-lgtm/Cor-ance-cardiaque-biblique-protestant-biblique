export interface ChristMilestone {
  minuteMark: number; // e.g. 3, 6, 9, 12, 15, 18, 20
  title: string;
  theme: string;
  scriptureRef: string;
  scriptureText: string;
  cantiqueExcerpt: string;
  christWorkInsight: string;
}

export const CHRIST_MILESTONES: ChristMilestone[] = [
  {
    minuteMark: 3,
    title: 'Bille 1 (3 min) — L\'Amour & l\'Incarnation du Christ',
    theme: 'Le Don Incomparable du Père',
    scriptureRef: 'Jean 3:16',
    scriptureText: 'Car Dieu a tant aimé le monde qu\'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu\'il ait la vie éternelle.',
    cantiqueExcerpt: '« Ô amour sublime! Ô grâce infinie! Jésus quitta le ciel pour sauver ma vie. »',
    christWorkInsight: '3 minutes de cœur vivifié. Méditez sur Jésus qui a pris notre condition humaine pour porter nos infirmités corporelles.'
  },
  {
    minuteMark: 6,
    title: 'Bille 2 (6 min) — Les Miracles & la Compassion de Jésus',
    theme: 'Le Bon Berger qui Guérit',
    scriptureRef: 'Matthieu 8:16-17',
    scriptureText: 'Il guérit tous les malades, afin que s\'accomplît ce qui avait été annoncé par Ésaïe, le prophète: Il a pris nos infirmités, et il s\'est chargé de nos maladies.',
    cantiqueExcerpt: '« Sur les flots agités, Sa voix dit: Paix soit avec toi! Jésus entend mon cri. »',
    christWorkInsight: '6 minutes accomplies. Christ parcourait les villages en guérissant ceux qui souffraient. Il voit la fatigue de votre cœur aujourd\'hui.'
  },
  {
    minuteMark: 9,
    title: 'Bille 3 (9 min) — Gethsémané & l\'Obéissance Suprême',
    theme: 'La Soumission d\'Amour',
    scriptureRef: 'Matthieu 26:39',
    scriptureText: 'Mon Père, s\'il est possible, que cette coupe s\'éloigne de moi! Toutefois, non pas ce que je veux, mais ce que tu veux.',
    cantiqueExcerpt: '« Au jardin des oliviers, dans l\'angoisse et la nuit, Jésus a prié pour que je vive. »',
    christWorkInsight: '9 minutes accomplies. Dans l\'angoisse où sa sueur devint comme des grumeaux de sang, Jésus a vaincu la peur pour nous secourir.'
  },
  {
    minuteMark: 12,
    title: 'Bille 4 (12 min) — La Croix & « Tout est Accompli »',
    theme: 'Le Sacrifice Parfait & la Guérison',
    scriptureRef: 'Jean 19:30 & 1 Pierre 2:24',
    scriptureText: 'Quand Jésus eut pris le vinaigre, il dit: Tout est accompli. Et, baissant la tête, il rendit l\'esprit... Lui par les meurtrissures duquel vous avez été guéris.',
    cantiqueExcerpt: '« À la croix où mourut mon Sauveur, mon cœur a trouvé le pardon, la guérison et la paix. »',
    christWorkInsight: '12 minutes accomplies. Le mot grec « Tetelestai » : la dette est payée, la maladie n\'a pas le dernier mot. Votre corps est racheté.'
  },
  {
    minuteMark: 15,
    title: 'Bille 5 (15 min) — La Résurrection Triomphante',
    theme: 'La Victoire Définitive sur la Mort',
    scriptureRef: '1 Corinthiens 15:20-22',
    scriptureText: 'Mais maintenant, Christ est ressuscité des morts, il est les prémices de ceux qui sont morts... comme tous meurent en Adam, de même aussi tous revivront en Christ.',
    cantiqueExcerpt: '« À Toi la gloire, ô Ressuscité! À Toi la victoire pour l\'éternité! Plus de nuit, plus de mort! »',
    christWorkInsight: '15 minutes accomplies. Le tombeau est vide! La même puissance qui a ressuscité Jésus d\'entre les morts vivifie aujourd\'hui vos artères et votre souffle.'
  },
  {
    minuteMark: 18,
    title: 'Bille 6 (18 min) — Le Souffle du Ressuscité & l\'Esprit',
    theme: 'La Régénération Cardiaque & Spirituelle',
    scriptureRef: 'Jean 20:22 & Romains 8:11',
    scriptureText: 'Après ces paroles, il souffla sur eux, et leur dit: Recevez le Saint-Esprit... L\'Esprit de celui qui a ressuscité Jésus rendra aussi la vie à vos corps mortels.',
    cantiqueExcerpt: '« Souffle du Dieu vivant, viens embraser mon cœur, ranime mes forces et chasse ma torpeur. »',
    christWorkInsight: '18 minutes accomplies. Le souffle de Christ renouvelle la vitalité de votre poitrine. Votre endurance est une offrande à sa gloire.'
  },
  {
    minuteMark: 20,
    title: 'Bille 7 (20 min MAX) — La Couronne de Justice & la Gloire',
    theme: 'La Course Achevée dans la Foi',
    scriptureRef: '2 Timothée 4:7-8',
    scriptureText: 'J\'ai combattu le bon combat, j\'ai achevé la course, j\'ai gardé la foi. Désormais la couronne de justice m\'est réservée, le Seigneur, le juste juge, me la donnera.',
    cantiqueExcerpt: '« Quand les rachetés entreront dans la cité d\'or, nous chanterons la louange de l\'Agneau! »',
    christWorkInsight: '20 minutes — Maximum atteint! Votre séance est pleinement accomplie. Vous avez persévéré avec fidélité, le cœur fortifié en Christ.'
  }
];

export function getMilestoneForMinute(minute: number): ChristMilestone | undefined {
  return CHRIST_MILESTONES.find((m) => m.minuteMark === minute);
}

export function getMilestonesForDuration(totalMinutes: number): ChristMilestone[] {
  const cap = Math.min(20, totalMinutes);
  return CHRIST_MILESTONES.filter((m) => m.minuteMark <= cap);
}
