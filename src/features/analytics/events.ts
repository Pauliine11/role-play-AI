/**
 * PostHog Analytics - Événements Custom
 * 
 * Ce fichier contient toutes les fonctions pour tracker les événements
 * dans le jeu RPG avec PostHog
 */

import posthog from 'posthog-js';

/**
 * Événement: Début de partie
 */
export function trackGameStart(levelId: string, levelTitle: string, character: string) {
  posthog.capture('game_started', {
    level_id: levelId,
    level_title: levelTitle,
    character: character,
    timestamp: new Date().toISOString(),
  });
  
  console.log('📊 PostHog Event: game_started', {
    level_id: levelId,
    character: character,
  });
}

/**
 * Événement: Envoi d'un message
 */
export function trackMessageSent(
  levelId: string,
  turnNumber: number,
  messageLength: number,
  departureRisk: number
) {
  posthog.capture('message_sent', {
    level_id: levelId,
    turn_number: turnNumber,
    message_length: messageLength,
    departure_risk: departureRisk,
    timestamp: new Date().toISOString(),
  });
  
  console.log('📊 PostHog Event: message_sent', {
    turn: turnNumber,
    departure_risk: departureRisk,
  });
}

/**
 * Événement: Fin de partie (Victoire ou Défaite)
 */
export function trackGameEnd(
  levelId: string,
  levelTitle: string,
  character: string,
  result: 'victory' | 'defeat',
  turnCount: number,
  finalDepartureRisk: number,
  gameDurationSeconds: number,
  defeatReason?: 'normal' | 'muggle_insult' | 'max_turns'
) {
  posthog.capture('game_ended', {
    level_id: levelId,
    level_title: levelTitle,
    character: character,
    result: result,
    turn_count: turnCount,
    final_departure_risk: finalDepartureRisk,
    game_duration_seconds: gameDurationSeconds,
    defeat_reason: defeatReason || null,
    timestamp: new Date().toISOString(),
  });
  
  console.log('📊 PostHog Event: game_ended', {
    result: result,
    turns: turnCount,
    duration: `${gameDurationSeconds}s`,
  });
}

/**
 * Événement: Changement de langue
 */
export function trackLanguageChange(from: string, to: string) {
  posthog.capture('language_changed', {
    from_language: from,
    to_language: to,
    timestamp: new Date().toISOString(),
  });
  
  console.log('📊 PostHog Event: language_changed', { from, to });
}

/**
 * Événement: Utilisation d'un mot secret
 */
export function trackSecretWordUsed(word: string, effect: 'instant_victory' | 'instant_defeat') {
  posthog.capture('secret_word_used', {
    word: word,
    effect: effect,
    timestamp: new Date().toISOString(),
  });
  
  console.log('📊 PostHog Event: secret_word_used', { word, effect });
}

/**
 * Événement: Navigation vers niveau suivant
 */
export function trackLevelNavigation(from: string, to: string) {
  posthog.capture('level_navigation', {
    from_level: from,
    to_level: to,
    timestamp: new Date().toISOString(),
  });
  
  console.log('📊 PostHog Event: level_navigation', { from, to });
}
