# 🚨 FIX RAPIDE - Erreur UUID

## ❌ Problème

```
ERROR: invalid input syntax for type uuid: "level-hermione-1"
```

**Cause:** La colonne `id` est de type `UUID` mais le code utilise des IDs de type `TEXT` (`'level-hermione-1'`).

---

## ✅ Solution (1 script)

### Exécutez ce Script dans Supabase

```bash
1. Ouvrir Supabase Dashboard
2. SQL Editor > New Query
3. Copier TOUT le contenu de: database/fix_id_column.sql
4. Exécuter (Run)
```

**Ce que fait le script:**
1. ✅ Supprime les anciennes données
2. ✅ Change `id` de UUID → TEXT
3. ✅ Change `level_id` de UUID → TEXT dans `user_level_progress`
4. ✅ Insère les 2 niveaux avec les bons IDs
5. ✅ Vérifie que tout est OK

---

## 📋 Script Complet (à Copier-Coller)

```sql
-- 1. Nettoyer les données existantes
DELETE FROM user_level_progress;
DELETE FROM levels;

-- 2. Modifier les types de colonnes
ALTER TABLE levels ALTER COLUMN id TYPE TEXT;
ALTER TABLE user_level_progress ALTER COLUMN level_id TYPE TEXT;

-- 3. Insérer Hermione
INSERT INTO levels (id, title, description, order_index, is_active, content)
VALUES (
  'level-hermione-1', 
  'Bibliothèque de Poudlard - Hermione', 
  'Hermione Granger est désespérée et envisage de quitter Poudlard.',
  1, 
  true, 
  '{"character": "Hermione Granger", "initial_mood": "sad", "difficulty": "medium"}'::jsonb
);

-- 4. Insérer Hagrid
INSERT INTO levels (id, title, description, order_index, is_active, content)
VALUES (
  'level-hagrid-1', 
  'La Cabane d''Hagrid - Secret Interdit', 
  'Hagrid cache quelque chose dans sa cabane.',
  2, 
  true,
  '{"character": "Hagrid", "initial_mood": "nervous", "difficulty": "hard"}'::jsonb
);

-- 5. Vérifier
SELECT id, title, order_index FROM levels ORDER BY order_index;
```

**Résultat attendu:**
```
level-hermione-1 | Bibliothèque de Poudlard - Hermione | 1
level-hagrid-1   | La Cabane d'Hagrid - Secret Interdit | 2
```

---

## 🔍 Si Erreur "cannot alter type"

Si vous obtenez une erreur lors du `ALTER TABLE`, c'est que des contraintes existent.

**Solution Alternative:**

```sql
-- Supprimer les contraintes
ALTER TABLE user_level_progress DROP CONSTRAINT IF EXISTS user_level_progress_level_id_fkey;

-- Modifier les types
ALTER TABLE levels ALTER COLUMN id TYPE TEXT;
ALTER TABLE user_level_progress ALTER COLUMN level_id TYPE TEXT;

-- Recréer la contrainte
ALTER TABLE user_level_progress 
ADD CONSTRAINT user_level_progress_level_id_fkey 
FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE;
```

---

## 🎯 Après l'Exécution

1. ✅ Rafraîchir `/test-db`
2. ✅ Vous devriez voir: "Niveaux trouvés: 2"
3. ✅ Rafraîchir la page d'accueil `/`
4. ✅ Hermione et Hagrid apparaissent !

---

## 📊 Vérification Finale

```sql
-- Vérifier les types
SELECT 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'levels' 
AND column_name = 'id';

-- Doit retourner: id | text (ou character varying)

-- Vérifier les données
SELECT * FROM levels;

-- Doit retourner 2 lignes avec level-hermione-1 et level-hagrid-1
```

---

**⚠️ Note:** Le script supprime les données existantes. Si vous avez des progressions importantes, sauvegardez-les d'abord.
