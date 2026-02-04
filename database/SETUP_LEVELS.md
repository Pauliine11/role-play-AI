# 🎮 Configuration des Niveaux - Base de Données

## 🎯 Objectif

Charger les niveaux **Hermione** et **Hagrid** depuis la table `levels` dans Supabase, au lieu d'utiliser des niveaux hardcodés.

---

## 📋 Étapes d'Installation

### Étape 1: Insérer les Niveaux dans Supabase

```bash
# 1. Ouvrir Supabase Dashboard
# 2. Aller dans SQL Editor
# 3. Copier-coller le contenu de: database/insert_levels.sql
# 4. Exécuter (Run)
```

**Résultat attendu:**
```
INSERT 0 1  (Hermione)
INSERT 0 1  (Hagrid)

┌──────────────────┬──────────────────────────────────┬──────────┐
│ id               │ title                            │ is_active│
├──────────────────┼──────────────────────────────────┼──────────┤
│ level-hermione-1 │ Bibliothèque de Poudlard - ...   │ true     │
│ level-hagrid-1   │ La Cabane d'Hagrid - ...         │ true     │
└──────────────────┴──────────────────────────────────┴──────────┘
```

---

### Étape 2: Vérifier dans Supabase

```sql
-- Vérifier que les niveaux sont bien insérés
SELECT 
  id,
  title,
  order_index,
  is_active
FROM levels
ORDER BY order_index;
```

**Vous devriez voir:**
```
level-hermione-1 | Bibliothèque de Poudlard - Hermione | 1 | true
level-hagrid-1   | La Cabane d'Hagrid - Secret Interdit | 2 | true
```

---

### Étape 3: Tester l'Application

```bash
# 1. Rafraîchir la page d'accueil (F5)
# 2. Ouvrir la console (F12)
# 3. Vérifier les logs
```

**Logs attendus:**
```javascript
✅ Niveaux chargés depuis Supabase: 2 niveau(x)
   Niveaux: Bibliothèque de Poudlard - Hermione, La Cabane d'Hagrid - Secret Interdit
```

---

## 🔄 Comment ça Marche

### Flux de Chargement

```
1. Application démarre
   └── useStoryProgression() s'initialise

2. Chargement des niveaux
   ├── Appel: fetchUserProgression()
   │   └── SELECT * FROM levels WHERE is_active = true
   │
   ├── Si niveaux trouvés en DB:
   │   ├── ✅ Utiliser les niveaux de la DB
   │   ├── Calculer le statut (completed/unlocked/locked)
   │   └── Sauvegarder dans localStorage (cache)
   │
   └── Si DB vide:
       ├── ⚠️ Warning dans la console
       ├── Fallback sur localStorage
       └── Ou utiliser INITIAL_STORY_LEVELS (hardcodé)

3. Page d'accueil affiche les niveaux
   └── Grid avec cartes Hermione et Hagrid
```

---

## 📊 Structure de la Table `levels`

```sql
CREATE TABLE levels (
  id TEXT PRIMARY KEY,              -- 'level-hermione-1', 'level-hagrid-1'
  title TEXT NOT NULL,              -- Titre affiché
  description TEXT,                 -- Description courte
  order_index INTEGER NOT NULL,    -- Ordre d'affichage (1, 2, 3...)
  is_active BOOLEAN DEFAULT true,  -- Visible ou caché
  content JSONB,                    -- Configuration du niveau
  created_at TIMESTAMPTZ
);
```

### Contenu JSONB

```json
{
  "character": "Hermione Granger",
  "initial_mood": "sad",
  "location": "Bibliothèque de Poudlard",
  "initial_message": "Je... je ne sais pas...",
  "objective": "Redonner espoir à Hermione",
  "difficulty": "medium",
  "win_conditions": [...],
  "lose_conditions": [...],
  "suggested_actions": [...]
}
```

---

## 🎮 Calcul des Statuts

```typescript
Pour chaque niveau:

1. Si complété dans user_level_progress
   └── status = 'completed' ✓

2. Sinon, si c'est le premier niveau OU le niveau précédent est complété
   └── status = 'unlocked' ▶

3. Sinon
   └── status = 'locked' 🔒
```

**Exemple:**
```
Hermione (ordre 1):
├── Pas de niveau précédent
└── Status: 'unlocked' ▶

Hagrid (ordre 2):
├── Niveau précédent: Hermione
├── Hermione complétée ? NON
└── Status: 'locked' 🔒

Après avoir battu Hermione:
├── Hermione complétée ? OUI
└── Hagrid status: 'unlocked' ▶
```

