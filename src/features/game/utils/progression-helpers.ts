/**
 * Helpers pour la gestion de la progression
 */

import { StoryLevel } from '@/shared/types/game';

/**
 * Valide que les niveaux chargés contiennent Hermione ET Hagrid
 */
export function validateLevels(levels: StoryLevel[]): boolean {
  const hasHermione = levels.some(l => l.id === 'level-hermione-1');
  const hasHagrid = levels.some(l => l.id === 'level-hagrid-1');
  return hasHermione && hasHagrid;
}

/**
 * Charge les niveaux depuis localStorage avec validation
 */
export function loadFromLocalStorage(): StoryLevel[] | null {
  const saved = localStorage.getItem('bertrand-story-progress');
  if (!saved) return null;
  
  try {
    const parsed = JSON.parse(saved);
    return validateLevels(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Sauvegarde les niveaux dans localStorage
 */
export function saveToLocalStorage(levels: StoryLevel[]): void {
  localStorage.setItem('bertrand-story-progress', JSON.stringify(levels));
}

/**
 * Met à jour un niveau et déverrouille le suivant
 */
export function updateLevelCompletion(
  levels: StoryLevel[],
  levelId: string
): StoryLevel[] {
  const levelIndex = levels.findIndex(l => l.id === levelId);
  if (levelIndex === -1) return levels;

  const updatedLevels = [...levels];
  const currentLevel = updatedLevels[levelIndex];
  
  if (currentLevel.status === 'completed') {
    return levels;
  }

  updatedLevels[levelIndex] = {
    ...currentLevel,
    status: 'completed'
  };

  if (levelIndex < updatedLevels.length - 1) {
    const nextLevel = updatedLevels[levelIndex + 1];
    if (nextLevel.status === 'locked') {
      updatedLevels[levelIndex + 1] = {
        ...nextLevel,
        status: 'unlocked'
      };
    }
  }

  return updatedLevels;
}

/**
 * Calcule le pourcentage de progression
 */
export function calculateProgress(levels: StoryLevel[]): number {
  const completedCount = levels.filter(l => l.status === 'completed').length;
  return Math.round((completedCount / levels.length) * 100);
}

/**
 * Trouve le niveau actuel (premier déverrouillé non complété)
 */
export function findCurrentLevel(levels: StoryLevel[]): StoryLevel | undefined {
  return levels.find(l => l.status === 'unlocked');
}
