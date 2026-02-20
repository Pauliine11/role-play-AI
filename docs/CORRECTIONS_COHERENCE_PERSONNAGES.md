# 🔧 Corrections de Cohérence - Personnages et Niveaux

**Date :** 18 février 2026  
**Contexte :** Corrections des anomalies détectées dans la logique des personnages, lieux, et histoires du jeu.

---

## 🎯 Problèmes Identifiés et Corrigés

### 1. ✅ Prompt GPT hardcodé pour Hermione uniquement

**Problème :**  
Le système de prompts GPT-4o-mini était entièrement hardcodé pour jouer le rôle d'Hermione Granger, peu importe le niveau sélectionné. Jouer avec Ron, Hagrid ou Luna affichait le bon personnage visuellement, mais GPT jouait toujours l'histoire d'Hermione (salle commune, partir de Poudlard, etc.).

**Solution :**
- ✅ Modifié `src/features/game/actions/game-actions.ts`
- ✅ Ajout du paramètre `levelContent?: LevelContent` à `playTurn()`
- ✅ Création d'une fonction `generateSystemPrompt()` qui génère des prompts dynamiques par personnage
- ✅ Prompts spécifiques créés pour :
  - **Hermione** : Désespoir, pression scolaire, veut quitter Poudlard
  - **Hagrid** : Cache un dragon, nerveux, peur d'être renvoyé
  - **Ron** : Complexe d'infériorité, comparaison avec ses frères et Harry
  - **Luna** : Cherche des Nargoles, incomprise, excentrique mais sage

### 2. ✅ Niveaux Ron et Luna manquants

**Problème :**  
Seuls Hermione (niveau 1) et Hagrid (niveau 2) existaient dans les données. Ron et Luna étaient référencés dans le code (traductions, musiques, images) mais n'avaient aucun niveau défini.

**Solution :**
- ✅ Ajouté `level-ron-1` (order: 3) dans `src/features/game/data.ts`
- ✅ Ajouté `level-luna-1` (order: 4) dans `src/features/game/data.ts`
- ✅ Mis à jour `database/insert_levels.sql` avec Ron et Luna
- ✅ Mis à jour `database/seed.sql` avec Ron et Luna (ordre corrigé)
- ✅ Progression correcte : Hermione → Hagrid → Ron → Luna

### 3. ✅ GameHeader affichait toujours "Bibliothèque" ou "Poudlard"

**Problème :**  
Le fallback pour `location` et `context` ne gérait que Hermione vs Hagrid. Pour Ron et Luna, le lieu affiché était toujours celui d'Hermione ("Poudlard" générique ou "Bibliothèque").

**Solution :**
- ✅ Modifié `src/features/game/components/GameHeader.tsx`
- ✅ Remplacé le paramètre `isHagrid` par `character`
- ✅ Ajout de la détection dynamique : `characterKey = isHagrid ? 'hagrid' : isRon ? 'ron' : isLuna ? 'luna' : 'hermione'`
- ✅ Utilisation de `t(\`rpg.${characterKey}.location\`)` et `t(\`rpg.${characterKey}.context\`)`

### 4. ✅ Traductions RPG manquantes pour Ron et Luna

**Problème :**  
Les clés de traduction `level.ron.title` et `level.luna.title` existaient, mais toutes les clés `rpg.ron.*` et `rpg.luna.*` manquaient (location, context, initialMessage, victoryMessage, gameOverMessage, snackbars).

**Solution :**
- ✅ Modifié `src/shared/providers/LanguageContext.tsx`
- ✅ Ajouté pour Ron (FR + EN) :
  - `rpg.ron.location`
  - `rpg.ron.context`
  - `rpg.ron.initialMessage`
  - `rpg.ron.victoryMessage`
  - `rpg.ron.gameOverMessage`
  - `rpg.ron.victorySnackbar`
  - `rpg.ron.gameOverSnackbar`
- ✅ Ajouté pour Luna (FR + EN) : mêmes clés

