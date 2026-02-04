/**
 * =============================================================================
 * CONTEXT DE LANGUE - INTERNATIONALISATION (i18n)
 * =============================================================================
 * 
 * Gère le système d'internationalisation de l'application avec support FR/EN.
 * Permet de changer la langue de l'interface et du jeu dynamiquement.
 * 
 * FONCTIONNALITÉS :
 * - Support de 2 langues : Français (FR) et Anglais (EN)
 * - Changement de langue en temps réel
 * - Persistance dans localStorage
 * - Fonction de traduction t() simple d'utilisation
 * - Traductions complètes pour tous les textes de l'application
 * 
 * STRUCTURE DES TRADUCTIONS :
 * - nav.* : Navbar et navigation
 * - sidebar.* : Sidebar et menu latéral
 * - rpg.* : Interface de jeu RPG
 * - rpg.hermione.* : Spécifique au personnage Hermione
 * - rpg.hagrid.* : Spécifique au personnage Hagrid
 * - rpg.mood.* : États émotionnels des personnages
 * - admin.* : Interface d'administration
 * - progress.* : Progression de l'histoire
 * 
 * UTILISATION :
 * ```typescript
 * const { language, setLanguage, t } = useLanguage();
 * 
 * return (
 *   <div>
 *     <h1>{t('nav.title')}</h1>
 *     <button onClick={() => setLanguage('en')}>English</button>
 *   </div>
 * );
 * ```
 * 
 * =============================================================================
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Type pour les langues supportées
 * Actuellement : Français et Anglais
 */
type Language = 'fr' | 'en';

/**
 * Interface du contexte de langue
 * 
 * @property language - Langue actuellement sélectionnée
 * @property setLanguage - Fonction pour changer de langue
 * @property t - Fonction de traduction (translate)
 */
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// ============================================================================
// CONTEXTE
// ============================================================================

/**
 * Contexte React pour partager la langue dans toute l'application
 * Initialisé à undefined pour forcer l'utilisation du Provider
 */
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// ============================================================================
// DICTIONNAIRE DE TRADUCTIONS
// ============================================================================

/**
 * Dictionnaire complet des traductions FR/EN
 * 
 * ORGANISATION :
 * - Utilise des clés hiérarchiques avec points (ex: 'nav.title')
 * - Chaque section est commentée pour la clarté
 * - Les traductions doivent être exhaustives (pas de clé manquante)
 * 
 * AJOUT DE TRADUCTIONS :
 * 1. Ajouter la clé dans 'fr' ET 'en'
 * 2. Respecter la hiérarchie existante
 * 3. Utiliser des noms de clés descriptifs
 * 4. Commenter les sections importantes
 * 
 * NOTE : Si une clé n'existe pas, la fonction t() retournera la clé elle-même
 * comme fallback, ce qui aide à identifier les traductions manquantes.
 */
