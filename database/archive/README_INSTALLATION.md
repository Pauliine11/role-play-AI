# 🚀 Installation des Niveaux - Guide Complet

**Date :** 18 février 2026  
**Contexte :** Installation correcte des 4 niveaux (Hermione, Hagrid, Ron, Luna) dans Supabase

---

## ⚡ Exécution Rapide (2 étapes)

### Étape 1 : Convertir la colonne ID

**Fichier :** `database/01_fix_id_to_text.sql`

1. Ouvrez **Supabase Dashboard**
2. Allez dans **SQL Editor** (dans le menu gauche)
3. Copiez-collez **TOUT** le contenu de `01_fix_id_to_text.sql`
4. Cliquez sur **RUN** ▶️

**⚠️ Note :** Si vous avez déjà des données de progression utilisateur, ce script les **conserve**. Il change juste le type de la colonne.

**Résultat attendu :**
```
column_name | data_type | is_nullable
id          | text      | NO
level_id    | text      | NO
```

---

### Étape 2 : Insérer/Mettre à jour les niveaux

**Fichier :** `database/02_insert_all_levels.sql`

1. Dans le même **SQL Editor** de Supabase
2. Copiez-collez **TOUT** le contenu de `02_insert_all_levels.sql`
3. Cliquez sur **RUN** ▶️

**⚠️ Note :** Ce script utilise `ON CONFLICT DO UPDATE`, donc :
- S'il existe déjà → Il met à jour avec les nouvelles données
- S'il n'existe pas → Il crée le niveau
- **Votre progression utilisateur est conservée**

**Résultat attendu :**
```
✅ 4 rows inserted/updated

id              | title                                    | character        | location
level-hermione-1| Bibliothèque de Poudlard - Hermione     | Hermione Granger | Bibliothèque de Poudlard
level-hagrid-1  | La Cabane d'Hagrid - Secret Interdit    | Hagrid           | Cabane d'Hagrid
level-ron-1     | La Salle Commune - Ron Weasley          | Ron Weasley      | Salle Commune Gryffondor
level-luna-1    | Tour de Serdaigle - Luna et les Nargoles| Luna Lovegood    | Tour de Serdaigle
```

---

## 🔧 Étape 3 : Nettoyer le Cache Local

**Après avoir mis à jour Supabase**, nettoyez le cache du navigateur :

1. Ouvrez votre jeu dans le navigateur
2. Appuyez sur `F12` (ouvre les DevTools)
3. Allez dans l'onglet **Console**
4. Copiez-collez ce code et appuyez sur Entrée :

```javascript
localStorage.removeItem('bertrand-story-progress');
console.log('✅ Cache nettoyé - Rechargement...');
window.location.reload();
```

---

## ✅ Vérification Finale

### Dans Supabase (SQL Editor) :

```sql
-- Vérifier que tout est correct
SELECT 
  id,
  title,
  content->>'character' as character,
  content->>'location' as location,
  content->>'initial_message' as first_message_preview,
  order_index,
  is_active
FROM levels
ORDER BY order_index;
```

### Dans le Jeu :

1. **Rechargez la page d'accueil** (`/`)
2. **Vérifiez les 4 cartes de niveau** apparaissent
3. **Lancez le niveau Hagrid**
4. **Ouvrez la console (F12)** et vérifiez les logs :

```
📖 [game/page] Current Level: level-hagrid-1 La Cabane d'Hagrid
📖 [game/page] Level Content: { "character": "Hagrid", "location": "Cabane d'Hagrid", ... }
🎭 [playTurn] Personnage détecté: Hagrid
📍 [playTurn] Lieu: Cabane d'Hagrid
```

5. **Envoyez un message** - Hagrid doit répondre en parlant de **sa cabane**, être **nerveux**, et **cacher quelque chose**

---

## 🆘 Dépannage

### Erreur : "invalid input syntax for type uuid"
**Cause :** La colonne `id` est encore de type UUID  
**Solution :** Exécutez `01_fix_id_to_text.sql`

### Erreur : "duplicate key value violates unique constraint"
**Cause :** L'ID existe déjà mais le script n'a pas pu faire l'UPDATE  
**Solution :** Vérifiez que vous avez bien `ON CONFLICT (id) DO UPDATE` dans le script

### Hagrid parle toujours comme Hermione
**Cause :** Le cache localStorage contient les anciennes données  
**Solution :** Nettoyez le localStorage (Étape 3 ci-dessus)

### Les niveaux Ron et Luna n'apparaissent pas
**Cause :** Ils n'ont pas été insérés en base ou `is_active = false`  
**Solution :** Ré-exécutez `02_insert_all_levels.sql` et vérifiez avec la requête SELECT

---

## 📌 Ordre d'Exécution (Important)

```
1️⃣ 01_fix_id_to_text.sql        (Change UUID → TEXT)
                ↓
2️⃣ 02_insert_all_levels.sql     (Insère les 4 niveaux)
                ↓
3️⃣ Console navigateur            (Nettoie localStorage)
                ↓
4️⃣ Tester le jeu                 (Vérifier Hagrid, Ron, Luna)
```

---

## 🎯 Alternative : Script Tout-en-Un

Si vous préférez **tout faire en une fois** (⚠️ supprime les données existantes) :

**Fichier :** `database/fix_id_column.sql` (existe déjà)

⚠️ **ATTENTION :** Ce script supprime TOUTES vos données avec `DELETE FROM levels` et `DELETE FROM user_level_progress`.

Utilisez-le SEULEMENT si :
- Vous êtes en développement/test
- Vous n'avez pas de données importantes à conserver
- Vous voulez repartir de zéro

---

## ✨ Après l'Installation

Une fois tout configuré, vous aurez :

- ✅ **4 niveaux** fonctionnels avec progression linéaire
- ✅ **Chaque personnage** a son histoire unique
- ✅ **Lieux corrects** affichés dans le header
- ✅ **Messages GPT** cohérents avec le personnage
- ✅ **Traductions FR/EN** complètes

**Progression :**  
Hermione (débloqué) → Hagrid (après Hermione) → Ron (après Hagrid) → Luna (après Ron)
