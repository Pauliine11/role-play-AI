/**
 * =============================================================================
 * HOOK - STORY PROGRESSION
 * =============================================================================
 * 
 * Gère la progression du joueur à travers les niveaux de l'histoire.
 * Synchronise les données entre Supabase (source de vérité), localStorage
 * (cache local) et les niveaux hardcodés (fallback).
 * 
 * FONCTIONNALITÉS :
 * - Chargement de la progression depuis Supabase
 * - Fallback sur localStorage si DB vide
 * - Fallback final sur niveaux hardcodés
 * - Complétion d'un niveau (sauvegarde DB + local)
 * - Déverrouillage automatique du niveau suivant
 * - Calcul du pourcentage de progression
 * - Reset de la progression
 * 
 * HIÉRARCHIE DES SOURCES :
 * 1. Supabase (BD) - Source de vérité principale
 * 2. localStorage - Cache local pour performances
 * 3. INITIAL_STORY_LEVELS - Niveaux par défaut hardcodés
 * 
 * STATUTS DES NIVEAUX :
 * - 'unlocked' : Niveau disponible à jouer
 * - 'completed' : Niveau terminé avec succès
 * - 'locked' : Niveau verrouillé (précédent non complété)
 * 
 * UTILISATION :
 * ```typescript
 * const { levels, completeLevel, isLoading } = useStoryProgression();
 * 
 * // Afficher les niveaux
 * levels.map(level => <LevelCard key={level.id} {...level} />)
 * 
 * // Marquer un niveau comme complété
 * await completeLevel('level-hermione-1');
 * ```
 * 
 * =============================================================================
 */

import { useState, useEffect, useCallback } from 'react';
import { StoryLevel } from '@/features/game/types';
import { INITIAL_STORY_LEVELS } from '@/features/game/data';
import { fetchUserProgression, completeLevelAction } from '@/features/game/actions/progression-actions';

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

/**
 * Hook pour gérer la progression de l'histoire
 * 
 * @returns État et fonctions pour gérer les niveaux
 */