### 5. ✅ Fallbacks incomplets dans game/page.tsx

**Problème :**  
Les fallbacks pour `initialMessage`, `initialMood`, et `defaultSuggestions` ne géraient que Hermione vs Hagrid. Ron et Luna utilisaient les valeurs d'Hermione par défaut.

**Solution :**
- ✅ Modifié `src/app/game/page.tsx`
- ✅ Ajout de `characterKey` calculé dynamiquement
- ✅ Correction de `initialMessage` : `t(\`rpg.${characterKey}.initialMessage\`)`
- ✅ Correction de `initialMood` : gère Ron (sad), Luna (neutral), Hagrid (nervous), Hermione (sad)
- ✅ Correction de `defaultSuggestions` : ajout de suggestions spécifiques pour Ron et Luna
- ✅ Ajout du paramètre `currentLevel?.content` à l'appel `playTurn()`

### 6. ✅ GameOverOverlay ne gérait pas Ron et Luna

**Problème :**  
Les messages de victoire/défaite utilisaient uniquement `isHagrid` pour choisir entre Hermione et Hagrid.

**Solution :**
- ✅ Modifié `src/features/game/components/GameOverOverlay.tsx`
- ✅ Remplacé le paramètre `isHagrid` par `character`
- ✅ Détection dynamique du `characterKey`
- ✅ Utilisation de `t(\`rpg.${characterKey}.victoryMessage\`)` et `t(\`rpg.${characterKey}.gameOverMessage\`)`

### 7. ✅ Snackbar messages hardcodés

**Problème :**  
Les messages de snackbar (notifications) utilisaient des fallbacks Hermione/Hagrid uniquement.

**Solution :**
- ✅ Modifié `src/app/game/page.tsx` (4 occurrences corrigées)
- ✅ Utilisation de `t(\`rpg.${characterKey}.victorySnackbar\`)` et `gameOverSnackbar`

---

## 📋 Structure des Niveaux (Après Corrections)

| Ordre | ID | Personnage | Lieu | Status Initial | Thème |
|-------|----|-----------|----- |----------------|-------|
| 1 | `level-hermione-1` | Hermione Granger | Bibliothèque de Poudlard | `unlocked` | Désespoir académique |
| 2 | `level-hagrid-1` | Hagrid | Cabane d'Hagrid | `locked` | Secret du dragon |
| 3 | `level-ron-1` | Ron Weasley | Salle Commune Gryffondor | `locked` | Complexe d'infériorité |
| 4 | `level-luna-1` | Luna Lovegood | Tour de Serdaigle | `locked` | Quête des Nargoles |

**Progression :** Chaque niveau se débloque après la complétion du précédent.

---

## 🎭 Prompts GPT par Personnage

### Hermione Granger
- **Contexte :** Bibliothèque, tard le soir, veut quitter Poudlard
- **Mood initial :** sad
- **Difficulté :** medium
- **Mécanique :** Résiste fortement, émotionnelle, brillante mais terrifiée

### Hagrid
- **Contexte :** Cabane, cache un bébé dragon, nerveux
- **Mood initial :** nervous
- **Difficulté :** hard
- **Mécanique :** Très méfiant, bégaie, loyal mais craintif

### Ron Weasley
- **Contexte :** Salle commune, vient d'échouer, frustré
- **Mood initial :** sad
- **Difficulté :** medium
- **Mécanique :** Sarcastique, autodépréciation, comparaison constante avec frères/Harry

### Luna Lovegood
- **Contexte :** Tour de Serdaigle, cherche des Nargoles, incomprise
- **Mood initial :** neutral
- **Difficulté :** easy
- **Mécanique :** Sereine, rêveuse, sensible aux moqueries mais ne le montre pas

---

## 🔑 Clés de Traduction Ajoutées

### Pour Ron (`rpg.ron.*`) :
- `location`, `context`, `initialMessage`
- `victoryMessage`, `gameOverMessage`
- `victorySnackbar`, `gameOverSnackbar`

