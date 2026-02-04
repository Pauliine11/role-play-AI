# 🔍 Diagnostic: user_level_progress

## ❌ Erreur Rencontrée

```
ERROR: operator does not exist: uuid[] = boolean
```

**Cause:** La colonne `is_completed` a le mauvais type de données (probablement `uuid[]` au lieu de `boolean`).

---

## 🛠️ Solution Rapide

### Option 1: Recréer la Table (Recommandé)

**⚠️ Cela supprimera les données existantes dans `user_level_progress`**

```sql
-- Copier TOUT le contenu de:
database/fix_user_level_progress.sql

-- Et l'exécuter dans Supabase SQL Editor
```

**Ce que fait le script:**
1. ✅ Supprime l'ancienne table
2. ✅ Recrée avec les bons types
3. ✅ Ajoute les index
4. ✅ Configure le trigger
5. ✅ Vérifie la structure

---

## 🔍 Diagnostic Manuel

### 1. Vérifier la Structure Actuelle

```sql
SELECT 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'user_level_progress';
```

**Attendu:**
- `is_completed` → **`boolean`** (et PAS `uuid[]` ou autre)

### 2. Si le Type est Incorrect

Vous avez deux options:

#### Option A: Modifier le Type (Préserve les Données)

```sql
-- Modifier le type de la colonne
ALTER TABLE user_level_progress 
ALTER COLUMN is_completed TYPE BOOLEAN 
USING false;  -- Valeur par défaut pour conversion
```

#### Option B: Recréer (Perd les Données)

Utilisez le script `fix_user_level_progress.sql`.

---

## 📋 Script de Correction Complet

### Étape 1: Diagnostic

```sql
-- Voir la structure actuelle
\d user_level_progress

-- OU
SELECT * FROM information_schema.columns 
WHERE table_name = 'user_level_progress';
```

### Étape 2: Backup (Si Données Importantes)

```sql
-- Créer une copie de sauvegarde
CREATE TABLE user_level_progress_backup AS 
SELECT * FROM user_level_progress;
```

### Étape 3: Recréer

```sql
-- Supprimer l'ancienne
DROP TABLE IF EXISTS user_level_progress CASCADE;

-- Créer la nouvelle
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

-- Index
CREATE INDEX idx_progress_user ON user_level_progress(user_id);
CREATE INDEX idx_progress_level ON user_level_progress(level_id);
CREATE INDEX idx_progress_completed ON user_level_progress(is_completed);
```

### Étape 4: Restaurer (Si Backup)

```sql
-- Restaurer les données depuis le backup (si compatible)
INSERT INTO user_level_progress 
SELECT * FROM user_level_progress_backup;

-- Supprimer le backup
DROP TABLE user_level_progress_backup;
```

---

## 🧪 Test Final

```sql
-- Test 1: Vérifier le type
SELECT data_type 
FROM information_schema.columns 
WHERE table_name = 'user_level_progress' 
AND column_name = 'is_completed';

-- Doit retourner: boolean

-- Test 2: Insérer une ligne de test
INSERT INTO user_level_progress (user_id, level_id, is_completed)
VALUES ('test_user', (SELECT id FROM levels LIMIT 1), true);

-- Test 3: Compter
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN is_completed = true THEN 1 END) as completed
FROM user_level_progress;

-- Nettoyer le test
DELETE FROM user_level_progress WHERE user_id = 'test_user';
```

---

## 🎯 Checklist de Vérification

- [ ] Type de `is_completed` = `boolean` ✓
- [ ] Table a 7 colonnes
- [ ] 3 index créés
- [ ] Contrainte UNIQUE sur (user_id, level_id)
- [ ] Test d'insertion réussi
- [ ] Requête COUNT fonctionne

---

## 📊 Structure Finale Attendue

```sql
Table "public.user_level_progress"
┌─────────────────┬─────────────────────────┬───────────┬──────────┬─────────────────────┐
│ Column          │ Type                    │ Collation │ Nullable │ Default             │
├─────────────────┼─────────────────────────┼───────────┼──────────┼─────────────────────┤
│ id              │ uuid                    │           │ not null │ gen_random_uuid()   │
│ user_id         │ text                    │           │ not null │                     │
│ level_id        │ uuid                    │           │ not null │                     │
│ is_completed    │ boolean                 │           │ not null │ false               │
│ started_at      │ timestamp with tz       │           │          │ now()               │
│ completed_at    │ timestamp with tz       │           │          │                     │
│ updated_at      │ timestamp with tz       │           │          │ now()               │
└─────────────────┴─────────────────────────┴───────────┴──────────┴─────────────────────┘

Indexes:
    "user_level_progress_pkey" PRIMARY KEY, btree (id)
    "user_level_progress_user_id_level_id_key" UNIQUE CONSTRAINT, btree (user_id, level_id)
    "idx_progress_completed" btree (is_completed)
    "idx_progress_level" btree (level_id)
    "idx_progress_user" btree (user_id)

Foreign-key constraints:
    "user_level_progress_level_id_fkey" FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE

Triggers:
    trigger_update_completed_at BEFORE UPDATE ON user_level_progress FOR EACH ROW EXECUTE FUNCTION update_completed_at()
```

---

## 🚀 Après la Correction

1. ✅ Table recréée avec les bons types
2. ✅ Pas d'erreur dans les requêtes
3. ✅ Prêt à sauvegarder la progression
4. ✅ Testez en jouant un niveau

---

**🎯 Exécutez `fix_user_level_progress.sql` pour tout corriger d'un coup !**