export function useStoryProgression() {
  // État des niveaux (initialisé avec les niveaux par défaut)
  const [levels, setLevels] = useState<StoryLevel[]>(INITIAL_STORY_LEVELS);
  
  // État de chargement (true pendant la récupération des données)
  const [isLoading, setIsLoading] = useState(true);

  // ==========================================================================
  // EFFET : CHARGEMENT INITIAL DES NIVEAUX
  // ==========================================================================
  
  /**
   * Charge la progression au montage du composant
   * 
   * STRATÉGIE DE CHARGEMENT (en ordre) :
   * 1. Essayer de charger depuis Supabase (DB)
   * 2. Si DB vide → Chercher dans localStorage
   * 3. Si localStorage vide ou invalide → Utiliser les niveaux hardcodés
   * 
   * VALIDATION :
   * - Vérifie que les niveaux Hermione ET Hagrid sont présents
   * - Gère les erreurs de parsing JSON
   * - Logs détaillés pour le debugging
   * 
   * NOTE : Ce processus garantit que l'utilisateur voit toujours des niveaux,
   * même si la base de données n'est pas encore configurée.
   */
  useEffect(() => {
    async function loadLevels() {
      try {
        setIsLoading(true);
        
        // 1. Charger depuis Supabase (source de vérité principale)
        const dbLevels = await fetchUserProgression();
        
        if (dbLevels && dbLevels.length > 0) {
          // ✅ Données trouvées dans la base de données
          console.log('✅ Niveaux chargés depuis Supabase:', dbLevels.length, 'niveau(x)');
          console.log('   Niveaux:', dbLevels.map(l => l.title).join(', '));
          setLevels(dbLevels);
          // Sauvegarder dans localStorage pour accès rapide
          localStorage.setItem('bertrand-story-progress', JSON.stringify(dbLevels));
        } else {
          // ⚠️ Base de données vide - fallback sur localStorage ou défaut
          console.warn('⚠️ Aucun niveau trouvé en base de données');
          console.warn('   → Vérifiez que vous avez exécuté database/insert_levels.sql');
          
          const saved = localStorage.getItem('bertrand-story-progress');
          if (saved) {
            try {
              const parsedLevels = JSON.parse(saved);
              const hasHermione = parsedLevels.some((l: StoryLevel) => l.id === 'level-hermione-1');
              const hasHagrid = parsedLevels.some((l: StoryLevel) => l.id === 'level-hagrid-1');
              
              if (hasHermione && hasHagrid) {
                console.log('📦 Niveaux chargés depuis localStorage (fallback)');
                setLevels(parsedLevels);
              } else {
                console.log('🔄 Utilisation des niveaux par défaut (hardcodés)');
                setLevels(INITIAL_STORY_LEVELS);
                localStorage.setItem('bertrand-story-progress', JSON.stringify(INITIAL_STORY_LEVELS));
              }
            } catch (err) {
              console.error("❌ Erreur localStorage:", err);
              setLevels(INITIAL_STORY_LEVELS);
            }
          } else {
            // Première visite - utiliser les niveaux par défaut
            console.log('🆕 Première visite - niveaux par défaut (hardcodés)');
            console.log('   → Pour utiliser la DB, exécutez: database/insert_levels.sql');
            setLevels(INITIAL_STORY_LEVELS);
            localStorage.setItem('bertrand-story-progress', JSON.stringify(INITIAL_STORY_LEVELS));
          }
        }
      } catch (e) {
        console.error("❌ Erreur lors du chargement:", e);
        // En cas d'erreur, utiliser les niveaux par défaut
        setLevels(INITIAL_STORY_LEVELS);
      } finally {
        setIsLoading(false);
      }
    }
    loadLevels();
  }, []);

  // ==========================================================================
  // EFFET : SYNCHRONISATION AVEC LOCALSTORAGE
  // ==========================================================================
  
  /**
   * Sauvegarde automatique dans localStorage à chaque changement
   * 
   * POURQUOI :
   * - Cache local pour accès rapide
   * - Persistance entre les rechargements de page
   * - Fallback si Supabase n'est pas disponible
   * 
   * NOTE : S'exécute après chaque mise à jour de 'levels'
   */
  useEffect(() => {
    localStorage.setItem('bertrand-story-progress', JSON.stringify(levels));
  }, [levels]);

  // ==========================================================================
  // FONCTION : COMPLÉTER UN NIVEAU
  // ==========================================================================
  
  /**
   * Marque un niveau comme complété et déverrouille le suivant
   * 
   * FONCTIONNEMENT :
   * 1. Sauvegarde dans Supabase (source de vérité)
   * 2. Met à jour l'état local (UI immédiate)
   * 3. Marque le niveau comme 'completed'
   * 4. Déverrouille automatiquement le niveau suivant
   * 5. Sauvegarde dans localStorage
   * 
   * GESTION D'ERREURS :
   * - Si la sauvegarde Supabase échoue, continue quand même
   * - L'utilisateur ne perd pas sa progression locale
   * - Logs pour le debugging
   * 
   * IDEMPOTENCE :
   * - Si le niveau est déjà complété, ne fait rien
   * - Évite les mises à jour inutiles
   * 
   * @param levelId - ID unique du niveau à compléter (ex: 'level-hermione-1')
   * 
   * @example
   * ```typescript
   * // Après avoir gagné contre Hermione
   * await completeLevel('level-hermione-1');
   * // → Hermione devient 'completed', Hagrid devient 'unlocked'
   * ```
   */
  const completeLevel = useCallback(async (levelId: string) => {
    // 1. Sauvegarder dans la base de données
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

    // 2. Mettre à jour l'état local (UI immédiate)
    setLevels(currentLevels => {
      const levelIndex = currentLevels.findIndex(l => l.id === levelId);
      if (levelIndex === -1) return currentLevels;
      
      const level = currentLevels[levelIndex];
      if (level.status === 'completed') return currentLevels;

      const newLevels = [...currentLevels];
      newLevels[levelIndex] = { ...level, status: 'completed' };

      // Débloquer le niveau suivant
      const nextLevelIndex = levelIndex + 1;
      if (nextLevelIndex < newLevels.length) {
        newLevels[nextLevelIndex] = { 
          ...newLevels[nextLevelIndex], 
          status: 'unlocked' 
        };
      }

      // Sauvegarder dans localStorage aussi
      localStorage.setItem('bertrand-story-progress', JSON.stringify(newLevels));

      return newLevels;
    });
  }, []);

  // ==========================================================================
  // FONCTION : RÉINITIALISER LA PROGRESSION
  // ==========================================================================
  
  /**
   * Réinitialise la progression à zéro
   * 
   * UTILISATION :
   * - Bouton "Recommencer depuis le début" dans les paramètres
   * - Debugging pendant le développement
   * - Tests manuels
   * 
   * EFFET :
   * - Remet tous les niveaux à leur état initial
   * - Premier niveau déverrouillé, les autres verrouillés
   * - Progression complètement effacée
   * 
   * NOTE : Cette action est locale uniquement. Pour réinitialiser
   * la progression en base de données, il faudrait une action serveur.
   * 
   * @example
   * ```typescript
   * <button onClick={resetProgress}>
   *   Recommencer l'aventure
   * </button>
   * ```
   */
  const resetProgress = useCallback(() => {
    setLevels(INITIAL_STORY_LEVELS);
  }, []);

  // ==========================================================================
  // VALEURS CALCULÉES
  // ==========================================================================
  
  /**
   * Niveau actuellement déverrouillé (en cours)
   * Utilisé pour afficher "Continuer" sur la page d'accueil
   */
  const currentLevel = levels.find(l => l.status === 'unlocked') || levels[levels.length - 1];
  
  /**
   * Nombre de niveaux complétés
   * Utilisé pour le calcul du pourcentage
   */
  const completedCount = levels.filter(l => l.status === 'completed').length;
  
  /**
   * Pourcentage de progression (0-100)
   * Ex: 2 niveaux complétés sur 4 = 50%
   */
  const progressPercentage = (completedCount / levels.length) * 100;

  // ==========================================================================
  // RETOUR DU HOOK
  // ==========================================================================
  
  /**
   * Retourne l'état et les fonctions pour gérer la progression
   * 
   * @property levels - Liste complète des niveaux avec leur statut
   * @property completeLevel - Fonction pour marquer un niveau comme complété
   * @property resetProgress - Fonction pour réinitialiser la progression
   * @property currentLevel - Niveau actuellement en cours
   * @property progressPercentage - Pourcentage de complétion (0-100)
   * @property isLoading - Indicateur de chargement initial
   */
  return {
    levels,
    completeLevel,
    resetProgress,
    currentLevel,
    progressPercentage,
    isLoading
  };
}

