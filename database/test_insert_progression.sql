-- ============================================
-- TEST D'INSERTION DANS user_level_progress
-- ============================================

-- ÉTAPE 1: Vérifier que la table est vide (normal au début)
SELECT COUNT(*) as nombre_progressions FROM user_level_progress;
-- Attendu: 0 (c'est normal si vous n'avez pas encore joué)

-- ÉTAPE 2: Vérifier qu'il y a des niveaux dans la table levels
SELECT 
  id,
  title,
  order_index,
  is_active
FROM levels
ORDER BY order_index;
-- Si vide → Vous devez d'abord créer un niveau via /admin/levels/new

-- ============================================
-- TEST MANUEL D'INSERTION
-- ============================================

-- ⚠️ REMPLACER LES VALEURS CI-DESSOUS:
-- 1. Récupérer votre USER_ID de Clerk (connectez-vous et regardez dans la console)
-- 2. Récupérer un LEVEL_ID depuis la requête ci-dessus

-- Exemple d'insertion manuelle pour tester:
/*
INSERT INTO user_level_progress (
  user_id, 
  level_id, 
  is_completed
)
VALUES (
  'user_2abc123xyz',  -- ← REMPLACER par votre vrai User ID
  '12345678-1234-1234-1234-123456789abc',  -- ← REMPLACER par un vrai Level ID
  false  -- En cours, pas encore complété
);
*/

-- ============================================
-- MARQUER COMME COMPLÉTÉ (pour tester le trigger)
-- ============================================
/*
UPDATE user_level_progress
SET is_completed = true
WHERE user_id = 'user_2abc123xyz'  -- ← Votre User ID
AND level_id = '12345678-1234-1234-1234-123456789abc';  -- ← Votre Level ID
*/

-- ============================================
-- VÉRIFIER L'INSERTION
-- ============================================
SELECT 
  p.user_id,
  l.title as level_title,
  p.is_completed,
  p.started_at,
  p.completed_at,
  p.updated_at
FROM user_level_progress p
JOIN levels l ON l.id = p.level_id;

-- ============================================
-- NETTOYER LE TEST (optionnel)
-- ============================================
/*
DELETE FROM user_level_progress 
WHERE user_id = 'user_2abc123xyz';  -- ← Votre User ID
*/

-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================
/*
Après insertion:
┌──────────────────┬─────────────────────────────┬──────────────┬────────────┬──────────────┬──────────────┐
│ user_id          │ level_title                 │ is_completed │ started_at │ completed_at │ updated_at   │
├──────────────────┼─────────────────────────────┼──────────────┼────────────┼──────────────┼──────────────┤
│ user_2abc123...  │ Bibliothèque... - Hermione  │ false        │ 12:30:00   │ null         │ 12:30:00     │
└──────────────────┴─────────────────────────────┴──────────────┴────────────┴──────────────┴──────────────┘

Après UPDATE (is_completed = true):
┌──────────────────┬─────────────────────────────┬──────────────┬────────────┬──────────────┬──────────────┐
│ user_id          │ level_title                 │ is_completed │ started_at │ completed_at │ updated_at   │
├──────────────────┼─────────────────────────────┼──────────────┼────────────┼──────────────┼──────────────┤
│ user_2abc123...  │ Bibliothèque... - Hermione  │ true         │ 12:30:00   │ 12:31:00     │ 12:31:00     │
└──────────────────┴─────────────────────────────┴──────────────┴────────────┴──────────────┴──────────────┘
                                                                                  ↑ Auto-rempli par le trigger !
*/
