-- ============================================
-- ÉTAPE 2 : Insérer/Mettre à jour TOUS les niveaux
-- ============================================
-- ⚠️ Exécutez d'abord 01_fix_id_to_text.sql si pas encore fait
-- Ce script insère les 4 niveaux avec leurs contenus complets

-- Niveau 1 : Hermione Granger
INSERT INTO levels (id, title, description, order_index, is_active, content, created_at)
VALUES (
  'level-hermione-1',
  'Bibliothèque de Poudlard - Hermione',
  'Hermione Granger est désespérée et envisage de quitter Poudlard. Parvenez à lui redonner espoir.',
  1,
  true,
  '{
    "character": "Hermione Granger",
    "initial_mood": "sad",
    "location": "Bibliothèque de Poudlard",
    "initial_message": "Je... je ne sais pas ce que je fais encore ici. Tout semble si vain. Je pense que je vais faire mes valises ce soir.",
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
      "Qu''est ce qui ne va pas ?",
      "Lui rappeler Harry et Ron",
      "Lui offrir une écoute attentive",
      "Bloquer le passage"
    ]
  }'::jsonb,
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_active = EXCLUDED.is_active,
  content = EXCLUDED.content,
  updated_at = NOW();

-- Niveau 2 : Hagrid
INSERT INTO levels (id, title, description, order_index, is_active, content, created_at)
VALUES (
  'level-hagrid-1',
  'La Cabane d''Hagrid - Secret Interdit',
  'Hagrid cache quelque chose dans sa cabane. Découvrez son secret sans le brusquer.',
  2,
  true,
  '{
    "character": "Hagrid",
    "initial_mood": "nervous",
    "location": "Cabane d''Hagrid",
    "initial_message": "Euh... Bonjour. Vous... vous cherchez quelque chose ? Je... j''ai du travail à faire, moi.",
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
      "Que cachez-vous ?",
      "Je peux vous aider ?",
      "Vous semblez nerveux...",
      "Belle journée n''est-ce pas ?"
    ]
  }'::jsonb,
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_active = EXCLUDED.is_active,
  content = EXCLUDED.content,
  updated_at = NOW();

-- Niveau 3 : Ron Weasley
INSERT INTO levels (id, title, description, order_index, is_active, content, created_at)
VALUES (
  'level-ron-1',
  'La Salle Commune - Ron Weasley',
  'Ron doute de ses capacités et se compare sans cesse à ses frères. Aidez-le à retrouver confiance.',
  3,
  true,
  '{
    "character": "Ron Weasley",
    "initial_mood": "sad",
    "location": "Salle Commune Gryffondor",
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
    ]
  }'::jsonb,
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_active = EXCLUDED.is_active,
  content = EXCLUDED.content,
  updated_at = NOW();

-- Niveau 4 : Luna Lovegood
INSERT INTO levels (id, title, description, order_index, is_active, content, created_at)
VALUES (
  'level-luna-1',
  'Tour de Serdaigle - Luna et les Nargoles',
  'Luna Lovegood cherche des créatures invisibles. Aidez-la dans sa quête particulière.',
  4,
  true,
  '{
    "character": "Luna Lovegood",
    "initial_mood": "neutral",
    "location": "Tour de Serdaigle",
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
    ]
  }'::jsonb,
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_active = EXCLUDED.is_active,
  content = EXCLUDED.content,
  updated_at = NOW();

-- ============================================
-- VÉRIFICATION
-- ============================================

-- Afficher tous les niveaux avec leurs personnages et lieux
SELECT 
  id,
  title,
  order_index,
  is_active,
  content->>'character' as character,
  content->>'location' as location,
  content->>'objective' as objective
FROM levels
ORDER BY order_index;

-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================
-- id              | title                                   | order | active | character        | location                    | objective
-- level-hermione-1| Bibliothèque de Poudlard - Hermione    | 1     | true   | Hermione Granger | Bibliothèque de Poudlard   | Redonner espoir...
-- level-hagrid-1  | La Cabane d'Hagrid - Secret Interdit   | 2     | true   | Hagrid           | Cabane d'Hagrid            | Découvrir le secret...
-- level-ron-1     | La Salle Commune - Ron Weasley         | 3     | true   | Ron Weasley      | Salle Commune Gryffondor   | Aider Ron...
-- level-luna-1    | Tour de Serdaigle - Luna et les Nargoles| 4     | true   | Luna Lovegood    | Tour de Serdaigle          | Comprendre Luna...