const translations = {
  fr: {
    // Navbar
    'nav.title': 'Le Grimoire Éveillé',
    'nav.titleShort': 'Grimoire',
    
    // Sidebar
    'sidebar.home': 'Accueil',
    'sidebar.home.desc': 'Sélection des niveaux',
    'sidebar.rpg': 'Jeu de Rôle',
    'sidebar.rpg.desc': 'Scénario immersif Poudlard',
    'sidebar.admin': 'Admin - Créer Niveau',
    'sidebar.admin.desc': 'Ajouter un nouveau niveau',
    'sidebar.tip.title': 'Astuce',
    'sidebar.tip.content': 'Créez vos propres aventures avec différents personnages dans l\'Admin',
    'sidebar.footer.powered': 'Enchanté par les Arcanes AI',
    'sidebar.footer.version': 'v2.0',
    
    // RPG Game - Level Selection
    'rpg.selectTitle': 'Choisissez votre aventure',
    'rpg.selectSubtitle': 'Sélectionnez un niveau pour commencer votre histoire à Poudlard',
    'rpg.status.completed': '✓ Complété',
    'rpg.status.available': '▶ Disponible',
    'rpg.status.locked': '🔒 Verrouillé',
    'rpg.character': 'Personnage',
    'rpg.button.replay': 'Rejouer',
    'rpg.button.start': 'Commencer l\'aventure',
    'rpg.button.locked': 'Terminez le niveau précédent',
    'rpg.emptyTitle': 'Aucun niveau disponible',
    'rpg.emptySubtitle': 'Les niveaux de jeu seront bientôt disponibles.',
    'rpg.admin.create': 'Créer un nouveau niveau',
    
    // RPG Game - Game Screen
    'rpg.backToLevels': 'Niveaux',
    'rpg.grimoire': 'Grimoire',
    'rpg.inputPlaceholder': 'Que dites-vous à',
    'rpg.gameOver': 'Game Over',
    'rpg.victory': 'Victoire !',
    'rpg.gameOverText': 'La mission a échoué. Réessayez pour découvrir un autre chemin.',
    'rpg.victoryText': 'Vous avez accompli votre mission avec succès !',
    'rpg.backButton': 'Retour aux niveaux',
    'rpg.restart': 'Recommencer l\'histoire',
    'rpg.loading': 'Chargement du niveau...',
    
    // RPG - Hermione specific
    'rpg.hermione.location': 'Poudlard',
    'rpg.hermione.context': 'Il est tard. Hermione est seule.',
    'rpg.hermione.initialMessage': 'Je... je ne sais pas ce que je fais encore ici. Tout semble si vain. Je pense que je vais faire mes valises ce soir.',
    'rpg.hermione.victoryMessage': 'Vous avez réussi à redonner espoir à Hermione. Elle décide de rester à Poudlard pour se battre à vos côtés.',
    'rpg.hermione.gameOverMessage': 'Hermione a pris ses affaires et a quitté le château dans la nuit. Poudlard a perdu l\'un de ses plus brillants esprits.',
    'rpg.hermione.victorySnackbar': 'a retrouvé espoir',
    'rpg.hermione.gameOverSnackbar': 'a quitté Poudlard',
    
    // RPG - Hagrid specific
    'rpg.hagrid.location': 'Poudlard',
    'rpg.hagrid.context': 'La cabane d\'Hagrid. Il semble cacher quelque chose...',
    'rpg.hagrid.initialMessage': 'Euh... Bonjour. Vous... vous cherchez quelque chose ? Je... j\'ai du travail à faire, moi.',
    'rpg.hagrid.victoryMessage': 'Hagrid vous a fait confiance et vous a révélé son secret. Un magnifique dragon attend dans sa cabane.',
    'rpg.hagrid.gameOverMessage': 'Hagrid s\'est fermé complètement. Vous ne saurez jamais ce qu\'il cachait.',
    'rpg.hagrid.victorySnackbar': 'vous a révélé son secret',
    'rpg.hagrid.gameOverSnackbar': 's\'est fermé',
    
    // RPG - Moods
    'rpg.mood.sad': '"C\'est sans espoir..."',
    'rpg.mood.angry': '"Laissez-moi tranquille !"',
    'rpg.mood.happy': '"Peut-être avez-vous raison..."',
    'rpg.mood.desperate': '"Je ne peux plus supporter ça."',
    'rpg.mood.nervous': '"Euh... rien à voir ici !"',
    'rpg.mood.neutral': '"..."',
    
    // RPG - Hagrid Moods
    'rpg.mood.hagrid.nervous': '"Euh... rien à voir ici !"',
    'rpg.mood.hagrid.angry': '"Partez, maintenant !"',
    'rpg.mood.hagrid.happy': '"Vous... vous comprenez..."',
    'rpg.mood.hagrid.desperate': '"Vous ne pouvez pas comprendre."',
    'rpg.mood.hagrid.neutral': '"..."',
    
    // Admin
    'admin.title': 'Créer un Nouveau Niveau',
    'admin.subtitle': 'Ajoutez un nouveau chapitre à l\'histoire',
    'admin.backToHome': 'Retour à l\'accueil',
    'admin.form.titleLabel': 'Titre du Niveau',
    'admin.form.titlePlaceholder': 'Ex: Le Donjon Obscur',
    'admin.form.orderLabel': 'Ordre (Index)',
    'admin.form.orderPlaceholder': '1',
    'admin.form.statusLabel': 'Statut',
    'admin.form.activeCheckbox': 'Actif / Visible',
    'admin.form.descriptionLabel': 'Description',
    'admin.form.descriptionPlaceholder': 'Brève description du niveau...',
    'admin.form.contentLabel': 'Contenu (JSON)',
    'admin.form.contentPlaceholder': '{"character": "Hagrid", "initial_message": "..."}',
    'admin.form.contentHint': 'Configuration technique du niveau au format JSON',
    'admin.form.submitButton': 'Créer le Niveau',
    'admin.form.submitting': 'Création en cours...',
    'admin.success': 'Niveau créé avec succès !',
    
    // Story Progress
    'progress.title': 'Progression',
    
    // Levels - Titles & Descriptions
    'level.hermione.title': 'Bibliothèque de Poudlard - Hermione',
    'level.hermione.description': 'Hermione Granger est désespérée et envisage de quitter Poudlard. Parvenez à lui redonner espoir.',
    'level.hagrid.title': 'La Cabane d\'Hagrid',
    'level.hagrid.description': 'Hagrid cache un secret dans sa cabane. Gagnez sa confiance pour découvrir ce qu\'il dissimule.',
    'level.ron.title': 'La Salle Commune - Ron',
    'level.ron.description': 'Ron Weasley doute de ses capacités. Aidez-le à retrouver confiance en lui.',
    'level.luna.title': 'Le Mystère des Nargoles',
    'level.luna.description': 'Luna Lovegood est convaincue d\'avoir vu des créatures étranges près du lac de Poudlard. Aidez-la à démêler le vrai du faux et à trouver la paix intérieure.',
  },
  en: {
    // Navbar
    'nav.title': 'The Awakened Grimoire',
    'nav.titleShort': 'Grimoire',
    
    // Sidebar
    'sidebar.home': 'Home',
    'sidebar.home.desc': 'Level Selection',
    'sidebar.rpg': 'Role Playing',
    'sidebar.rpg.desc': 'Immersive Hogwarts Scenario',
    'sidebar.admin': 'Admin - Create Level',
    'sidebar.admin.desc': 'Add a new level',
    'sidebar.tip.title': 'Tip',
    'sidebar.tip.content': 'Create your own adventures with different characters in the Admin section',
    'sidebar.footer.powered': 'Enchanted by the AI Arcanes',
    'sidebar.footer.version': 'v2.0',
    
    // RPG Game - Level Selection
    'rpg.selectTitle': 'Choose Your Adventure',
    'rpg.selectSubtitle': 'Select a level to start your Hogwarts story',
    'rpg.status.completed': '✓ Completed',
    'rpg.status.available': '▶ Available',
    'rpg.status.locked': '🔒 Locked',
    'rpg.character': 'Character',
    'rpg.button.replay': 'Play Again',
    'rpg.button.start': 'Start Adventure',
    'rpg.button.locked': 'Complete the previous level',
    'rpg.emptyTitle': 'No levels available',
    'rpg.emptySubtitle': 'Game levels will be available soon.',
    'rpg.admin.create': 'Create a new level',
    
    // RPG Game - Game Screen
    'rpg.backToLevels': 'Levels',
    'rpg.grimoire': 'Grimoire',
    'rpg.inputPlaceholder': 'What do you say to',
    'rpg.gameOver': 'Game Over',
    'rpg.victory': 'Victory!',
    'rpg.gameOverText': 'The mission failed. Try again to discover another path.',
    'rpg.victoryText': 'You have successfully completed your mission!',
    'rpg.backButton': 'Back to levels',
    'rpg.restart': 'Restart the story',
    'rpg.loading': 'Loading level...',
    
    // RPG - Hermione specific
    'rpg.hermione.location': 'Hogwarts',
    'rpg.hermione.context': 'It\'s late. Hermione is alone.',
    'rpg.hermione.initialMessage': 'I... I don\'t know what I\'m still doing here. Everything seems so pointless. I think I\'ll pack my bags tonight.',
    'rpg.hermione.victoryMessage': 'You managed to restore Hermione\'s hope. She decides to stay at Hogwarts to fight by your side.',
    'rpg.hermione.gameOverMessage': 'Hermione packed her things and left the castle in the night. Hogwarts has lost one of its brightest minds.',
    'rpg.hermione.victorySnackbar': 'found hope again',
    'rpg.hermione.gameOverSnackbar': 'left Hogwarts',
    
    // RPG - Hagrid specific
    'rpg.hagrid.location': 'Hogwarts',
    'rpg.hagrid.context': 'Hagrid\'s hut. He seems to be hiding something...',
    'rpg.hagrid.initialMessage': 'Uh... Hello. Are... are you looking for something? I... I have work to do.',
    'rpg.hagrid.victoryMessage': 'Hagrid trusted you and revealed his secret. A magnificent dragon awaits in his hut.',
    'rpg.hagrid.gameOverMessage': 'Hagrid closed up completely. You\'ll never know what he was hiding.',
    'rpg.hagrid.victorySnackbar': 'revealed his secret to you',
    'rpg.hagrid.gameOverSnackbar': 'closed up',
    
    // RPG - Moods
    'rpg.mood.sad': '"It\'s hopeless..."',
    'rpg.mood.angry': '"Leave me alone!"',
    'rpg.mood.happy': '"Perhaps you\'re right..."',
    'rpg.mood.desperate': '"I can\'t bear this anymore."',
    'rpg.mood.nervous': '"Uh... nothing to see here!"',
    'rpg.mood.neutral': '"..."',
    
    // RPG - Hagrid Moods
    'rpg.mood.hagrid.nervous': '"Uh... nothing to see here!"',
    'rpg.mood.hagrid.angry': '"Leave, now!"',
    'rpg.mood.hagrid.happy': '"You... you understand..."',
    'rpg.mood.hagrid.desperate': '"You can\'t understand."',
    'rpg.mood.hagrid.neutral': '"..."',
    
    // Admin
    'admin.title': 'Create a New Level',
    'admin.subtitle': 'Add a new chapter to the story',
    'admin.backToHome': 'Back to Home',
    'admin.form.titleLabel': 'Level Title',
    'admin.form.titlePlaceholder': 'Ex: The Dark Dungeon',
    'admin.form.orderLabel': 'Order (Index)',
    'admin.form.orderPlaceholder': '1',
    'admin.form.statusLabel': 'Status',
    'admin.form.activeCheckbox': 'Active / Visible',
    'admin.form.descriptionLabel': 'Description',
    'admin.form.descriptionPlaceholder': 'Brief level description...',
    'admin.form.contentLabel': 'Content (JSON)',
    'admin.form.contentPlaceholder': '{"character": "Hagrid", "initial_message": "..."}',
    'admin.form.contentHint': 'Technical level configuration in JSON format',
    'admin.form.submitButton': 'Create Level',
    'admin.form.submitting': 'Creating...',
    'admin.success': 'Level created successfully!',
    
    // Story Progress
    'progress.title': 'Progress',
    
    // Levels - Titles & Descriptions
    'level.hermione.title': 'Hogwarts Library - Hermione',
    'level.hermione.description': 'Hermione Granger is desperate and considering leaving Hogwarts. Try to restore her hope.',
    'level.hagrid.title': 'Hagrid\'s Hut',
    'level.hagrid.description': 'Hagrid is hiding a secret in his hut. Earn his trust to discover what he\'s concealing.',
    'level.ron.title': 'Common Room - Ron',
    'level.ron.description': 'Ron Weasley doubts his abilities. Help him regain confidence in himself.',
    'level.luna.title': 'The Mystery of the Nargles',
    'level.luna.description': 'Luna Lovegood is convinced she saw strange creatures near the Hogwarts lake. Help her sort truth from fiction and find inner peace.',
  }
};

