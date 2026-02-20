/**
 * =============================================================================
 * LUMOS / NOX - SYSTÈME DE THÈME MAGIQUE
 * =============================================================================
 * 
 * Context et Provider pour gérer le mode jour (Lumos) / nuit (Nox)
 * avec animation de transition magique.
 * 
 * FONCTIONNALITÉS :
 * - Toggle Lumos (clair) / Nox (sombre)
 * - Persistance dans localStorage
 * - Animation de propagation circulaire
 * - Support du prefers-color-scheme système
 * 
 * =============================================================================
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export type Theme = 'lumos' | 'nox';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isTransitioning: boolean;
}

// ============================================================================
// CONTEXT
// ============================================================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'nox' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Hydration: charger le thème depuis localStorage après le montage
  useEffect(() => {
    setIsMounted(true);
    
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    
    if (savedTheme && (savedTheme === 'lumos' || savedTheme === 'nox')) {
      setThemeState(savedTheme);
    } else {
      // Détection du mode système
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme: Theme = prefersDark ? 'nox' : 'lumos';
      setThemeState(systemTheme);
    }
  }, []);

  // Appliquer le thème au document
  useEffect(() => {
    if (!isMounted) return;

    const root = document.documentElement;
    
    if (theme === 'lumos') {
      root.classList.remove('nox');
      root.classList.add('lumos');
    } else {
      root.classList.remove('lumos');
      root.classList.add('nox');
    }

    localStorage.setItem('theme', theme);
  }, [theme, isMounted]);

  const setTheme = (newTheme: Theme) => {
    if (newTheme === theme) return;

    setIsTransitioning(true);
    setThemeState(newTheme);

    // Fin de la transition après 1.5s
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1500);
  };

  const toggleTheme = () => {
    const newTheme: Theme = theme === 'lumos' ? 'nox' : 'lumos';
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isTransitioning }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}
