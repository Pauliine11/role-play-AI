/**
 * =============================================================================
 * SERVER ACTIONS - LOGIQUE DE JEU
 * =============================================================================
 * 
 * Ce fichier contient les Server Actions Next.js pour la logique du jeu RPG.
 * Toutes les fonctions s'exécutent côté serveur, garantissant la sécurité
 * de la clé API OpenAI et empêchant la triche.
 * 
 * FONCTIONNALITÉS :
 * - Communication avec OpenAI GPT-4o-mini
 * - Gestion de l'état du jeu (mood, risk, win/lose)
 * - Système de tours limités (10 tours maximum)
 * - Support multilingue (FR/EN)
 * - Mots secrets pour victoire/défaite instantanée
 * 
 * ARCHITECTURE :
 * Client (game/page.tsx) → Server Action (playTurn) → OpenAI API → Client
 * 
 * SÉCURITÉ :
 * - Authentification requise via Clerk
 * - Clé API OpenAI côté serveur uniquement
 * - Validation des entrées utilisateur
 * 
 * =============================================================================
 */

'use server';

import OpenAI from 'openai';
import { auth } from '@clerk/nextjs/server';
import { GameState, ChatMessage } from '@/shared/types';
import { LevelContent } from '@/shared/types/game';
import { shouldTriggerChallenge, generateRandomChallenge } from './conversation-actions';
import { generateCharacterPrompt } from '../config/character-prompts';
import { MAX_TURNS } from '../config/game-rules';

// ============================================================================
// CONSTANTES
// ============================================================================

/**
 * État initial du jeu
 * Utilisé comme fallback ou valeur de départ
 */
export const INITIAL_GAME_STATE: GameState = {
  character_reply: "Attends... qui es-tu ? *te regarde avec méfiance*",
  mood: 'sad',
  departure_risk: 50,
  game_over: false,
  game_won: false,
  suggested_actions: [
    "Qu'est-ce qui ne va pas ?",
    "Tu sembles préoccupée...",
    "Je peux t'aider ?",
    "Laisse-moi tranquille"
  ]
};

// ============================================================================
// FONCTION HELPER - GÉNÉRATION DE PROMPTS DYNAMIQUES
// ============================================================================

/**
 * Génère un prompt système dynamique en fonction du personnage
 * 
 * @param character - Nom du personnage (ex: "Hermione Granger", "Ron Weasley")
 * @param levelContent - Contenu du niveau avec location, objective, etc.
 * @param language - Langue du prompt
 * @param turnInfo - Information sur le tour actuel
 * @returns Le prompt système complet pour GPT
 */
function generateSystemPrompt(
  character: string,
  levelContent: LevelContent | undefined,
  language: 'fr' | 'en',
  turnInfo: string
): string {
  const basePrompt = generateCharacterPrompt(character, levelContent, language);
  
  const jsonFormat = language === 'fr'
    ? `

IMPORTANT : Tu dois TOUJOURS répondre en FRANÇAIS au format JSON strict suivant :
{
  "character_reply": "Ta réponse textuelle ici avec *actions*...",
  "mood": "sad" | "angry" | "neutral" | "happy" | "desperate" | "nervous",
  "departure_risk": nombre entre 0 et 100,
  "game_over": boolean,
  "game_won": boolean,
  "suggested_actions": ["Choix 1", "Choix 2", "Choix 3", "Choix 4"]
}`
    : `

IMPORTANT: You must ALWAYS respond in ENGLISH in the following strict JSON format:
{
  "character_reply": "Your textual response here with *actions*...",
  "mood": "sad" | "angry" | "neutral" | "happy" | "desperate" | "nervous",
  "departure_risk": number between 0 and 100,
  "game_over": boolean,
  "game_won": boolean,
  "suggested_actions": ["Choice 1", "Choice 2", "Choice 3", "Choice 4"]
}`;
  
  return `${basePrompt}

${turnInfo}

${jsonFormat}`;
}

// ============================================================================
// FONCTION PRINCIPALE - PLAY TURN
// ============================================================================

