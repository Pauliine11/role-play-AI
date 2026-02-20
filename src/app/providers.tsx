/**
 * =============================================================================
 * PROVIDERS GLOBAUX DE L'APPLICATION
 * =============================================================================
 * 
 * Ce fichier centralise tous les providers React nécessaires à l'application.
 * Il orchestre la hiérarchie des contextes pour que les fonctionnalités soient
 * disponibles dans toute l'application.
 * 
 * HIÉRARCHIE DES PROVIDERS :
 * 1. PosthogProvider : Analytics et tracking utilisateur (doit être le plus haut)
 * 2. QueryClientProvider : Gestion du cache et des requêtes API (React Query)
 * 3. LanguageProvider : Internationalisation FR/EN
 * 4. SidebarProvider : État de la sidebar (ouvert/fermé, mobile/desktop)
 * 
 * POURQUOI CET ORDRE ?
 * - PostHog en premier pour tracker tous les événements, même ceux des autres providers
 * - React Query ensuite car il gère les données de l'API
 * - LanguageProvider après pour que les composants puissent utiliser t()
 * - SidebarProvider en dernier car c'est un état UI local
 * 
 * NOTE : Ce fichier doit être 'use client' car il utilise des hooks React
 * =============================================================================
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import { SidebarProvider } from '@/shared/hooks/useSidebar';
import { LanguageProvider } from '@/shared/providers/LanguageContext';
import { AnimationPreferencesProvider } from '@/shared/providers/AnimationPreferencesContext';
import { ThemeProvider } from '@/shared/providers/ThemeContext';
import { PosthogProvider } from '@/features/analytics/provider';

// ============================================================================
// CONFIGURATION REACT QUERY
// ============================================================================

/**
 * Client React Query configuré avec les options par défaut
 * 
 * React Query gère :
 * - Le cache des requêtes API
 * - Le refetch automatique
 * - Les états de chargement
 * - La synchronisation entre les composants
 */
const queryClient = new QueryClient();

// ============================================================================
// COMPOSANT PROVIDERS
// ============================================================================

/**
 * Composant qui englobe tous les providers de l'application
 * 
 * UTILISATION :
 * Importé dans le RootLayout pour envelopper toute l'application
 * 
 * @param children - Composants enfants à rendre à l'intérieur des providers
 */
export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <PosthogProvider>
      {/* Analytics en premier pour tout tracker */}
      <QueryClientProvider client={queryClient}>
        {/* Gestion des requêtes API et du cache */}
        <ThemeProvider defaultTheme="nox">
          {/* Thème Lumos/Nox avec transition magique */}
          <LanguageProvider>
            {/* Gestion de la langue FR/EN */}
            <AnimationPreferencesProvider>
              {/* Préférences d'animation et accessibilité */}
              <SidebarProvider>
                {/* État de la sidebar */}
                {children}
              </SidebarProvider>
            </AnimationPreferencesProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </PosthogProvider>
  );
};