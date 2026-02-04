-- ============================================
-- INSERTION HERMIONE UNIQUEMENT
-- ============================================

-- 1. Vérifier le type de la colonne id (doit être TEXT, pas UUID)
-- Si erreur, exécuter d'abord: ALTER TABLE levels ALTER COLUMN id TYPE TEXT;

-- 2. Nettoyer si Hermione existe déjà (optionnel)
DELETE FROM levels WHERE id = 'level-hermione-1';

-- 3. Insérer le niveau Hermione
INSERT INTO levels (
  id, 
  title, 
  description, 
  order_index, 
  is_active, 
  content
)
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
  }'::jsonb
);

-- 4. Vérifier l'insertion
SELECT 
  id,
  title,
  description,
  order_index,
  is_active,
  content->>'character' as character,
  content->>'initial_mood' as mood,
  content->>'difficulty' as difficulty
FROM levels 
WHERE id = 'level-hermione-1';

-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================
-- level-hermione-1 | Bibliothèque de Poudlard - Hermione | ... | 1 | true | Hermione Granger | sad | medium
