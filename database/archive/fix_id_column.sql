-- ============================================
-- FIX: Changer le type de la colonne ID
-- ============================================
-- La colonne 'id' doit être TEXT, pas UUID

-- 1. Supprimer les anciennes données (si elles existent)
DELETE FROM user_level_progress;
DELETE FROM levels;

-- 2. Modifier le type de la colonne ID
ALTER TABLE levels 
ALTER COLUMN id TYPE TEXT;

-- 3. Modifier la contrainte de clé primaire si nécessaire
-- (Cette étape peut ne pas être nécessaire)

-- 4. Modifier la référence dans user_level_progress
ALTER TABLE user_level_progress 
ALTER COLUMN level_id TYPE TEXT;

-- 5. Insérer les niveaux avec les bons IDs (TEXT)
INSERT INTO levels (id, title, description, order_index, is_active, content, created_at)
VALUES 
  ('level-hermione-1', 
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
   NOW()),
  
  ('level-hagrid-1', 
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
   NOW());

-- 6. Vérification
SELECT 
  id,
  title,
  order_index,
  is_active,
  content->>'character' as character,
  content->>'difficulty' as difficulty
FROM levels
ORDER BY order_index;

-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================
-- level-hermione-1 | Bibliothèque de Poudlard - Hermione | 1 | true | Hermione Granger | medium
-- level-hagrid-1   | La Cabane d'Hagrid - Secret Interdit | 2 | true | Hagrid           | hard
