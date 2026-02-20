# 🔄 Instructions de Mise à Jour - Correction des Personnages

**Date :** 18 février 2026  
**Problème :** Les données en cache (localStorage + Supabase) contiennent encore les anciennes définitions des niveaux sans le bon `content.character` et `content.location`.

---

## 🚨 Symptôme Actuel

**Vous voyez :**
- Niveau Hagrid affiché visuellement (image, nom)
- Mais GPT joue le rôle d'Hermione (parle de quitter Poudlard, bibliothèque, etc.)
- Le lieu affiché est "Bibliothèque de Poudlard" au lieu de "Cabane d'Hagrid"

**Cause :**  
Les données en base de données et en localStorage datent d'avant les corrections. Elles ne contiennent pas les nouveaux champs `content.character`, `content.location`, `content.objective`, etc.

---

## ✅ Solution : Mise à Jour en 3 Étapes

### Étape 1 : Nettoyer le localStorage (depuis la console du navigateur)

1. Ouvrez votre jeu dans le navigateur
2. Appuyez sur `F12` pour ouvrir les DevTools
3. Allez dans l'onglet **Console**
4. Copiez et exécutez ce code :

```javascript
// Nettoyer le cache local
localStorage.removeItem('bertrand-story-progress');
console.log('✅ localStorage nettoyé');

// Recharger la page
window.location.reload();
```

### Étape 2 : Mettre à jour Supabase

1. Connectez-vous à votre **Supabase Dashboard**
2. Allez dans **SQL Editor**
3. Copiez et collez **TOUT** le contenu de `database/insert_levels.sql`
4. Cliquez sur **RUN** (▶️)

**⚠️ Important :** Le script utilise `ON CONFLICT (id) DO UPDATE` donc il va **écraser** les anciennes données avec les nouvelles, sans supprimer votre progression utilisateur.

### Étape 3 : Vérifier dans Supabase

Exécutez cette requête pour vérifier que tout est correct :

```sql
SELECT 
  id,
  title,
  content->>'character' as character,
  content->>'location' as location,
  content->>'objective' as objective,
  order_index
FROM levels
ORDER BY order_index;
```

**Résultat attendu :**

| id | title | character | location | objective | order_index |
|----|-------|-----------|----------|-----------|-------------|
| level-hermione-1 | Bibliothèque de Poudlard - Hermione | Hermione Granger | Bibliothèque de Poudlard | Convaincre Hermione... | 1 |
| level-hagrid-1 | La Cabane d'Hagrid - Secret Interdit | Hagrid | Cabane d'Hagrid | Découvrir le secret... | 2 |
| level-ron-1 | La Salle Commune - Ron Weasley | Ron Weasley | Salle Commune Gryffondor | Aider Ron à surmonter... | 3 |
| level-luna-1 | Tour de Serdaigle - Luna et les Nargoles | Luna Lovegood | Tour de Serdaigle | Comprendre Luna... | 4 |

---

## 🔍 Debug Automatique Ajouté

Des logs de débogage ont été ajoutés pour vous aider à identifier le problème :

### Dans la Console du Navigateur, vous verrez :

```
📖 [game/page] Level ID demandé: level-hagrid-1
📖 [game/page] Current Level: level-hagrid-1 La Cabane d'Hagrid - Secret Interdit
📖 [game/page] Level Content: { "character": "Hagrid", "location": "Cabane d'Hagrid", ... }
```

### Dans les Logs Serveur (terminal Next.js), vous verrez :

```
🎭 [playTurn] Personnage détecté: Hagrid
📍 [playTurn] Lieu: Cabane d'Hagrid
🎯 [playTurn] Objectif: Découvrir le secret d'Hagrid tout en gardant sa confiance
📝 [playTurn] Prompt généré (début): Tu es Rubeus Hagrid (Univers Harry Potter)...
```

### ⚠️ Si vous voyez ceci = PROBLÈME :

```
📖 [game/page] Level Content: {}  ← VIDE ou incomplet
🎭 [playTurn] Personnage détecté: Hermione Granger  ← Mauvais personnage
📍 [playTurn] Lieu: Poudlard  ← Lieu générique
```

**→ Cela confirme que vos données sont obsolètes. Suivez les étapes 1 et 2 ci-dessus.**

---

## 🎯 Alternative Rapide : Reset Complet du Jeu

Si vous voulez un reset complet (⚠️ perte de progression) :

```javascript
// Dans la console du navigateur (F12)
localStorage.clear();
window.location.href = '/';
```

Puis rejouez depuis le début. Les niveaux seront chargés depuis `data.ts` qui contient maintenant les bonnes données.

---

## 📞 Vérification Post-Mise à Jour

Après avoir suivi les étapes :

1. **Rechargez la page d'accueil** (`/`)
2. **Vérifiez les cartes de niveau** :
   - ✅ Hermione doit montrer "Bibliothèque de Poudlard"
   - ✅ Hagrid doit montrer "La Cabane d'Hagrid"
   - ✅ Ron doit apparaître (verrouillé)
   - ✅ Luna doit apparaître (verrouillé)

3. **Lancez le niveau Hagrid**
4. **Ouvrez la console (F12)** et vérifiez les logs de debug
5. **Envoyez un message** et vérifiez que :
   - Hagrid répond en parlant de **SA cabane**
   - Il mentionne qu'il **cache quelque chose**
   - Il est **nerveux** et **méfiant**
   - Le lieu affiché est **"Cabane d'Hagrid"** (pas "Bibliothèque")

---

## 🛠️ Si le problème persiste

Partagez-moi les logs de la console (F12) qui apparaissent quand vous :
1. Chargez le niveau Hagrid
2. Envoyez votre premier message

Je pourrai ainsi identifier exactement d'où vient le problème.
