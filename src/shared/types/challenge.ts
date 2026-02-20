export type ChallengeType = 
  | 'dementor'
  | 'spider'
  | 'fire'
  | 'devil-snare'
  | 'serpent'
  | 'ice-trap';

export type ChallengeDifficulty = 'easy' | 'medium' | 'hard';

export interface Challenge {
  type: ChallengeType;
  spell: string;
  spellLatin?: string;
  difficulty: ChallengeDifficulty;
  description: string;
  enemyName: string;
  color: string;
  glowColor: string;
  duration: number;
  tolerance: number;
  controlPoints: number;
}

export interface ChallengeResult {
  success: boolean;
  xpBonus: number;
  hintRevealed: boolean;
  hint?: string;
  completionTime?: number;
}

export const CHALLENGE_CONFIG: Record<ChallengeType, Challenge> = {
  dementor: {
    type: 'dementor',
    spell: 'Expecto Patronum',
    spellLatin: 'Expecto Patronum',
    difficulty: 'hard',
    description: 'Un Détraqueur surgit des ténèbres !',
    enemyName: 'Détraqueur',
    color: '#C0D6E4',
    glowColor: 'rgba(192, 214, 228, 0.8)',
    duration: 10000,
    tolerance: 35,
    controlPoints: 6,
  },
  spider: {
    type: 'spider',
    spell: 'Arania Exumai',
    spellLatin: 'Arania Exumai',
    difficulty: 'medium',
    description: 'Une araignée géante vous attaque !',
    enemyName: 'Acromentule',
    color: '#E74C3C',
    glowColor: 'rgba(231, 76, 60, 0.8)',
    duration: 12000,
    tolerance: 40,
    controlPoints: 5,
  },
  fire: {
    type: 'fire',
    spell: 'Aguamenti',
    spellLatin: 'Aguamenti',
    difficulty: 'easy',
    description: 'Des flammes magiques se répandent !',
    enemyName: 'Incendie Maudit',
    color: '#3498DB',
    glowColor: 'rgba(52, 152, 219, 0.8)',
    duration: 15000,
    tolerance: 45,
    controlPoints: 5,
  },
  'devil-snare': {
    type: 'devil-snare',
    spell: 'Lumos Solem',
    spellLatin: 'Lumos Solem',
    difficulty: 'medium',
    description: 'Le Filet du Diable vous enserre !',
    enemyName: 'Filet du Diable',
    color: '#F39C12',
    glowColor: 'rgba(243, 156, 18, 0.8)',
    duration: 12000,
    tolerance: 40,
    controlPoints: 5,
  },
  serpent: {
    type: 'serpent',
    spell: 'Vipera Evanesca',
    spellLatin: 'Vipera Evanesca',
    difficulty: 'easy',
    description: 'Un serpent venimeux se dresse !',
    enemyName: 'Serpent Maudit',
    color: '#2ECC71',
    glowColor: 'rgba(46, 204, 113, 0.8)',
    duration: 15000,
    tolerance: 45,
    controlPoints: 5,
  },
  'ice-trap': {
    type: 'ice-trap',
    spell: 'Incendio',
    spellLatin: 'Incendio',
    difficulty: 'medium',
    description: 'Un piège de glace vous emprisonne !',
    enemyName: 'Piège Glacé',
    color: '#E67E22',
    glowColor: 'rgba(230, 126, 34, 0.8)',
    duration: 12000,
    tolerance: 40,
    controlPoints: 5,
  },
};

export const XP_BONUS = 30;
export const HINT_REVEAL_CHANCE = 0.2; // 20%
export const CHALLENGE_SPAWN_RATE = 0.3; // 30%
