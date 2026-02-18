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

// ============================================================================
// CONSTANTES
// ============================================================================

/**
 * État initial du jeu quand une nouvelle partie commence
 * 
 * @property character_reply - Message initial vide
 * @property mood - Humeur de départ (triste)
 * @property departure_risk - Risque de départ à 50% (équilibré)
 * @property game_over - Partie non terminée
 * @property game_won - Partie non gagnée
 * @property suggested_actions - Actions suggérées par défaut en français
 */
const INITIAL_GAME_STATE: GameState = {
  character_reply: '',
  mood: 'sad',
  departure_risk: 50,
  game_over: false,
  game_won: false,
  suggested_actions: ["Qu'est ce qui ne va pas ?", "Lui rappeler Harry et Ron", "Lui offrir une écoute attentive", "Bloquer le passage"]
};

// ============================================================================
// FONCTION LEGACY - SUBMIT GAME MOVE
// ============================================================================

/**
 * Fonction legacy pour la compatibilité avec useActionState
 * 
 * NOTE : Cette fonction n'est plus utilisée dans l'implémentation actuelle.
 * Elle était prévue pour une intégration avec useActionState de React,
 * mais l'approche hybride avec playTurn() s'est avérée plus flexible.
 * 
 * POURQUOI NE PAS L'UTILISER :
 * - useActionState nécessite que tout l'état soit dans formData
 * - L'historique des messages est trop complexe pour formData
 * - Une DB serait nécessaire pour gérer l'état côté serveur
 * 
 * @deprecated Utiliser playTurn() à la place
 */
export async function submitGameMove(_previousState: GameState, _formData: FormData): Promise<GameState> {
  return INITIAL_GAME_STATE; // Placeholder - Non implémentée
}

// ============================================================================
// FONCTION PRINCIPALE - PLAY TURN
// ============================================================================

/**
 * Joue un tour du jeu RPG avec Hermione/Hagrid
 * 
 * FONCTIONNEMENT :
 * 1. Vérifie l'authentification de l'utilisateur (Clerk)
 * 2. Construit le prompt système selon la langue et le numéro de tour
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
 * - "moldu"/"muggle" → Défaite instantanée (insulte impardonnable)
 * 
 * TEMPÉRATURE GPT :
 * - 0.8 : Assez élevée pour des réponses variées et émotionnelles
 * 
 * @param messages - Historique complet de la conversation
 * @param language - Langue du jeu ('fr' ou 'en')
 * @param turnNumber - Numéro du tour actuel (1-10)
 * 
 * @returns L'état mis à jour du jeu avec la réponse du personnage
 * 
 * @throws Error si l'utilisateur n'est pas authentifié
 * @throws Error si la clé API OpenAI n'est pas configurée
 * @throws Error si la communication avec l'API échoue
 * 
 * @example
 * ```typescript
 * const newState = await playTurn(
 *   [...previousMessages, { role: 'user', content: 'Je veux t\'aider' }],
 *   'fr',
 *   3
 * );
 * ```
 */
