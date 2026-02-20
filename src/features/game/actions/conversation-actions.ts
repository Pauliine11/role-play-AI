'use server';

import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/shared/lib/supabase';

/**
 * Créer une nouvelle session de jeu
 */
export async function createGameSession(levelId: string, language: 'fr' | 'en' = 'fr') {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  try {
    const { data, error } = await supabase
      .from('game_sessions')
      .insert([
        {
          user_id: userId,
          level_id: levelId,
          language,
          started_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating game session:', error);
    return null;
  }
}

/**
 * Mettre à jour une session de jeu
 */
export async function updateGameSession(
  sessionId: string,
  outcome: 'won' | 'lost' | 'abandoned',
  finalDepartureRisk: number,
  turnCount: number,
  durationSeconds: number
) {
  try {
    const { error } = await supabase
      .from('game_sessions')
      .update({
        ended_at: new Date().toISOString(),
        result: outcome === 'won' ? 'victory' : outcome === 'lost' ? 'defeat' : 'abandoned',
        final_departure_risk: finalDepartureRisk,
        turn_count: turnCount,
        metadata: {
          duration_seconds: durationSeconds,
        },
      })
      .eq('id', sessionId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating game session:', error);
    return { success: false };
  }
}

/**
 * Sauvegarder un message de conversation
 */
export async function saveConversationMessage(
  sessionId: string,
  levelId: string,
  message: { role: 'user' | 'assistant' | 'system'; content: string },
  mood?: string,
  departureRisk?: number
) {
  try {
    // Ne sauvegarder que les messages user et assistant (pas system)
    if (message.role === 'system') return { success: true };
    
    const { error } = await supabase
      .from('conversation_messages')
      .insert([
        {
          session_id: sessionId,
          role: message.role,
          content: message.content,
          metadata: {
            level_id: levelId,
            mood,
            departure_risk: departureRisk,
          },
        },
      ]);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error saving message:', error);
    return { success: false };
  }
}

/**
 * Sauvegarder un choix de joueur
 */
export async function savePlayerChoice(
  sessionId: string,
  levelId: string,
  choiceText: string,
  wasSuggested: boolean,
  responseMood?: string,
  riskChange?: number
) {
  try {
    const { error } = await supabase
      .from('player_choices')
      .insert([
        {
          session_id: sessionId,
          choice_text: choiceText,
          metadata: {
            level_id: levelId,
            was_suggested: wasSuggested,
            response_mood: responseMood,
            risk_change: riskChange,
          },
        },
      ]);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error saving choice:', error);
    return { success: false };
  }
}

/**
 * Débloquer un achievement
 */
export async function unlockAchievement(
  achievementId: string, 
  metadata?: Record<string, string | number | boolean>
) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  try {
    const { error } = await supabase
      .from('user_achievements')
      .insert([
        {
          user_id: userId,
          achievement_id: achievementId,
          unlocked_at: new Date().toISOString(),
          metadata,
        },
      ]);

    if (error && error.code !== '23505') {
      // Ignore duplicate key errors
      throw error;
    }
    return { success: true };
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    return { success: false };
  }
}

/**
 * Détermine si un challenge doit être déclenché
 * 30% de chances à chaque message
 */
export async function shouldTriggerChallenge(): Promise<boolean> {
  return Math.random() < 0.3;
}

/**
 * Génère un type de challenge aléatoire
 */
export async function generateRandomChallenge(): Promise<'dementor' | 'spider' | 'fire' | 'devil-snare' | 'serpent' | 'ice-trap'> {
  const challenges: Array<'dementor' | 'spider' | 'fire' | 'devil-snare' | 'serpent' | 'ice-trap'> = [
    'dementor',
    'spider',
    'fire',
    'devil-snare',
    'serpent',
    'ice-trap',
  ];
  
  return challenges[Math.floor(Math.random() * challenges.length)];
}