---

## 🔍 Debug

### Si les Niveaux ne S'affichent Pas

#### 1. Vérifier la Base de Données
```sql
SELECT COUNT(*) FROM levels WHERE is_active = true;
-- Devrait retourner: 2
```

#### 2. Vérifier la Console
```javascript
// Chercher ces messages:
✅ Niveaux chargés depuis Supabase: 2 niveau(x)

// Ou ce warning:
⚠️ Aucun niveau trouvé en base de données
→ Vérifiez que vous avez exécuté database/insert_levels.sql
```

#### 3. Vérifier les IDs
```sql
SELECT id FROM levels;
-- Doit retourner:
-- level-hermione-1
-- level-hagrid-1

-- PAS:
-- 5e3f4a2b-... (UUID généré aléatoirement)
```

**Important:** Les IDs doivent être **exactement** `level-hermione-1` et `level-hagrid-1` pour correspondre au code.

---

## 🆕 Ajouter un Nouveau Niveau

```sql
INSERT INTO levels (id, title, description, order_index, is_active, content)
VALUES (
  'level-luna-1',  -- ID unique
  'Tour de Serdaigle - Luna',
  'Luna cherche des Nargoles...',
  3,  -- Ordre après Hagrid
  true,
  '{
    "character": "Luna Lovegood",
    "initial_mood": "dreamy",
    "difficulty": "easy"
  }'::jsonb
);
```

**Le niveau apparaîtra automatiquement** sur la page d'accueil !

---

## 🔄 Synchronisation

### Niveaux en DB ↔ Page d'Accueil

```
Base de Données          Hook                 Page d'Accueil
┌─────────────┐         ┌──────────┐         ┌────────────┐
│   levels    │  -----> │useStory  │  -----> │   Cards    │
│             │ fetch   │Progress  │  state  │   Grid     │
│ hermione ✓  │         │          │         │ hermione ✓ │
│ hagrid   ✓  │         │          │         │ hagrid   ✓ │
└─────────────┘         └──────────┘         └────────────┘
```

---

## ✅ Avantages de la DB

```
✅ Niveaux centralisés
✅ Facile d'ajouter/modifier des niveaux (SQL)
✅ Pas besoin de redéployer l'app
✅ Administration via Supabase UI
✅ Partage entre tous les utilisateurs
✅ Versionning via migrations SQL
```

---

## 📝 Logs Améliorés

Vous verrez maintenant dans la console:

```javascript
// Cas 1: Succès
✅ Niveaux chargés depuis Supabase: 2 niveau(x)
   Niveaux: Bibliothèque de Poudlard - Hermione, La Cabane d'Hagrid - Secret Interdit

// Cas 2: DB vide
⚠️ Aucun niveau trouvé en base de données
   → Vérifiez que vous avez exécuté database/insert_levels.sql
📦 Niveaux chargés depuis localStorage (fallback)

// Cas 3: Première visite + DB vide
🆕 Première visite - niveaux par défaut (hardcodés)
   → Pour utiliser la DB, exécutez: database/insert_levels.sql
```

---

## 🧪 Test Complet

### Scénario 1: Avec DB
```bash
1. Exécuter insert_levels.sql ✓
2. Ouvrir l'app
3. Console: "✅ Niveaux chargés depuis Supabase: 2"
4. Page affiche: Hermione ▶ + Hagrid 🔒
5. Jouer Hermione → Gagner
6. Rafraîchir (F5)
7. Page affiche: Hermione ✓ + Hagrid ▶
```

### Scénario 2: Sans DB (Fallback)
```bash
1. NE PAS exécuter insert_levels.sql
2. Ouvrir l'app
3. Console: "⚠️ Aucun niveau trouvé en base de données"
4. Console: "🆕 Première visite - niveaux par défaut"
5. Page affiche quand même: Hermione + Hagrid (hardcodés)
```

---

## 🎯 Checklist

- [ ] Script `insert_levels.sql` exécuté dans Supabase
- [ ] 2 niveaux visibles dans la table `levels`
- [ ] IDs corrects: `level-hermione-1` et `level-hagrid-1`
- [ ] `is_active = true` pour les deux niveaux
- [ ] Page rafraîchie (F5)
- [ ] Console affiche: "✅ Niveaux chargés depuis Supabase"
- [ ] Page d'accueil affiche les 2 cartes
- [ ] Hermione est débloquée (▶)
- [ ] Hagrid est verrouillé (🔒)

---

**🎉 Vos niveaux sont maintenant gérés par la base de données ! 🗄️🎮✨**
