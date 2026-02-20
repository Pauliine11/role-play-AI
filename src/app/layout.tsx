/**
 * =============================================================================
 * LAYOUT RACINE DE L'APPLICATION
 * =============================================================================
 * 
 * Ce fichier configure le layout principal de l'application Next.js.
 * Il gère l'initialisation des polices, des providers globaux et de l'authentification.
 * 
 * RESPONSABILITÉS :
 * - Configuration des polices Google Fonts (Geist, Cormorant Garamond)
 * - Initialisation de Clerk pour l'authentification
 * - Mise en place des providers globaux (Analytics, React Query, Langue, etc.)
 * - Configuration des métadonnées SEO
 * 
 * POLICES UTILISÉES :
 * - Geist Sans : Police principale pour le corps du texte
 * - Geist Mono : Police monospace pour le code
 * - Cormorant Garamond : Police serif élégante pour les titres et thème Harry Potter
 * 
 * ARCHITECTURE :
 * ClerkProvider → AppProviders → (PostHog, React Query, Langue, Sidebar) → children
 * =============================================================================
 */

import './globals.css';
import { AppProviders } from './providers';
import { Metadata } from 'next';
import { Geist, Geist_Mono, Cormorant_Garamond, Cinzel, Merriweather } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { frFR } from '@clerk/localizations'

// ============================================================================
// CONFIGURATION DES POLICES
// ============================================================================

/**
 * Police principale : Geist Sans
 * Utilisée pour le corps du texte et l'interface utilisateur générale
 */
const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap', // Optimisation : affiche la police système en attendant le chargement
});

/**
 * Police monospace : Geist Mono
 * Utilisée pour les éléments de code et les éléments techniques
 */
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

/**
 * Police serif : Cormorant Garamond
 * Utilisée pour les titres et éléments thématiques (univers Harry Potter)
 * Donne un aspect élégant et magique à l'interface
 */
const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'], // Multiples graisses pour flexibilité
});

/**
 * Police médiévale pour les titres : Cinzel
 * Donne un aspect ancien et majestueux aux titres principaux
 */
const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

/**
 * Police serif lisible pour le corps : Merriweather
 * Excellent pour la lecture, rappelle les manuscrits anciens
 */
const merriweather = Merriweather({
  subsets: ['latin'],
  variable: '--font-merriweather',
  display: 'swap',
  weight: ['300', '400', '700'],
});

// ============================================================================
// MÉTADONNÉES SEO
// ============================================================================

export const metadata: Metadata = {
  title: 'Le grimoire éveillé',
  description: 'Choisissez votre aventure dans l\'univers magique de Poudlard',
};

// ============================================================================
// COMPOSANT LAYOUT RACINE
// ============================================================================

/**
 * Layout racine de l'application
 * 
 * STRUCTURE :
 * 1. ClerkProvider : Authentification des utilisateurs (en français)
 * 2. html : Configuration de la langue et styles de base
 * 3. body : Variables de polices et classes Tailwind
 * 4. AppProviders : Tous les providers de contexte de l'application
 * 5. children : Contenu de la page actuelle
 * 
 * @param children - Contenu de la page à afficher
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider localization={frFR}>
      <html lang="fr" className="min-h-screen">
        <body className={`min-h-screen ${geistSans.variable} ${geistMono.variable} ${cormorantGaramond.variable} ${cinzel.variable} ${merriweather.variable} antialiased`}>
          <AppProviders>
            {children}
          </AppProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