### Pour Luna (`rpg.luna.*`) :
- `location`, `context`, `initialMessage`
- `victoryMessage`, `gameOverMessage`
- `victorySnackbar`, `gameOverSnackbar`

**Langues supportées :** Français (FR) + Anglais (EN)

---

## 📊 Fichiers Modifiés

| Fichier | Type de Modification |
|---------|---------------------|
| `src/features/game/data.ts` | ✅ Ajout niveaux Ron + Luna |
| `database/insert_levels.sql` | ✅ Ajout INSERT Ron + Luna |
| `database/seed.sql` | ✅ Mise à jour ordre + Ron + Luna |
| `src/features/game/actions/game-actions.ts` | ✅ Prompt dynamique + fonction helper |
| `src/shared/providers/LanguageContext.tsx` | ✅ Ajout 14 clés de traduction (FR+EN) |
| `src/features/game/components/GameHeader.tsx` | ✅ Détection dynamique personnage |
| `src/features/game/components/GameOverOverlay.tsx` | ✅ Messages dynamiques victoire/défaite |
| `src/app/game/page.tsx` | ✅ Fallbacks + appel playTurn() + snackbars |

**Total :** 8 fichiers modifiés

---

## 🧪 Tests Recommandés

1. **Tester chaque personnage individuellement :**
   - ✅ Hermione (niveau 1) → Doit parler de quitter Poudlard, bibliothèque
   - ⏳ Hagrid (niveau 2) → Doit parler de son secret, cabane
   - ⏳ Ron (niveau 3) → Doit parler de ses frères, salle commune
   - ⏳ Luna (niveau 4) → Doit parler de Nargoles, tour de Serdaigle

2. **Vérifier la cohérence visuelle :**
   - ✅ Le lieu affiché dans GameHeader correspond au personnage
   - ✅ Le contexte affiché correspond à l'histoire
   - ✅ Les messages initiaux sont corrects

3. **Vérifier la progression :**
   - ✅ Compléter Hermione → Hagrid se débloque
   - ⏳ Compléter Hagrid → Ron se débloque
   - ⏳ Compléter Ron → Luna se débloque

4. **Vérifier la base de données :**
   - ⏳ Exécuter `database/insert_levels.sql` dans Supabase
   - ⏳ Vérifier que les 4 niveaux apparaissent avec les bons ID, order_index, et content

---

## 📌 Notes Importantes

### Moods Disponibles
Les moods suivants sont supportés dans `GameState` :
- `sad`, `angry`, `neutral`, `happy`, `desperate`, `nervous`

Luna peut utiliser `neutral` pour son état rêveur/serein.

### Mots Secrets
Les mots secrets "youpi"/"yay" fonctionnent pour **tous les personnages** (victoire instantanée).  
Les insultes spécifiques déclenchent des défaites instantanées par personnage.

### Musiques par Personnage
Définies dans `src/features/game/hooks/useBackgroundMusic.ts` :
- Hermione : `hermione-library.mp3`
- Hagrid : `hagrid-forest.mp3`
- Ron : `ron-adventure.mp3`
- Luna : `luna-dreamy.mp3`

### Images et Centrage
Les images de personnages utilisent des `objectPosition` spécifiques :
- Hermione : `center center`
- Hagrid : `center 30%`
- Ron : `center 20%`
- Luna : `center 15%`

---

## ✨ Résultat

Après ces corrections, **chaque personnage a maintenant sa propre histoire cohérente** :
- ✅ Lieu unique affiché correctement
- ✅ Contexte spécifique au personnage
- ✅ Message initial personnalisé
- ✅ Comportement GPT adapté au personnage
- ✅ Messages de victoire/défaite thématiques
- ✅ Progression logique entre les 4 niveaux

**Ordre de progression :**  
Hermione (1) → Hagrid (2) → Ron (3) → Luna (4)
