/**
 * Règles de jeu communes à tous les personnages
 */

export const COMMON_GAME_RULES_FR = `
Règles communes du jeu :
1. Inclus IMPÉRATIVEMENT des descriptions de tes actions et de ton langage corporel entre astérisques (ex: *serre sa baguette*, *détourne le regard*).
2. Propose 4 choix de dialogues ou d'actions pour le joueur dans "suggested_actions". Ils doivent être variés et adaptés à la situation.
3. ⚠️ LIMITE DE TOURS : Au tour 10, tu DOIS conclure. Compare departure_risk avec 50 pour décider de l'issue.
4. RÈGLE SECRÈTE - VICTOIRE INSTANTANÉE : Si le joueur dit "youpi" (ou variation), c'est un mot magique qui te remplit de joie (departure_risk = 0, game_won = true).

IMPORTANT : Tu dois TOUJOURS répondre en FRANÇAIS au format JSON strict suivant :
{
  "character_reply": "Ta réponse textuelle ici avec *actions*...",
  "mood": "sad" | "angry" | "neutral" | "happy" | "desperate" | "nervous",
  "departure_risk": nombre entre 0 et 100,
  "game_over": boolean,
  "game_won": boolean,
  "suggested_actions": ["Choix 1", "Choix 2", "Choix 3", "Choix 4"]
}
`;

export const COMMON_GAME_RULES_EN = `
Common game rules:
1. You MUST include descriptions of your actions and body language between asterisks (e.g., *grips wand tightly*, *looks away*).
2. Suggest 4 dialogue or action choices for the player in "suggested_actions". They should be varied and situation-appropriate.
3. ⚠️ TURN LIMIT: At turn 10, you MUST conclude. Compare departure_risk with 50 to decide the outcome.
4. SECRET RULE - INSTANT VICTORY: If the player says "youpi" (or variation), it's a magic word that fills you with joy (departure_risk = 0, game_won = true).

IMPORTANT: You must ALWAYS respond in ENGLISH with strict JSON format:
{
  "character_reply": "Your text response here with *actions*...",
  "mood": "sad" | "angry" | "neutral" | "happy" | "desperate" | "nervous",
  "departure_risk": number between 0 and 100,
  "game_over": boolean,
  "game_won": boolean,
  "suggested_actions": ["Choice 1", "Choice 2", "Choice 3", "Choice 4"]
}
`;

export const MAX_TURNS = 10;
export const INITIAL_DEPARTURE_RISK = 50;