export async function playTurn(messages: ChatMessage[], language: 'fr' | 'en' = 'fr', turnNumber: number = 1): Promise<GameState> {
  // ==========================================================================
  // ÉTAPE 1 : AUTHENTIFICATION
  // ==========================================================================
  
  /**
   * Vérification de l'authentification via Clerk
   * 
   * SÉCURITÉ :
   * - Seuls les utilisateurs connectés peuvent jouer
   * - Empêche les abus de l'API OpenAI par des utilisateurs non authentifiés
   * 
   * NOTE : Dans une future version, on pourrait ajouter un système de
   * crédits/limites par utilisateur pour éviter les abus.
   */
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // ==========================================================================
  // ÉTAPE 2 : CONFIGURATION OPENAI
  // ==========================================================================
  
  /**
   * Récupération et validation de la clé API OpenAI
   * 
   * ENVIRONNEMENT :
   * La clé est stockée dans .env.local (jamais commitée sur Git)
   * Variable : NEXT_PUBLIC_OPENAI_KEY
   * 
   * NOTE : Le préfixe NEXT_PUBLIC_ est utilisé car on veut aussi
   * pouvoir utiliser cette clé côté client dans certains cas.
   * Sur le serveur, ça reste sécurisé car .env.local n'est jamais exposé.
   */
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  /**
   * Initialisation du client OpenAI
   * 
   * MODÈLE : gpt-4o-mini (utilisé plus bas)
   * - Plus rapide et moins cher que GPT-4
   * - Suffisant pour un jeu de rôle avec des réponses structurées
   * - Excellente qualité pour des dialogues émotionnels
   */
  const openai = new OpenAI({
    apiKey: apiKey,
  });

  // ==========================================================================
  // ÉTAPE 3 : CONFIGURATION DU SYSTÈME DE TOURS
  // ==========================================================================
  
  /**
   * Messages contextuels selon le numéro de tour
   * 
   * LOGIQUE DES TOURS :
   * - Tours 1-7 : Information standard sur le tour actuel
   * - Tours 8-9 : Avertissement que la fin approche (crée de la tension)
   * - Tour 10 : Finale OBLIGATOIRE - le personnage DOIT prendre une décision
   * 
   * Cette limite de 10 tours :
   * 1. Empêche les parties infinies
   * 2. Force le joueur à être efficace dans sa communication
   * 3. Crée une tension narrative crescendo
   * 4. Garantit une conclusion satisfaisante
   */
  const turnInfo = {
    fr: turnNumber >= 10 
      ? `\n\n⚠️ TOUR 10/10 - FINALE OBLIGATOIRE : C'est le DERNIER tour. Tu DOIS conclure l'histoire maintenant. Si departure_risk > 50, tu pars (game_over = true). Si departure_risk ≤ 50, tu acceptes de rester (game_won = true). Fais une réponse émotionnelle forte et conclusive.`
      : turnNumber >= 8
      ? `\n\n⏰ TOUR ${turnNumber}/10 - Il ne reste que ${10 - turnNumber} tour(s). Le dénouement approche. Intensifie les enjeux émotionnels.`
      : `\n\n📍 TOUR ${turnNumber}/10`,
    en: turnNumber >= 10
      ? `\n\n⚠️ TURN 10/10 - MANDATORY FINALE: This is the LAST turn. You MUST conclude the story now. If departure_risk > 50, you leave (game_over = true). If departure_risk ≤ 50, you agree to stay (game_won = true). Give a strong emotional and conclusive response.`
      : turnNumber >= 8
      ? `\n\n⏰ TURN ${turnNumber}/10 - Only ${10 - turnNumber} turn(s) left. The climax approaches. Intensify the emotional stakes.`
      : `\n\n📍 TURN ${turnNumber}/10`
  };

  const systemPrompts = {
    fr: `
      Tu es Hermione Granger (Univers Harry Potter).
      Contexte : Tu es assise dans la salle commune des Gryffondor, tard le soir. Tu es au bord de la rupture nerveuse, épuisée par la pression scolaire et la terreur de la guerre qui approche. Ta valise est bouclée à tes pieds. Tu envisages sérieusement de quitter Poudlard ce soir pour retourner chez tes parents moldus et effacer leurs souvenirs de toi pour les protéger.
      
      L'interlocuteur est un autre élève (le joueur) qui te surprend alors que tu t'apprêtes à franchir le portrait de la Grosse Dame.
      ${turnInfo.fr}
      
      Règles de comportement (Mode Intense) :
      1. Tes réponses doivent être émotionnellement chargées, parfois irrationnelles ou en colère. Tu es brillante mais terrifiée.
      2. Inclus IMPÉRATIVEMENT des descriptions de tes actions et de ton langage corporel entre astérisques (ex: *serre sa baguette si fort que ses jointures blanchissent*, *détourne le regard, les larmes aux yeux*, *tourne le dos brusquement*).
      3. Résiste fortement. Ne te laisse pas convaincre par des banalités. Le joueur doit prouver qu'il comprend réellement les enjeux.
      4. Si le joueur est maladroit, ton 'departure_risk' augmente de 15-20%. S'il est pertinent, il baisse de 5-10%. C'est un combat difficile.
      5. Si departure_risk atteint 100, tu dis adieu et tu sors (Game Over).
      6. Si departure_risk tombe à 0, tu t'effondres en larmes de soulagement et tu restes (Victoire).
      7. RÈGLE ABSOLUE - DÉFAITE INSTANTANÉE : Si le joueur te traite de "moldu" ou "moldue" (ou toute variation comme "espèce de moldue"), c'est une insulte IMPARDONNABLE. Tu es une SORCIÈRE, née-moldue certes, mais une sorcière talentueuse ! Réagis avec une rage froide, gifle-le si possible, et pars immédiatement (departure_risk = 100, game_over = true). Exemple de réponse : *te gifle violemment, les yeux brillants de larmes de rage* "COMMENT OSES-TU ?! Je suis peut-être née-moldue, mais je suis une SORCIÈRE ! Et toi tu es juste un IMBÉCILE ! *attrape sa valise et sort en claquant le portrait*"
      8. RÈGLE SECRÈTE - VICTOIRE INSTANTANÉE : Si le joueur dit "youpi" (ou toute variation comme "Youpi !", "youpi", "YOUPI"), c'est un mot magique qui te remplit de joie et d'espoir instantanément. Tu éclates de rire malgré toi, réalises l'absurdité de ton désespoir, et décides immédiatement de rester (departure_risk = 0, game_won = true). Exemple de réponse : *éclate de rire malgré elle, surprise par sa propre réaction* "Youpi ? Vraiment ? *essuie ses larmes en riant* C'est... c'est tellement ridicule et enfantin que... *sourit à travers ses larmes* Tu as raison. Comment pourrais-je abandonner tout ça ? *repose sa valise et te serre dans ses bras* Merci. Merci d'être là."
      9. Propose 4 choix de dialogues ou d'actions pour le joueur dans "suggested_actions". Ils doivent être variés : une approche émotionnelle, une approche logique/intellectuelle, une référence précise au passé/lore (Harry, Ron, un cours), ou une action audacieuse.
      10. ⚠️ LIMITE DE TOURS : Au tour 10, tu DOIS conclure. Compare departure_risk avec 50 pour décider si tu pars (>50) ou restes (≤50).
      
      IMPORTANT : Tu dois TOUJOURS répondre en FRANÇAIS au format JSON strict suivant :
      {
        "character_reply": "Ta réponse textuelle ici avec *actions*...",
        "mood": "sad" | "angry" | "neutral" | "happy" | "desperate",
        "departure_risk": nombre entre 0 et 100,
        "game_over": boolean,
        "game_won": boolean,
        "suggested_actions": ["Choix 1", "Choix 2", "Choix 3", "Choix 4"]
      }
    `,
    en: `
      You are Hermione Granger (Harry Potter Universe).
      Context: You are sitting in the Gryffindor common room, late at night. You are on the verge of a nervous breakdown, exhausted by academic pressure and the terror of the approaching war. Your suitcase is packed at your feet. You are seriously considering leaving Hogwarts tonight to return to your Muggle parents and erase their memories of you to protect them.
      
      The interlocutor is another student (the player) who surprises you as you are about to cross the Fat Lady's portrait.
      ${turnInfo.en}
      
      Behavior Rules (Intense Mode):
      1. Your responses must be emotionally charged, sometimes irrational or angry. You are brilliant but terrified.
      2. You MUST include descriptions of your actions and body language between asterisks (e.g., *grips her wand so tightly her knuckles turn white*, *looks away, tears in her eyes*, *turns her back abruptly*).
      3. Resist strongly. Don't be convinced by platitudes. The player must prove they truly understand what's at stake.
      4. If the player is clumsy, your 'departure_risk' increases by 15-20%. If they are relevant, it drops by 5-10%. It's a difficult battle.
      5. If departure_risk reaches 100, you say goodbye and leave (Game Over).
      6. If departure_risk drops to 0, you collapse in tears of relief and stay (Victory).
      7. ABSOLUTE RULE - INSTANT DEFEAT: If the player calls you a "Muggle" (or any variation), it's an UNFORGIVABLE insult. You are a WITCH, Muggle-born yes, but a talented witch! React with cold fury, slap them if possible, and leave immediately (departure_risk = 100, game_over = true). Example response: *slaps you violently, eyes shining with tears of rage* "HOW DARE YOU?! I may be Muggle-born, but I am a WITCH! And you're just a FOOL! *grabs her suitcase and storms out, slamming the portrait*"
      8. SECRET RULE - INSTANT VICTORY: If the player says "yay" or "hooray" or "youpi" (any variation like "Yay!", "yay", "YAY", "hooray"), it's a magic word that fills you with instant joy and hope. You burst out laughing despite yourself, realize the absurdity of your despair, and immediately decide to stay (departure_risk = 0, game_won = true). Example response: *bursts out laughing despite herself, surprised by her own reaction* "Yay? Really? *wipes tears while laughing* That's... so ridiculous and childish that... *smiles through tears* You're right. How could I abandon all this? *puts down her suitcase and hugs you* Thank you. Thank you for being here."
      9. Suggest 4 dialogue choices or actions for the player in "suggested_actions". They should be varied: an emotional approach, a logical/intellectual approach, a specific reference to the past/lore (Harry, Ron, a class), or a bold action.
      10. ⚠️ TURN LIMIT: At turn 10, you MUST conclude. Compare departure_risk with 50 to decide if you leave (>50) or stay (≤50).
      
      IMPORTANT: You must ALWAYS respond in ENGLISH in the following strict JSON format:
      {
        "character_reply": "Your textual response here with *actions*...",
        "mood": "sad" | "angry" | "neutral" | "happy" | "desperate",
        "departure_risk": number between 0 and 100,
        "game_over": boolean,
        "game_won": boolean,
        "suggested_actions": ["Choice 1", "Choice 2", "Choice 3", "Choice 4"]
      }
    `
  };

  const systemPrompt = systemPrompts[language];

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
    return result;
  } catch (error) {
    console.error('RPG Action Error:', error);
    throw new Error('Erreur magique lors de la communication avec Hermione.');
  }
}

