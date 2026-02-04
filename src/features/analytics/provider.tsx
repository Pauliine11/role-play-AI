'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';

/**
 * PosthogProvider - Initialise PostHog une seule fois et identifie l'utilisateur
 * 
 * IMPORTANT: Ce composant doit être appelé dans le layout.tsx racine
 * pour éviter les réinitialisations multiples lors des re-renders
 */
export function PosthogProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const hasInitialized = useRef(false);
  const hasIdentified = useRef(false);
  
  // Compteurs pour suivre les ré-exécutions
  const initEffectCount = useRef(0);
  const identifyEffectCount = useRef(0);
  const logoutEffectCount = useRef(0);

  // 1️⃣ INITIALISATION DE POSTHOG (une seule fois au montage)
  useEffect(() => {
    initEffectCount.current += 1;
    console.log(`🔢 [INIT] useEffect exécuté ${initEffectCount.current} fois`);
    
    if (hasInitialized.current) {
      console.log('🔄 PostHog: Déjà initialisé, skip');
      return;
    }

    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (!posthogKey || !posthogHost) {
      console.error('❌ PostHog: Clés manquantes dans .env.local');
      return;
    }

    // Initialisation
    posthog.init(posthogKey, {
      api_host: posthogHost,
      person_profiles: 'identified_only', // Ne crée des profils que pour les users identifiés
      capture_pageview: true, // Capture automatique des pages vues
      capture_pageleave: true, // Capture quand l'user quitte la page
      loaded: (posthog) => {
        console.log('✅ PostHog: Initialisé avec succès');
        if (process.env.NODE_ENV === 'development') {
          posthog.debug(); // Active le mode debug en dev
        }
      }
    });

    hasInitialized.current = true;
    console.log('🚀 PostHog: Première initialisation');
  }, []); // ⚠️ Dépendances vides = exécuté UNE SEULE FOIS

  // 2️⃣ IDENTIFICATION DE L'UTILISATEUR (une fois chargé)
  useEffect(() => {
    identifyEffectCount.current += 1;
    console.log(`🔢 [IDENTIFY] useEffect exécuté ${identifyEffectCount.current} fois`);
    
    if (!isLoaded) {
      console.log('⏳ PostHog: En attente du chargement de Clerk...');
      return;
    }

    if (hasIdentified.current) {
      console.log('🔄 PostHog: User déjà identifié, skip');
      return;
    }

    if (user) {
      // User connecté → Identifier dans PostHog
      const userEmail = user.emailAddresses[0]?.emailAddress || 'unknown';
      const userName = user.fullName || user.firstName || 'Anonymous';

      posthog.identify(user.id, {
        email: userEmail,
        name: userName,
        created_at: user.createdAt,
        image_url: user.imageUrl,
      });

      hasIdentified.current = true;
      console.log('👤 PostHog: User identifié ->', {
        id: user.id,
        email: userEmail,
        name: userName
      });
    } else {
      // User non connecté → Mode anonyme
      posthog.reset(); // Reset l'identité précédente si déconnexion
      hasIdentified.current = false;
      console.log('🔓 PostHog: Mode anonyme');
    }
  }, [user, isLoaded]); // Se re-exécute si user change (login/logout)

  // 3️⃣ TRACKING DE LA DÉCONNEXION
  useEffect(() => {
    logoutEffectCount.current += 1;
    console.log(`🔢 [LOGOUT] useEffect exécuté ${logoutEffectCount.current} fois`);
    
    if (isLoaded && !user && hasIdentified.current) {
      console.log('👋 PostHog: User déconnecté, reset identity');
      posthog.reset();
      hasIdentified.current = false;
    }
  }, [user, isLoaded]);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
