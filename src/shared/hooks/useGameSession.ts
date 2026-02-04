/**
 * Hook pour gérer une session de jeu avec sauvegarde automatique
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { ChatMessage } from '@/shared/types';
import {
  createGameSession,
  updateGameSession,
  saveConversationMessage,
  savePlayerChoice,
  unlockAchievement
} from '@/features/game/actions/conversation-actions';

interface UseGameSessionOptions {
  levelId: string;
  language: 'fr' | 'en';
  autoSave?: boolean;  // Sauvegarde automatique des messages
  checkAchievements?: boolean;  // Vérifier les achievements automatiquement
}

export function useGameSession({
  levelId,
  language,
  autoSave = true,
  checkAchievements = true
}: UseGameSessionOptions) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const messageCountRef = useRef<number>(0);
  const lastDepartureRiskRef = useRef<number>(50);

  // Initialiser la session au montage
  useEffect(() => {
    const initSession = async () => {
      const { sessionId: newSessionId, success } = await createGameSession(levelId, language);
      if (success && newSessionId) {
        setSessionId(newSessionId);
        setIsInitialized(true);
        startTimeRef.current = Date.now();
      }
    };

    initSession();
  }, [levelId, language]);

  /**
   * Sauvegarder un message dans la base de données
   */
  const saveMessage = useCallback(
    async (message: ChatMessage, mood?: string, departureRisk?: number) => {
      if (!sessionId || !autoSave) return;

      await saveConversationMessage(sessionId, levelId, message, mood, departureRisk);
      messageCountRef.current++;
      
      if (departureRisk !== undefined) {
        lastDepartureRiskRef.current = departureRisk;
      }
    },
    [sessionId, levelId, autoSave]
  );

  /**
   * Enregistrer un choix du joueur
   */
  const recordChoice = useCallback(
    async (
      choiceText: string,
      wasSuggested: boolean,
      responseMood?: string,
      riskChange?: number
    ) => {
      if (!sessionId) return;

      await savePlayerChoice(
        sessionId,
        levelId,
        choiceText,
        wasSuggested,
        responseMood,
        riskChange
      );
    },
    [sessionId, levelId]
  );

  /**
   * Terminer la session (victoire/défaite)
   */
  const endSession = useCallback(
    async (outcome: 'won' | 'lost' | 'abandoned') => {
      if (!sessionId) return;

      const durationSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      
      await updateGameSession(
        sessionId,
        outcome,
        lastDepartureRiskRef.current,
        messageCountRef.current,
        durationSeconds
      );

      // Vérifier et débloquer des achievements
      if (checkAchievements) {
        // Première victoire
        if (outcome === 'won') {
          await unlockAchievement('first_win');
        }

        // Victoire rapide (< 5 minutes)
        if (outcome === 'won' && durationSeconds < 300) {
          await unlockAchievement('speed_runner', {
            duration: durationSeconds,
            level: levelId
          });
        }

        // Comeback héroïque (gagner après 80% de risque)
        if (outcome === 'won' && lastDepartureRiskRef.current >= 80) {
          await unlockAchievement('comeback_kid', {
            maxRisk: lastDepartureRiskRef.current,
            level: levelId
          });
        }

        // Beaucoup de messages
        if (messageCountRef.current >= 100) {
          await unlockAchievement('wordsmith');
        }
      }
    },
    [sessionId, checkAchievements, levelId]
  );

  /**
   * Abandonner la session (fermeture de page, etc.)
   */
  const abandonSession = useCallback(async () => {
    await endSession('abandoned');
  }, [endSession]);

  // Sauvegarder automatiquement si l'utilisateur quitte
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (sessionId) {
        // Note: Avec les restrictions modernes, cette requête peut ne pas aboutir
        // Une meilleure approche serait d'utiliser un heartbeat périodique
        abandonSession();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [sessionId, abandonSession]);

  return {
    sessionId,
    isInitialized,
    saveMessage,
    recordChoice,
    endSession,
    abandonSession,
    messageCount: messageCountRef.current,
    duration: Math.floor((Date.now() - startTimeRef.current) / 1000)
  };
}
