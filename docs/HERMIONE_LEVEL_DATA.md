# 📋 Données pour Créer le Niveau Hermione

## 🎯 Comment Créer le Niveau via le Formulaire Admin

### 1. **Ouvrir le Formulaire**

```bash
http://localhost:3000/admin/levels/new
```

---

### 2. **Remplir les Champs**

#### 📝 **Titre du Niveau**
```
Bibliothèque de Poudlard - Hermione
```

#### 🔢 **Ordre (Index)**
```
1
```

#### ✅ **Statut**
```
☑️ Actif / Visible (cocher la case)
```

#### 📄 **Description**
```
Hermione Granger est désespérée et envisage de quitter Poudlard. Parvenez à lui redonner espoir.
```

#### 🛠️ **Contenu (JSON)**

**⚠️ IMPORTANT:** Copier-coller **EXACTEMENT** ce JSON (tout d'un bloc) :

```json
{
  "character": "Hermione Granger",
  "initial_mood": "sad",
  "location": "Bibliothèque de Poudlard",
  "initial_message": "Je... je ne sais pas ce que je fais encore ici. Tout semble si vain. Je pense que je vais faire mes valises ce soir.",
  "objective": "Redonner espoir à Hermione et l'empêcher de quitter Poudlard",
  "difficulty": "medium",
  "win_conditions": [
    "Hermione retrouve confiance en elle",
    "Elle décide de rester à Poudlard",
    "Son moral s'améliore significativement"
  ],
  "lose_conditions": [
    "Hermione part définitivement",
    "Elle perd tout espoir",
    "La conversation tourne mal"
  ],
  "suggested_actions": [
    "Qu'est ce qui ne va pas ?",
    "Lui rappeler Harry et Ron",
    "Lui offrir une écoute attentive",
    "Bloquer le passage"
  ]
}
```

---

### 3. **Cliquer sur "Créer le Niveau"**

Vous devriez voir:
```
✅ Niveau créé avec succès !
```

---

## 🔍 Vérification

### 1. **Base de Données**

```sql
SELECT id, title, order_index, is_active FROM levels;
```

Résultat attendu:
```
┌─────────────────────────┬──────────────────────────────┬────────┬────────┐
│ id (généré auto)        │ title                        │ order  │ active │
├─────────────────────────┼──────────────────────────────┼────────┼────────┤
│ xxxxxxxx-xxxx-xxxx-...  │ Bibliothèque... - Hermione  │ 1      │ true   │
└─────────────────────────┴──────────────────────────────┴────────┴────────┘
```

### 2. **Page d'Accueil**

```bash
http://localhost:3000/
```

Vous devriez voir la carte **Hermione** avec:
- ✅ Titre: "Bibliothèque de Poudlard - Hermione"
- ✅ Bouton: "▶ Disponible"
- ✅ Cliquable pour jouer

---

## 🚨 Si le Niveau n'Apparaît Pas

### Problème: "ID invalide - UUID requis"

Si vous obtenez une erreur lors de la création, c'est que la colonne `id` est encore en `UUID`.

**Solution:**

```sql
-- Changer le type de colonne
ALTER TABLE levels ALTER COLUMN id TYPE TEXT;

-- OU laisser UUID auto-généré (recommandé)
-- Dans ce cas, ne pas spécifier d'ID manuel
```

### Problème: "Level created" mais pas visible sur la page

1. **Vérifier la base de données:**
   ```sql
   SELECT * FROM levels;
   ```

2. **Vérifier les logs de console:**
   - Ouvrir `/test-db`
   - Regarder les logs de `fetchUserProgression()`

3. **Rafraîchir la page:**
   ```bash
   # Force refresh
   Ctrl + Shift + R (Windows/Linux)
   Cmd + Shift + R (Mac)
   ```

---

## 📊 Structure Complète Attendue

Après création, la table `levels` devrait contenir:

```json
{
  "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "title": "Bibliothèque de Poudlard - Hermione",
  "description": "Hermione Granger est désespérée...",
  "order_index": 1,
  "is_active": true,
  "content": {
    "character": "Hermione Granger",
    "initial_mood": "sad",
    "location": "Bibliothèque de Poudlard",
    "initial_message": "Je... je ne sais pas...",
    "objective": "Redonner espoir à Hermione...",
    "difficulty": "medium",
    "win_conditions": [...],
    "lose_conditions": [...],
    "suggested_actions": [...]
  },
  "created_at": "2026-01-26T...",
  "updated_at": "2026-01-26T..."
}
```

---

## 🎯 Prochaines Étapes

Après la création du niveau Hermione:

1. ✅ Niveau visible sur la page d'accueil
2. ✅ Cliquable pour jouer
3. ✅ Game Over si "moldu" mentionné
4. ✅ Progression sauvegardée dans `user_level_progress`

---

## ⚙️ Notes Techniques

- L'`id` est généré automatiquement par Supabase (UUID)
- Le `content` est stocké en JSONB
- Le `order_index` détermine l'ordre d'affichage
- Le `is_active` contrôle la visibilité

---

**🚀 Créez le niveau et dites-moi ce que vous voyez !**
