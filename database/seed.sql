-- ============================================
-- SCRIPT D'INITIALISATION - Le Grimoire Éveillé
-- ============================================
-- Ce script peuple la base de données avec des niveaux de test
-- Exécutez-le dans votre console Supabase SQL Editor

-- ============================================
-- 1. NETTOYAGE (optionnel - décommentez si besoin)
-- ============================================
-- DELETE FROM user_level_progress;
-- DELETE FROM levels;

-- ============================================
-- 2. INSERTION DES NIVEAUX
-- ============================================

-- Niveau 1 : Hermione Granger - Bibliothèque de Poudlard
INSERT INTO levels (title, description, order_index, is_active, content, created_at)
VALUES (
  'Bibliothèque de Poudlard - Hermione',
  'Hermione Granger est désespérée et envisage de quitter Poudlard. Parvenez à lui redonner espoir.',
  1,
  true,
  '{
    "character": "Hermione Granger",
    "initial_mood": "sad",
    "location": "Bibliothèque de Poudlard",
    "time": "Tard le soir",
    "initial_message": "Hermione est assise seule, entourée de livres. Elle semble épuisée et découragée.",
    "objective": "Redonner espoir à Hermione et l''empêcher de quitter Poudlard",
    "difficulty": "medium",
    "win_conditions": [
      "Hermione retrouve confiance en elle",
      "Elle décide de rester à Poudlard",
      "Son moral s''améliore significativement"
    ],
    "lose_conditions": [
      "Hermione part définitivement",
      "Elle perd tout espoir",
      "La conversation tourne mal"
    ],
    "suggested_actions": [
      "Saluer doucement",
      "Demander de l''aide pour un sort",
      "S''asseoir en silence",
      "Lui demander ce qui ne va pas"
    ],
    "context": "Il est tard. Hermione Granger, élève brillante de Poudlard, est ensevelie sous les livres de la bibliothèque. Elle envisage sérieusement de quitter l''école. Le joueur doit interagir avec elle de manière empathique et constructive pour lui redonner espoir. La conversation doit être naturelle, respectueuse, et tenir compte de ses émotions."
  }'::jsonb,
  NOW()
)
ON CONFLICT DO NOTHING;

-- Niveau 2 : Hagrid - Cabane Interdite
INSERT INTO levels (title, description, order_index, is_active, content, created_at)
VALUES (
  'La Cabane d''Hagrid - Secret Interdit',
  'Hagrid cache quelque chose dans sa cabane. Découvrez son secret sans le brusquer.',
  2,
  true,
  '{
    "character": "Hagrid",
    "initial_mood": "nervous",
    "location": "Cabane d''Hagrid",
    "time": "Crépuscule",
    "initial_message": "Hagrid semble nerveux. Il cache quelque chose derrière son dos et jette des regards inquiets vers l''arrière de sa cabane.",
    "objective": "Découvrir le secret d''Hagrid tout en gardant sa confiance",
    "difficulty": "hard",
    "win_conditions": [
      "Hagrid révèle son secret volontairement",
      "La confiance mutuelle est maintenue",
      "Le problème est résolu ensemble"
    ],
    "lose_conditions": [
      "Hagrid devient méfiant et ferme",
      "Il refuse de parler",
      "La situation empire"
    ],
    "suggested_actions": [
      "Proposer de l''aide",
      "Parler des créatures magiques",
      "Mentionner Dumbledore",
      "Demander poliment ce qui se passe"
    ],
    "context": "Hagrid, le garde-chasse de Poudlard, cache une créature magique interdite dans sa cabane. Il a peur d''être renvoyé mais il a aussi besoin d''aide. Le joueur doit gagner sa confiance et l''aider sans le juger. Hagrid est loyal mais peut devenir très méfiant si on le brusque."
  }'::jsonb,
  NOW()
)
ON CONFLICT DO NOTHING;

