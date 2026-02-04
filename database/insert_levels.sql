-- ============================================
-- INSERTION DES NIVEAUX - Hermione & Hagrid
-- ============================================
-- Exécutez ce script dans Supabase SQL Editor

-- ============================================
-- OPTION 1: Insérer SANS supprimer (recommandé)
-- ============================================

-- Niveau 1 : Hermione Granger
INSERT INTO levels (id, title, description, order_index, is_active, content, created_at)
VALUES (
  'level-hermione-1',  -- ID fixe pour correspondre au code
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
  content = EXCLUDED.content;

-- Niveau 2 : Hagrid
INSERT INTO levels (id, title, description, order_index, is_active, content, created_at)
VALUES (
  'level-hagrid-1',  -- ID fixe pour correspondre au code
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
  content = EXCLUDED.content;

-- ============================================
-- VÉRIFICATION
-- ============================================

-- Afficher les niveaux créés
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
-- OPTION 2: Nettoyer et Réinsérer (DESTRUCTIF)
-- ============================================
-- ⚠️ Décommentez SEULEMENT si vous voulez tout effacer

/*
-- Supprimer les anciennes données
DELETE FROM user_level_progress;
DELETE FROM levels;

-- Puis réexécutez les INSERT ci-dessus
*/

-- ============================================
-- NOTES
-- ============================================
-- ✅ Les IDs sont fixes (level-hermione-1, level-hagrid-1)
-- ✅ Correspondent aux IDs dans src/features/story/data.ts
-- ✅ ON CONFLICT DO UPDATE = Mise à jour si existe déjà
-- ✅ Pas de suppression des données utilisateur
