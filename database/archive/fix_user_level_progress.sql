-- ============================================
-- FIX USER_LEVEL_PROGRESS - Diagnostic et Correction
-- ============================================

-- ÉTAPE 1: DIAGNOSTIC - Vérifier si la table existe et sa structure
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_level_progress'
ORDER BY ordinal_position;

-- Si la table a des problèmes, exécutez les commandes ci-dessous:

-- ============================================
-- OPTION 1: Recréer la table proprement
-- ============================================

-- 1. Supprimer la table existante (⚠️ supprime les données)
DROP TABLE IF EXISTS user_level_progress CASCADE;

-- 2. Recréer avec la bonne structure
CREATE TABLE user_level_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  level_id UUID NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT false NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, level_id)
);

-- 3. Créer les index
CREATE INDEX idx_progress_user ON user_level_progress(user_id);
CREATE INDEX idx_progress_level ON user_level_progress(level_id);
CREATE INDEX idx_progress_completed ON user_level_progress(is_completed);

-- 4. Créer la fonction de mise à jour auto
CREATE OR REPLACE FUNCTION update_completed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_completed = true AND (OLD.is_completed IS NULL OR OLD.is_completed = false) THEN
    NEW.completed_at = NOW();
  END IF;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Créer le trigger
CREATE TRIGGER trigger_update_completed_at
  BEFORE UPDATE ON user_level_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_completed_at();

-- ============================================
-- VÉRIFICATION FINALE
-- ============================================

-- Vérifier la structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'user_level_progress'
ORDER BY ordinal_position;

-- Test simple (ne devrait pas générer d'erreur)
SELECT COUNT(*) as total FROM user_level_progress;

-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================
/*
Colonnes attendues:
┌─────────────────┬─────────────────────┬─────────────┐
│ column_name     │ data_type           │ is_nullable │
├─────────────────┼─────────────────────┼─────────────┤
│ id              │ uuid                │ NO          │
│ user_id         │ text                │ NO          │
│ level_id        │ uuid                │ NO          │
│ is_completed    │ boolean             │ NO          │ ← DOIT être boolean !
│ started_at      │ timestamp with...   │ YES         │
│ completed_at    │ timestamp with...   │ YES         │
│ updated_at      │ timestamp with...   │ YES         │
└─────────────────┴─────────────────────┴─────────────┘

✅ Table recréée avec succès !
*/
