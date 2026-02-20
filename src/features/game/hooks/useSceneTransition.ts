/**
 * =============================================================================
 * HOOK USE SCENE TRANSITION
 * =============================================================================
 * 
 * Hook pour gérer l'affichage des transitions de scène dans le jeu.
 * Contrôle l'affichage, le timing, et la complétion des animations.
 * 
 * UTILISATION :
 * ```typescript
 * const { showTransition, triggerTransition } = useSceneTransition();
 * 
 * // Quand un niveau démarre
 * triggerTransition('Grande Salle', 'level-1');
 * ```
 * =============================================================================
 */

import { useState, useCallback } from 'react';

interface SceneTransitionState {
  show: boolean;
  sceneName: string;
  levelId: string;
  customPrompt?: string;
}

export function useSceneTransition() {
  const [transitionState, setTransitionState] = useState<SceneTransitionState>({
    show: false,
    sceneName: '',
    levelId: '',
  });

  /**
   * Déclenche une transition de scène
   */
  const triggerTransition = useCallback((
    sceneName: string,
    levelId: string,
    customPrompt?: string
  ) => {
    setTransitionState({
      show: true,
      sceneName,
      levelId,
      customPrompt,
    });
  }, []);

  /**
   * Ferme la transition (appelé automatiquement après animation)
   */
  const hideTransition = useCallback(() => {
    setTransitionState(prev => ({ ...prev, show: false }));
  }, []);

  return {
    showTransition: transitionState.show,
    sceneName: transitionState.sceneName,
    levelId: transitionState.levelId,
    customPrompt: transitionState.customPrompt,
    triggerTransition,
    hideTransition,
  };
}
