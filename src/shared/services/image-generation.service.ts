/**
 * =============================================================================
 * SERVICE GESTION DES SCÈNES
 * =============================================================================
 * 
 * Service pour gérer les illustrations de scènes statiques.
 * Fournit les informations sur les lieux de Poudlard.
 * 
 * RESPONSABILITÉS :
 * - Mapping des noms de scènes aux chemins d'images
 * - Descriptions des lieux pour l'immersion
 * - Suggestions de lieux par personnage
 * =============================================================================
 */

// ============================================================================
// DESCRIPTIONS DES LIEUX HARRY POTTER
// ============================================================================

export const HOGWARTS_LOCATIONS: Record<string, string> = {
  'grande_salle': 'La majestueuse Grande Salle avec ses bougies flottantes, ses quatre longues tables et ses bannières des maisons',
  
  'bibliotheque': 'La bibliothèque antique de Poudlard avec ses étagères immenses remplies de grimoires et parchemins anciens',
  
  'foret_interdite': 'La mystérieuse Forêt Interdite avec ses arbres ancestraux tordus et son brouillard ensorcelé',
  
  'salle_commune_gryffondor': 'La chaleureuse salle commune de Gryffondor avec sa cheminée crépitante et ses fauteuils confortables',
  
  'bureau_dumbledore': 'Le bureau circulaire de Dumbledore rempli d\'instruments magiques argentés et de portraits animés',
  
  'cabane_hagrid': 'La cabane rustique de Hagrid en bordure de forêt avec son mobilier surdimensionné',
  
  'salle_potions': 'Les cachots sombres de la salle de potions avec leurs étagères d\'ingrédients mystérieux',
  
  'cour_poudlard': 'La cour pavée du château avec ses arches de pierre et ses tours majestueuses en arrière-plan',
  
  'tour_astronomie': 'La tour d\'astronomie circulaire avec son télescope et ses cartes célestes',
  
  'quai_poudlard': 'La plateforme victorienne du Quai 9¾ avec le Poudlard Express rouge étincelant',
};

// ============================================================================
// SERVICE GESTION DES SCÈNES
// ============================================================================

export class ImageGenerationService {
  /**
   * Récupère la liste des scènes disponibles
   */
  static getAvailableScenes(): string[] {
    return Object.keys(HOGWARTS_LOCATIONS);
  }

  /**
   * Récupère la description d'une scène
   */
  static getSceneDescription(sceneName: string): string {
    const sceneKey = sceneName.toLowerCase().replace(/ /g, '_');
    return HOGWARTS_LOCATIONS[sceneKey] || sceneName;
  }

  /**
   * Suggère un lieu basé sur le personnage
   */
  static suggestLocationForCharacter(character: string): string {
    const characterMap: Record<string, string> = {
      'hermione': 'bibliotheque_de_poudlard',
      'hagrid': 'cabane_hagrid',
      'ron': 'salle_commune_gryffondor',
      'luna': 'tour_de_serdaigle',
      'dumbledore': 'bureau_dumbledore',
      'snape': 'salle_potions',
    };

    const charKey = character.toLowerCase().split(' ')[0];
    return characterMap[charKey] || 'grande_salle';
  }
}
