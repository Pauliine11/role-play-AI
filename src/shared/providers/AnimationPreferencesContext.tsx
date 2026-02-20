'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AnimationPreferences {
  enableTypewriter: boolean;
  enableParticles: boolean;
  enableSceneTransitions: boolean;
  enableMagicEffects: boolean;
  reducedMotion: boolean;
}

interface AnimationPreferencesContextType extends AnimationPreferences {
  setEnableTypewriter: (value: boolean) => void;
  setEnableParticles: (value: boolean) => void;
  setEnableSceneTransitions: (value: boolean) => void;
  setEnableMagicEffects: (value: boolean) => void;
  toggleAll: (value: boolean) => void;
}

const AnimationPreferencesContext = createContext<AnimationPreferencesContextType | undefined>(undefined);

const STORAGE_KEY = 'grimoire-animation-prefs';

const DEFAULT_PREFERENCES: AnimationPreferences = {
  enableTypewriter: true,
  enableParticles: true,
  enableSceneTransitions: true,
  enableMagicEffects: true,
  reducedMotion: false,
};

export function AnimationPreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<AnimationPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setPrefs(JSON.parse(saved));
      } catch {
        console.warn('Failed to parse animation preferences');
      }
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setPrefs(prev => ({ ...prev, reducedMotion: true }));
    }

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefs(prev => ({ ...prev, reducedMotion: e.matches }));
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  }, [prefs]);

  const setEnableTypewriter = (value: boolean) => {
    setPrefs(prev => ({ ...prev, enableTypewriter: value }));
  };

  const setEnableParticles = (value: boolean) => {
    setPrefs(prev => ({ ...prev, enableParticles: value }));
  };

  const setEnableSceneTransitions = (value: boolean) => {
    setPrefs(prev => ({ ...prev, enableSceneTransitions: value }));
  };

  const setEnableMagicEffects = (value: boolean) => {
    setPrefs(prev => ({ ...prev, enableMagicEffects: value }));
  };

  const toggleAll = (value: boolean) => {
    setPrefs(prev => ({
      ...prev,
      enableTypewriter: value,
      enableParticles: value,
      enableSceneTransitions: value,
      enableMagicEffects: value,
    }));
  };

  return (
    <AnimationPreferencesContext.Provider
      value={{
        ...prefs,
        setEnableTypewriter,
        setEnableParticles,
        setEnableSceneTransitions,
        setEnableMagicEffects,
        toggleAll,
      }}
    >
      {children}
    </AnimationPreferencesContext.Provider>
  );
}

export function useAnimationPreferences() {
  const context = useContext(AnimationPreferencesContext);
  if (!context) {
    throw new Error('useAnimationPreferences must be used within AnimationPreferencesProvider');
  }
  return context;
}
