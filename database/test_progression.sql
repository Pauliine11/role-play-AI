-- ============================================
-- TEST DE LA PROGRESSION UTILISATEUR
-- ============================================

-- 1. Afficher tous les niveaux disponibles
SELECT 
  id,
  title,
  order_index,
  is_active
FROM levels
ORDER BY order_index;

-- 2. Afficher toutes les progressions existantes
SELECT 
  p.user_id,
  l.title as level_title,
  l.order_index,
  p.is_completed,
  p.started_at,
  p.completed_at,
  p.updated_at
FROM user_level_progress p
JOIN levels l ON l.id = p.level_id
ORDER BY p.user_id, l.order_index;

-- 3. Stats globales
SELECT 
  COUNT(DISTINCT user_id) as total_users,
  COUNT(*) as total_progressions,
  COUNT(CASE WHEN is_completed THEN 1 END) as total_completions,
  ROUND(
    COUNT(CASE WHEN is_completed THEN 1 END)::numeric / 
    NULLIF(COUNT(*), 0)::numeric * 100, 
    2
  ) as completion_rate_percent
FROM user_level_progress;

-- ============================================
-- TESTS MANUELS (pour simuler des progressions)
-- ============================================

-- ⚠️ REMPLACER 'YOUR_USER_ID' par votre vrai User ID de Clerk
-- ⚠️ REMPLACER 'YOUR_LEVEL_ID' par l'ID du niveau créé

/*
-- Test 1: Créer une progression "en cours"
INSERT INTO user_level_progress (user_id, level_id, is_completed)
VALUES ('YOUR_USER_ID', 'YOUR_LEVEL_ID', false)
ON CONFLICT (user_id, level_id) 
DO UPDATE SET updated_at = NOW();

-- Test 2: Marquer comme complété
UPDATE user_level_progress
SET is_completed = true
WHERE user_id = 'YOUR_USER_ID' 
AND level_id = 'YOUR_LEVEL_ID';

-- Test 3: Vérifier que completed_at s'est rempli automatiquement
SELECT 
  user_id, 
  level_id, 
  is_completed, 
  completed_at, 
  updated_at
FROM user_level_progress
WHERE user_id = 'YOUR_USER_ID';

-- Test 4: Réinitialiser pour retester
DELETE FROM user_level_progress
WHERE user_id = 'YOUR_USER_ID';
*/

-- ============================================
-- DIAGNOSTICS
-- ============================================

-- Vérifier que le trigger existe
SELECT 
  trigger_name, 
  event_manipulation, 
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'user_level_progress';

-- Vérifier que les index existent
SELECT 
  indexname, 
  indexdef
FROM pg_indexes
WHERE tablename = 'user_level_progress';

-- Vérifier les contraintes
SELECT 
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'user_level_progress'::regclass;

-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================
/*
Après avoir joué et gagné un niveau:

user_level_progress:
┌──────────────────┬────────────────────────────┬────────┬──────────────┬────────────┬──────────────┬──────────────┐
│ user_id          │ level_title                │ order  │ is_completed │ started_at │ completed_at │ updated_at   │
├──────────────────┼────────────────────────────┼────────┼──────────────┼────────────┼──────────────┼──────────────┤
│ user_2abc123...  │ Bibliothèque... - Hermione │ 1      │ true         │ 12:30:00   │ 12:45:00     │ 12:45:00     │
└──────────────────┴────────────────────────────┴────────┴──────────────┴────────────┴──────────────┴──────────────┘

Stats:
┌──────────────┬────────────────────┬───────────────────┬─────────────────────────┐
│ total_users  │ total_progressions │ total_completions │ completion_rate_percent │
├──────────────┼────────────────────┼───────────────────┼─────────────────────────┤
│ 1            │ 1                  │ 1                 │ 100.00                  │
└──────────────┴────────────────────┴───────────────────┴─────────────────────────┘

✅ Tout fonctionne !
*/
