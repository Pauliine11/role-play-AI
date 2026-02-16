# 🧪 Guide de Test: Progression Utilisateur

## 📊 État Actuel

La table `user_level_progress` est **vide** ? C'est **NORMAL** ! 

Elle ne se remplit que quand :
1. ✅ Un utilisateur est connecté (Clerk)
2. ✅ Il joue à un niveau
3. ✅ Il gagne le niveau
4. ✅ Le code appelle `completeLevelAction()`

---

## 🎯 Comment Tester la Progression

### Méthode 1 : Jouer au Jeu (Recommandé)

#### 1. **Créer le Niveau Hermione**

```
http://localhost:3000/admin/levels/new
```

Remplir le formulaire avec les données de `HERMIONE_LEVEL_DATA.md`.

#### 2. **Se Connecter**

Assurez-vous d'être connecté avec Clerk (vérifier le bouton dans la navbar).

#### 3. **Jouer**

```
http://localhost:3000/
```

- Cliquer sur le niveau Hermione
- Jouer jusqu'à gagner

#### 4. **Vérifier en Base**

```sql
SELECT 
  p.user_id,
  l.title,
  p.is_completed,
  p.completed_at
FROM user_level_progress p
JOIN levels l ON l.id = p.level_id;
```

Vous devriez voir **1 ligne** avec `is_completed = true`.

---

### Méthode 2 : Test Manuel (Rapide)

#### Étape 1 : Récupérer votre User ID

**Option A : Via la Console du Navigateur**

```javascript
// Ouvrir la console (F12)
// Sur la page d'accueil, taper:
console.log('User ID:', localStorage.getItem('clerk-user-id'));
```

**Option B : Via Clerk Dashboard**

- Aller sur dashboard.clerk.com
- Users → Copier l'ID

**Option C : Via Supabase (si des sessions existent)**

```sql
-- Voir les user_id uniques dans game_sessions ou autre table
SELECT DISTINCT user_id FROM game_sessions LIMIT 5;
```

#### Étape 2 : Récupérer un Level ID

```sql
SELECT id, title FROM levels LIMIT 1;
```

Copier l'`id` (format UUID).

#### Étape 3 : Insérer Manuellement

```sql
-- REMPLACER les valeurs:
INSERT INTO user_level_progress (user_id, level_id, is_completed)
VALUES (
  'user_2abc123xyz',  -- ← VOTRE User ID
  '12345678-1234-1234-1234-123456789abc',  -- ← Level ID
  true  -- Marqué comme complété
);
```

#### Étape 4 : Vérifier

```sql
SELECT * FROM user_level_progress;
```

Devrait retourner **1 ligne**.

#### Étape 5 : Rafraîchir la Page d'Accueil

```
http://localhost:3000/
```

Le niveau devrait apparaître comme **✓ Complété**.

---

## 🔍 Diagnostics

### Problème : "Table vide après avoir gagné"

#### 1. **Vérifier les Logs du Serveur**

Dans le terminal où `npm run dev` tourne, cherchez :

```bash
# Logs de completeLevelAction
✅ Level completed: level-hermione-1
```

#### 2. **Vérifier l'Authentification**

```typescript
// Dans src/actions/progression-actions.ts
const { userId } = await auth();
console.log('User ID:', userId);  // Devrait afficher un ID
```

Si `userId` est `null` → Vous n'êtes pas connecté.

#### 3. **Vérifier que completeLevel est Appelé**

```typescript
// Dans src/app/immersive/immersive-rpg/page.tsx (ligne 123)
if (data.game_won) {
  console.log('🎉 Victory! Completing level:', currentLevel?.id);
  completeLevel(currentLevel.id);
}
```

Regardez la console du navigateur (F12).

#### 4. **Vérifier les Erreurs Supabase**

```sql
-- Voir les logs Supabase
-- Dashboard > Logs > Filter by "error"
```

---

## 📋 Checklist Complète

### Avant de Jouer

- [ ] Table `levels` contient au moins 1 niveau
- [ ] Le niveau a `is_active = true`
- [ ] Vous êtes connecté avec Clerk
- [ ] Le serveur dev tourne (`npm run dev`)

### Pendant le Jeu

- [ ] Le niveau se charge sans erreur
- [ ] Vous pouvez envoyer des messages
- [ ] Le personnage répond
- [ ] Vous gagnez la partie (victory screen)

### Après la Victoire

- [ ] Message de victoire affiché
- [ ] Console browser : "Completing level: xxx"
- [ ] Pas d'erreur dans la console
- [ ] Retour à la page d'accueil
- [ ] Niveau marqué "✓ Complété"

### En Base de Données

```sql
-- Doit retourner au moins 1 ligne
SELECT COUNT(*) FROM user_level_progress;

-- Doit montrer la progression
SELECT 
  l.title,
  p.is_completed,
  p.completed_at
FROM user_level_progress p
JOIN levels l ON l.id = p.level_id;
```

---

## 🐛 Erreurs Courantes

### 1. "Unauthorized"

**Cause:** Pas connecté avec Clerk.

**Solution:**
- Vérifier le bouton "Sign In" dans la navbar
- Se connecter
- Réessayer

### 2. "Level ID is null"

**Cause:** Le niveau n'a pas d'ID valide.

**Solution:**
```sql
-- Vérifier les IDs
SELECT id, title FROM levels;
```

### 3. "Foreign key constraint violation"

**Cause:** Le `level_id` n'existe pas dans la table `levels`.

**Solution:**
```sql
-- Vérifier que le niveau existe
SELECT id FROM levels WHERE id = 'VOTRE_LEVEL_ID';
```

---

## 🧪 Script de Test Automatique

Utilisez le fichier `database/test_insert_progression.sql` pour :

1. ✅ Vérifier que la table est vide (normal)
2. ✅ Voir les niveaux disponibles
3. ✅ Insérer une progression de test
4. ✅ Vérifier que le trigger fonctionne
5. ✅ Nettoyer les données de test

---

## 🎯 Résumé

```
Table vide = Normal au début
          ↓
Jouer et gagner un niveau
          ↓
completeLevelAction() appelé
          ↓
INSERT/UPSERT dans user_level_progress
          ↓
Vérifier: SELECT * FROM user_level_progress
          ↓
Devrait voir 1+ lignes
```

---

## 📞 Besoin d'Aide ?

Si la table reste vide après avoir gagné :

1. ✅ Copier les logs du terminal serveur
2. ✅ Copier les logs de la console browser (F12)
3. ✅ Exécuter `SELECT * FROM levels;`
4. ✅ Exécuter `SELECT * FROM user_level_progress;`
5. ✅ Me donner tous ces résultats

---

**🚀 Testez en jouant ou utilisez `test_insert_progression.sql` pour un test manuel !**
