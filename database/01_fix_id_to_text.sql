-- ============================================
-- ÉTAPE 1 : Convertir la colonne ID de UUID en TEXT
-- ============================================
-- ⚠️ EXÉCUTEZ CE SCRIPT EN PREMIER avant 02_insert_all_levels.sql
-- Ce script prépare la base de données pour accepter des IDs texte comme "level-hermione-1"

-- ============================================
-- OPTION A : Sans supprimer les données (RECOMMANDÉ)
-- ============================================

-- 1. Nettoyer les anciennes données UUID (pour éviter les doublons)
DELETE FROM level_runs;
DELETE FROM user_level_progress;
DELETE FROM levels;

-- 2. Supprimer temporairement TOUTES les contraintes de clé étrangère
ALTER TABLE user_level_progress 
DROP CONSTRAINT IF EXISTS user_level_progress_level_id_fkey;

ALTER TABLE level_runs
DROP CONSTRAINT IF EXISTS level_runs_level_id_fkey;

-- 3. Modifier le type de la colonne ID dans la table levels
ALTER TABLE levels 
ALTER COLUMN id TYPE TEXT;

-- 4. Modifier la colonne level_id dans user_level_progress
ALTER TABLE user_level_progress 
ALTER COLUMN level_id TYPE TEXT;

-- 5. Modifier la colonne level_id dans level_runs
ALTER TABLE level_runs
ALTER COLUMN level_id TYPE TEXT;

-- 6. Recréer les contraintes de clé étrangère
ALTER TABLE user_level_progress
ADD CONSTRAINT user_level_progress_level_id_fkey 
FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE;

ALTER TABLE level_runs
ADD CONSTRAINT level_runs_level_id_fkey 
FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE;

-- ============================================
-- OPTION B : Avec suppression des données (Si Option A échoue)
-- ============================================
-- ⚠️ Décommentez SEULEMENT si l'Option A génère une erreur
-- Cela supprimera TOUTES vos données de progression

/*
-- 1. Supprimer les anciennes données
DELETE FROM level_runs;
DELETE FROM user_level_progress;
DELETE FROM levels;

-- 2. Supprimer temporairement TOUTES les contraintes de clé étrangère
ALTER TABLE user_level_progress 
DROP CONSTRAINT IF EXISTS user_level_progress_level_id_fkey;

ALTER TABLE level_runs
DROP CONSTRAINT IF EXISTS level_runs_level_id_fkey;

-- 3. Modifier le type de la colonne ID dans la table levels
ALTER TABLE levels 
ALTER COLUMN id TYPE TEXT;

-- 4. Modifier la colonne level_id dans user_level_progress
ALTER TABLE user_level_progress 
ALTER COLUMN level_id TYPE TEXT;

-- 5. Modifier la colonne level_id dans level_runs
ALTER TABLE level_runs
ALTER COLUMN level_id TYPE TEXT;

-- 6. Recréer les contraintes de clé étrangère
ALTER TABLE user_level_progress
ADD CONSTRAINT user_level_progress_level_id_fkey 
FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE;

ALTER TABLE level_runs
ADD CONSTRAINT level_runs_level_id_fkey 
FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE;
*/

-- ============================================
-- VÉRIFICATION
-- ============================================

-- Afficher le type de colonne pour confirmer le changement
SELECT 
  table_name,
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name IN ('levels', 'user_level_progress', 'level_runs')
  AND column_name IN ('id', 'level_id')
ORDER BY table_name, column_name;

-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================
-- table_name           | column_name | data_type | is_nullable
-- level_runs           | level_id    | text      | NO
-- levels               | id          | text      | NO
-- user_level_progress  | level_id    | text      | NO

-- ============================================
-- PROCHAINE ÉTAPE
-- ============================================
-- ✅ Une fois ce script exécuté avec succès, exécutez :
--    → database/02_insert_all_levels.sql
-- 
-- Cela insérera les 4 niveaux (Hermione, Hagrid, Ron, Luna)
-- avec leurs contenus complets (character, location, objective, etc.)
