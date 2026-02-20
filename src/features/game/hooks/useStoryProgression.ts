/**
 * Hook de gestion de la progression du joueur
 * Synchronise Supabase (source vérité) → localStorage (cache) → défauts hardcodés
 */

import { useState, useEffect, useCallback } from 'react';
import { StoryLevel } from '@/shared/types/game';
import { INITIAL_STORY_LEVELS } from '@/features/game/data';
import { fetchUserProgression, completeLevelAction } from '@/features/game/actions/progression-actions';
import { 
  loadFromLocalStorage, 
  saveToLocalStorage,
  updateLevelCompletion,
  calculateProgress,
  findCurrentLevel 
} from '../utils/progression-helpers';

export function useStoryProgression() {
  const [levels, setLevels] = useState<StoryLevel[]>(INITIAL_STORY_LEVELS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLevels() {
      try {
        setIsLoading(true);
        
        const dbLevels = await fetchUserProgression();
        
        if (dbLevels && dbLevels.length > 0) {
          console.log('✅ Niveaux chargés depuis Supabase:', dbLevels.length, 'niveau(x)');
          console.log('   Niveaux:', dbLevels.map(l => l.title).join(', '));
          setLevels(dbLevels);
          saveToLocalStorage(dbLevels);
        } else {
          console.warn('⚠️ Aucun niveau trouvé en base de données');
          console.warn('   → Vérifiez que vous avez exécuté database/insert_levels.sql');
          
          const localLevels = loadFromLocalStorage();
          if (localLevels) {
            console.log('📦 Niveaux chargés depuis localStorage (fallback)');
            setLevels(localLevels);
          } else {
            console.log('🆕 Première visite - niveaux par défaut (hardcodés)');
            console.log('   → Pour utiliser la DB, exécutez: database/insert_levels.sql');
            setLevels(INITIAL_STORY_LEVELS);
            saveToLocalStorage(INITIAL_STORY_LEVELS);
          }
        }
      } catch (e) {
        console.error("❌ Erreur lors du chargement:", e);
        setLevels(INITIAL_STORY_LEVELS);
      } finally {
        setIsLoading(false);
      }
    }
    loadLevels();
  }, []);

  useEffect(() => {
    saveToLocalStorage(levels);
  }, [levels]);

  const completeLevel = useCallback(async (levelId: string) => {
    try {
      const result = await completeLevelAction(levelId);
      if (result.success) {
        console.log('✅ Niveau complété sauvegardé dans Supabase:', levelId);
      } else {
        console.warn('⚠️ Échec de la sauvegarde dans Supabase, sauvegarde locale uniquement');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
    }

    setLevels(currentLevels => {
      const updated = updateLevelCompletion(currentLevels, levelId);
      saveToLocalStorage(updated);
      return updated;
    });
  }, []);

  const resetProgress = useCallback(() => {
    setLevels(INITIAL_STORY_LEVELS);
  }, []);

  const currentLevel = findCurrentLevel(levels) || levels[levels.length - 1];
  const progressPercentage = calculateProgress(levels);

  return {
    levels,
    completeLevel,
    resetProgress,
    currentLevel,
    progressPercentage,
    isLoading
  };
}