-- Niveau 3 : Ron Weasley - Salle Commune Gryffondor
INSERT INTO levels (title, description, order_index, is_active, content, created_at)
VALUES (
  'La Salle Commune - Ron Weasley',
  'Ron doute de ses capacités et se compare sans cesse à ses frères. Aidez-le à retrouver confiance.',
  3,
  true,
  '{
    "character": "Ron Weasley",
    "initial_mood": "sad",
    "location": "Salle Commune Gryffondor",
    "time": "Après les cours",
    "initial_message": "Encore raté... *froisse un parchemin d''un coup de poing* Pourquoi je me donne même la peine d''essayer ? De toute façon, je serai toujours le moins bon...",
    "objective": "Aider Ron à surmonter son complexe d''infériorité",
    "difficulty": "medium",
    "win_conditions": [
      "Ron retrouve confiance en ses capacités",
      "Il accepte d''être lui-même",
      "Son estime de soi s''améliore"
    ],
    "lose_conditions": [
      "Ron se referme complètement",
      "Il abandonne ses efforts",
      "La situation empire"
    ],
    "suggested_actions": [
      "Qu''est-ce qui s''est passé ?",
      "Tu es meilleur que tu ne le crois",
      "Parler de ses frères",
      "Lui rappeler ses réussites"
    ],
    "context": "Ron Weasley, le meilleur ami de Harry Potter, souffre d''un profond complexe d''infériorité. Il se compare constamment à ses frères brillants et à Harry, le héros de Poudlard. Le joueur doit l''aider à voir ses propres qualités et à accepter qu''il n''a pas besoin d''être le meilleur pour avoir de la valeur."
  }'::jsonb,
  NOW()
)
ON CONFLICT DO NOTHING;

-- Niveau 4 : Luna Lovegood - Tour de Serdaigle
INSERT INTO levels (title, description, order_index, is_active, content, created_at)
VALUES (
  'Tour de Serdaigle - Luna et les Nargoles',
  'Luna Lovegood cherche des créatures invisibles. Aidez-la dans sa quête particulière.',
  4,
  true,
  '{
    "character": "Luna Lovegood",
    "initial_mood": "neutral",
    "location": "Tour de Serdaigle",
    "time": "Pleine lune",
    "initial_message": "*regarde par la fenêtre avec des lunettes extravagantes* Oh, bonjour. Je cherche des Nargoles. Ils sont particulièrement actifs ce soir... Vous pouvez les voir aussi ?",
    "objective": "Comprendre Luna et participer à sa quête sans la ridiculiser",
    "difficulty": "easy",
    "win_conditions": [
      "Luna se sent comprise et acceptée",
      "Une amitié sincère se forme",
      "Sa confiance en elle augmente"
    ],
    "lose_conditions": [
      "Luna est blessée par des moqueries",
      "Elle se referme sur elle-même",
      "La conversation devient malaisante"
    ],
    "suggested_actions": [
      "Que cherchez-vous exactement ?",
      "Je crois que je vois quelque chose...",
      "Parlez-moi des Nargoles",
      "Vous êtes courageuse de les chercher"
    ],
    "context": "Luna Lovegood est une élève unique et incomprise de Serdaigle. Elle croit aux créatures magiques que personne d''autre ne peut voir. Le joueur doit l''accepter telle qu''elle est et participer à sa vision du monde avec respect et ouverture d''esprit, même si cela semble étrange."
  }'::jsonb,
  NOW()
)
ON CONFLICT DO NOTHING;

-- ============================================
-- 3. VÉRIFICATION
-- ============================================
-- Afficher tous les niveaux créés
SELECT 
  id,
  title,
  description,
  order_index,
  is_active,
  created_at
FROM levels
ORDER BY order_index;

-- ============================================
-- 4. NOTES
-- ============================================
-- - La table user_level_progress se remplira automatiquement quand les utilisateurs joueront
-- - Seuls les niveaux avec is_active = true seront visibles dans le jeu
-- - Le contenu JSON permet une grande flexibilité pour chaque niveau
-- - Vous pouvez ajouter vos propres niveaux via l'interface Admin du jeu
