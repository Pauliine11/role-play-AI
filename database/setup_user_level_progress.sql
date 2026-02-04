-- ============================================
-- SETUP USER_LEVEL_PROGRESS
-- ============================================
-- Ce script vérifie et crée la table user_level_progress
-- avec la bonne structure pour sauvegarder la progression

-- 1. Créer la table si elle n'existe pas
CREATE TABLE IF NOT EXISTS user_level_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  level_id UUID NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT false,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Contrainte unique: un utilisateur ne peut avoir qu'une seule progression par niveau
  UNIQUE(user_id, level_id)
);

-- 2. Créer les index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_progress_user ON user_level_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_level ON user_level_progress(level_id);
CREATE INDEX IF NOT EXISTS idx_progress_completed ON user_level_progress(is_completed);

-- 3. Créer une fonction pour mettre à jour automatiquement completed_at
CREATE OR REPLACE FUNCTION update_completed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_completed = true AND OLD.is_completed = false THEN
    NEW.completed_at = NOW();
  END IF;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Créer le trigger
DROP TRIGGER IF EXISTS trigger_update_completed_at ON user_level_progress;
CREATE TRIGGER trigger_update_completed_at
  BEFORE UPDATE ON user_level_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_completed_at();

-- ============================================
-- VÉRIFICATION
-- ============================================

-- Afficher la structure de la table
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'user_level_progress'
ORDER BY ordinal_position;

-- Compter le nombre de progressions existantes
-- Note: Cette requête peut générer une erreur si la table a un mauvais type
-- Si erreur, utilisez fix_user_level_progress.sql à la place
SELECT 
  COUNT(*) as total_progressions,
  SUM(CASE WHEN is_completed = true THEN 1 ELSE 0 END) as completed,
  COUNT(DISTINCT user_id) as unique_users
FROM user_level_progress;

-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================
/*
Structure de la table:
┌─────────────────┬─────────────────────┬─────────────┬─────────────────────┐
│ column_name     │ data_type           │ is_nullable │ column_default      │
├─────────────────┼─────────────────────┼─────────────┼─────────────────────┤
│ id              │ uuid                │ NO          │ gen_random_uuid()   │
│ user_id         │ text                │ NO          │                     │
│ level_id        │ uuid                │ NO          │                     │
│ is_completed    │ boolean             │ YES         │ false               │
│ started_at      │ timestamp with...   │ YES         │ now()               │
│ completed_at    │ timestamp with...   │ YES         │                     │
│ updated_at      │ timestamp with...   │ YES         │ now()               │
└─────────────────┴─────────────────────┴─────────────┴─────────────────────┘

✅ Table créée avec succès !
✅ Index créés
✅ Trigger configuré
*/