/**
 * Joue un tour du jeu RPG avec n'importe quel personnage
 * 
 * FONCTIONNEMENT :
 * 1. Vérifie l'authentification de l'utilisateur (Clerk)
 * 2. Construit le prompt système dynamique selon le personnage, la langue et le numéro de tour
 * 3. Envoie les messages à OpenAI GPT-4o-mini
 * 4. Parse la réponse JSON avec le nouvel état du jeu
 * 5. Retourne l'état mis à jour au client
 * 
 * SYSTÈME DE TOURS :
 * - Tours 1-7 : Jeu normal
 * - Tours 8-9 : Avertissement que la fin approche
 * - Tour 10 : Finale obligatoire (conclusion forcée)
 * 
 * MOTS SECRETS :
 * - "youpi"/"yay" → Victoire instantanée (departure_risk = 0)
 * - Insultes → Défaite instantanée
 * 
 * @param messages - Historique complet de la conversation
 * @param language - Langue du jeu ('fr' ou 'en')
 * @param turnNumber - Numéro du tour actuel (1-10)
 * @param levelContent - Contenu du niveau (personnage, lieu, objectif, etc.)
 * 
 * @returns L'état mis à jour du jeu avec la réponse du personnage
 * 
 * @throws Error si l'utilisateur n'est pas authentifié
 * @throws Error si la clé API OpenAI n'est pas configurée
 * @throws Error si la communication avec l'API échoue
 */
export async function playTurn(
  messages: ChatMessage[], 
  language: 'fr' | 'en' = 'fr', 
  turnNumber: number = 1,
  levelContent?: LevelContent
): Promise<GameState> {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const apiKey = process.env.NEXT_PUBLIC_OPENAI_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const openai = new OpenAI({
    apiKey: apiKey,
  });

  const turnInfoText = language === 'fr'
    ? (turnNumber >= MAX_TURNS 
        ? `\n\n⚠️ TOUR ${MAX_TURNS}/${MAX_TURNS} - FINALE OBLIGATOIRE : C'est le DERNIER tour. Tu DOIS conclure l'histoire maintenant. Si departure_risk > 50, tu pars (game_over = true). Si departure_risk ≤ 50, tu acceptes de rester (game_won = true). Fais une réponse émotionnelle forte et conclusive.`
        : turnNumber >= 8
        ? `\n\n⏰ TOUR ${turnNumber}/${MAX_TURNS} - Il ne reste que ${MAX_TURNS - turnNumber} tour(s). Le dénouement approche. Intensifie les enjeux émotionnels.`
        : `\n\n📍 TOUR ${turnNumber}/${MAX_TURNS}`)
    : (turnNumber >= MAX_TURNS
        ? `\n\n⚠️ TURN ${MAX_TURNS}/${MAX_TURNS} - MANDATORY FINALE: This is the LAST turn. You MUST conclude the story now. If departure_risk > 50, you leave (game_over = true). If departure_risk ≤ 50, you agree to stay (game_won = true). Give a strong emotional and conclusive response.`
        : turnNumber >= 8
        ? `\n\n⏰ TURN ${turnNumber}/${MAX_TURNS} - Only ${MAX_TURNS - turnNumber} turn(s) left. The climax approaches. Intensify the emotional stakes.`
        : `\n\n📍 TURN ${turnNumber}/${MAX_TURNS}`);

  const character = levelContent?.character || 'Hermione Granger';
  
  console.log('🎭 [playTurn] Personnage détecté:', character);
  console.log('📍 [playTurn] Lieu:', levelContent?.location || 'non défini');
  console.log('🎯 [playTurn] Objectif:', levelContent?.objective || 'non défini');
  
  const systemPrompt = generateSystemPrompt(character, levelContent, language, turnInfoText);
  
  console.log('📝 [playTurn] Prompt généré (début):', systemPrompt.substring(0, 200));

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const content = response.choices[0].message?.content;
    if (!content) {
      throw new Error('No content in response');
    }

    const result = JSON.parse(content) as GameState;
    
    const hasChallenge = await shouldTriggerChallenge();
    const challengeType = hasChallenge ? await generateRandomChallenge() : undefined;
    
    return {
      ...result,
      hasChallenge,
      challengeType,
    };
  } catch (error) {
    console.error('RPG Action Error:', error);
    const characterName = levelContent?.character || 'le personnage';
    throw new Error(`Erreur magique lors de la communication avec ${characterName}.`);
  }
}