// ============================================================================
// PROVIDER
// ============================================================================

/**
 * Provider qui englobe l'application pour fournir le contexte de langue
 * 
 * FONCTIONNEMENT :
 * 1. Initialise la langue à 'fr' par défaut
 * 2. Au montage, charge la langue sauvegardée depuis localStorage
 * 3. Fournit les fonctions setLanguage() et t() aux composants enfants
 * 4. Sauvegarde automatiquement les changements de langue dans localStorage
 * 
 * PERSISTANCE :
 * - La langue est sauvegardée dans localStorage
 * - Elle est restaurée automatiquement au rechargement de la page
 * - Clé : 'language'
 * - Valeurs possibles : 'fr' ou 'en'
 * 
 * @param children - Composants enfants à rendre
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  // État local de la langue (français par défaut)
  const [language, setLanguageState] = useState<Language>('fr');

  /**
   * Effet : Charger la langue sauvegardée au montage du composant
   * 
   * SÉCURITÉ :
   * - Validation stricte : vérifie que la valeur est bien 'fr' ou 'en'
   * - Évite les valeurs corrompues ou invalides dans localStorage
   * 
   * NOTE : S'exécute une seule fois au montage (dependencies vides)
   */
  useEffect(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'fr' || saved === 'en')) {
      setLanguageState(saved);
    }
  }, []);

  /**
   * Change la langue et la sauvegarde dans localStorage
   * 
   * UTILISATION :
   * ```typescript
   * setLanguage('en'); // Passe en anglais
   * setLanguage('fr'); // Passe en français
   * ```
   * 
   * NOTE : Le changement est immédiat et persisté pour les futures sessions
   * 
   * @param lang - Nouvelle langue ('fr' ou 'en')
   */
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  /**
   * Fonction de traduction (translate)
   * 
   * FONCTIONNEMENT :
   * 1. Reçoit une clé de traduction (ex: 'nav.title')
   * 2. Cherche la traduction dans le dictionnaire de la langue actuelle
   * 3. Retourne la traduction ou la clé elle-même si non trouvée
   * 
   * FALLBACK :
   * Si une clé n'existe pas dans le dictionnaire, la clé est retournée.
   * Cela aide à identifier rapidement les traductions manquantes.
   * 
   * UTILISATION :
   * ```typescript
   * const title = t('nav.title');           // "Le Grimoire Éveillé"
   * const unknown = t('key.not.found');     // "key.not.found"
   * ```
   * 
   * @param key - Clé de traduction (notation avec points)
   * @returns La traduction dans la langue actuelle ou la clé si non trouvée
   */
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['fr']] || key;
  };

  // Valeur du contexte fournie aux composants enfants
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook pour accéder au contexte de langue depuis n'importe quel composant
 * 
 * SÉCURITÉ :
 * Lance une erreur si utilisé en dehors du LanguageProvider
 * 
 * @returns Le contexte de langue (language, setLanguage, t)
 * @throws Error si utilisé en dehors du LanguageProvider
 * 
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { language, setLanguage, t } = useLanguage();
 *   
 *   return (
 *     <div>
 *       <h1>{t('nav.title')}</h1>
 *       <button onClick={() => setLanguage('en')}>
 *         Switch to English
 *       </button>
 *       <span>Current: {language}</span>
 *     </div>
 *   );
 * }
 * ```
 */
export function useLanguage() {
  const context = useContext(LanguageContext);
  
  // Validation : le hook doit être utilisé à l'intérieur du Provider
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
}
