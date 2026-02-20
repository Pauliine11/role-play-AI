/**
 * =============================================================================
 * SERVER ACTIONS - SCÈNES
 * =============================================================================
 * 
 * Server Actions pour la gestion des images de scènes.
 * Utilise des images statiques pré-placées dans /public/scenes/
 * 
 * RESPONSABILITÉS :
 * - Retourner les chemins des images statiques
 * - Fallback sur placeholder si image manquante
 * =============================================================================
 */

'use server';

// ============================================================================
// GESTION D'IMAGES DE SCÈNE STATIQUES
// ============================================================================

export interface SceneImageResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

/**
 * Retourne le chemin de l'image statique pour une scène
 * Utilise placeholder.svg si l'image spécifique n'existe pas
 */
function getSceneImagePath(sceneName: string): string {
  const sceneKey = sceneName.toLowerCase()
    .replace(/ /g, '_')
    .replace(/'/g, '')
    .replace(/'/g, '')
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  const sceneMap: Record<string, string> = {
    'bibliotheque': '/scenes/bibliotheque.svg',
    'bibliotheque_de_poudlard': '/scenes/bibliotheque.svg',
    'grande_salle': '/scenes/placeholder.svg',
    'foret_interdite': '/scenes/placeholder.svg',
    'cabane_hagrid': '/scenes/cabane_hagrid.svg',
    'cabane_dhagrid': '/scenes/cabane_hagrid.svg',
    'salle_commune_gryffondor': '/scenes/salle_commune.svg',
    'bureau_dumbledore': '/scenes/placeholder.svg',
    'salle_potions': '/scenes/placeholder.svg',
    'cour_poudlard': '/scenes/placeholder.svg',
    'tour_astronomie': '/scenes/tour_serdaigle.svg',
    'tour_de_serdaigle': '/scenes/tour_serdaigle.svg',
    'quai_poudlard': '/scenes/placeholder.svg',
  };

  return sceneMap[sceneKey] || '/scenes/placeholder.svg';
}

/**
 * Retourne l'URL de l'image de scène (statique depuis /public/scenes/)
 */
export async function generateSceneImageAction(
  levelId: string,
  sceneName: string,
  _customPrompt?: string
): Promise<SceneImageResult> {
  try {
    const imageUrl = getSceneImagePath(sceneName);
    
    console.log('✅ Using static scene image:', sceneName, '→', imageUrl);
    
    return {
      success: true,
      imageUrl,
    };
  } catch (error) {
    console.error('❌ Error loading scene image:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Récupère l'image de scène statique
 */
export async function getCachedSceneImage(
  levelId: string,
  sceneName: string
): Promise<string | null> {
  return getSceneImagePath(sceneName);
}
