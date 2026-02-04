/**
 * =============================================================================
 * HOOK ET PROVIDER - SIDEBAR
 * =============================================================================
 * 
 * Gère l'état global de la sidebar de navigation (ouvert/fermé).
 * Inclut la détection mobile/desktop et les comportements adaptatifs.
 * 
 * FONCTIONNALITÉS :
 * - État ouvert/fermé de la sidebar
 * - Toggle, open, close explicites
 * - Détection automatique mobile/desktop
 * - Comportement adaptatif :
 *   → Desktop : Sidebar ouverte par défaut
 *   → Mobile : Sidebar fermée par défaut (overlay quand ouverte)
 * 
 * UTILISATION :
 * ```typescript
 * function MyComponent() {
 *   const { isOpen, toggle, isMobile } = useSidebar();
 *   return <div className={isOpen ? 'ml-64' : 'ml-16'}>...</div>
 * }
 * ```
 * 
 * ARCHITECTURE :
 * SidebarProvider (Context) → useSidebar (Hook) → Composants
 * =============================================================================
 */

'use client';

import { useState, useCallback, createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useIsMobile } from './useMediaQuery';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Type du contexte de la sidebar
 * 
 * @property isOpen - État actuel de la sidebar (ouvert/fermé)
 * @property toggle - Fonction pour inverser l'état
 * @property open - Fonction pour ouvrir explicitement
 * @property close - Fonction pour fermer explicitement
 * @property isMobile - Booléen indiquant si on est sur mobile
 */
interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  isMobile: boolean;
}

// ============================================================================
// CONTEXTE
// ============================================================================

/**
 * Contexte React pour partager l'état de la sidebar
 * Initialisé à undefined pour forcer l'utilisation du Provider
 */
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

/**
 * Provider qui englobe l'application pour fournir l'état de la sidebar
 * 
 * COMPORTEMENT ADAPTATIF :
 * - Desktop (≥768px) : Sidebar ouverte par défaut
 * - Mobile (<768px) : Sidebar fermée par défaut
 * - Changement automatique lors du resize de la fenêtre
 * 
 * @param children - Composants enfants à rendre
 */
export function SidebarProvider({ children }: { children: ReactNode }) {
  // Détection mobile/desktop avec media query
  const isMobile = useIsMobile();
  
  // État de la sidebar (fermé par défaut pour éviter le flash au chargement)
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Effet : Adapter l'état de la sidebar selon la taille d'écran
   * 
   * LOGIQUE :
   * - Mobile → Fermer automatiquement
   * - Desktop → Ouvrir automatiquement
   * 
   * Permet une UX fluide lors du resize de fenêtre
   */
  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);

  /**
   * Toggle l'état de la sidebar (ouvert ↔ fermé)
   * Mémorisé avec useCallback pour optimiser les re-renders
   */
  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  /**
   * Ouvre explicitement la sidebar
   * Utile pour les interactions spécifiques (ex: bouton menu mobile)
   */
  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  /**
   * Ferme explicitement la sidebar
   * Utile pour fermer après une navigation mobile
   */
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Valeur du contexte à fournir aux composants enfants
  const value = { isOpen, toggle, open, close, isMobile };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook pour accéder à l'état de la sidebar depuis n'importe quel composant
 * 
 * SÉCURITÉ :
 * Lance une erreur si utilisé en dehors du SidebarProvider
 * 
 * @returns L'état et les fonctions de contrôle de la sidebar
 * @throws Error si utilisé en dehors du SidebarProvider
 * 
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { isOpen, toggle, isMobile } = useSidebar();
 *   
 *   return (
 *     <div className={`transition-all ${isMobile ? '' : isOpen ? 'ml-64' : 'ml-16'}`}>
 *       <button onClick={toggle}>Toggle Sidebar</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useSidebar() {
  const context = useContext(SidebarContext);
  
  // Validation : le hook doit être utilisé à l'intérieur du Provider
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  
  return context;
}
