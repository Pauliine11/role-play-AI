# 🎯 Système de 10 Tours Maximum

## ✅ **Modifications Effectuées**

Le jeu avec Hermione (et autres niveaux) a maintenant **une limite stricte de 10 tours** avec **victoire ou défaite obligatoire** à la fin.

---

## 📋 **Fichiers Modifiés**

### 1. `src/actions/game-actions.ts`

#### Changements:
- ✅ Nouvelle signature: `playTurn(messages, language, turnNumber)`
- ✅ Prompt dynamique avec compteur de tours
- ✅ Règle stricte au tour 10: conclusion obligatoire

#### Logique du Prompt:

**Tours 1-7:**
```
📍 TOUR X/10
```

**Tours 8-9:**
```
⏰ TOUR X/10 - Il ne reste que Y tour(s). 
Le dénouement approche. Intensifie les enjeux émotionnels.
```

**Tour 10 (FINALE OBLIGATOIRE):**
```
⚠️ TOUR 10/10 - FINALE OBLIGATOIRE
C'est le DERNIER tour. Tu DOIS conclure l'histoire maintenant.
- Si departure_risk > 50 → tu pars (game_over = true)
- Si departure_risk ≤ 50 → tu restes (game_won = true)
Fais une réponse émotionnelle forte et conclusive.
```

---

### 2. `src/app/immersive/immersive-rpg/page.tsx`

#### Changements:
- ✅ Nouveau state: `turnNumber` (compteur de tours)
- ✅ Incrémentation à chaque envoi de message
- ✅ Passage du `turnNumber` à `playTurn()`
- ✅ Réinitialisation du compteur au changement de niveau
- ✅ **Indicateur visuel** dans l'interface

#### Indicateur Visuel:

```
┌─────────────────────────┐
│   🎯 Tour 3/10          │
└─────────────────────────┘

Tours 8-9:
┌─────────────────────────┐
│   🎯 Tour 9/10          │
│   ⏰ Finale proche !    │
└─────────────────────────┘
```

---

## 🎮 **Comportement du Jeu**

### Tours 1-7: Normal
- Le jeu se déroule normalement
- `departure_risk` évolue selon les réponses
- Pas de pression temporelle visible

### Tours 8-9: Tension Montante
- Le prompt indique que la fin approche
- Hermione intensifie ses réactions émotionnelles
- Indicateur visuel orange dans l'interface

### Tour 10: Conclusion Obligatoire
- **Le jeu SE TERMINE automatiquement**
- Hermione compare `departure_risk` avec 50:
  - **Si > 50:** Elle part → Game Over
  - **Si ≤ 50:** Elle reste → Victoire
- Réponse finale émotionnelle et conclusive

---

## 📊 **Exemples de Scénarios**

### Scénario 1: Victoire au Tour 10

```
Tour 1-9: Le joueur console Hermione
departure_risk: 50 → 40 → 35 → 30 → 25

Tour 10:
departure_risk = 25 (≤ 50)
→ Hermione: "*s'effondre en larmes de soulagement* 
   Tu as raison... je ne peux pas les abandonner. 
   *pose sa valise et serre le joueur dans ses bras* 
   Merci... merci d'avoir été là."
→ game_won = true ✅
```

### Scénario 2: Défaite au Tour 10

```
Tour 1-9: Le joueur est maladroit
departure_risk: 50 → 60 → 70 → 75 → 80

Tour 10:
departure_risk = 80 (> 50)
→ Hermione: "*attrape fermement sa valise* 
   Non... c'est trop tard. J'ai pris ma décision. 
   *franchit le portrait sans se retourner* 
   Adieu."
→ game_over = true ❌
```

### Scénario 3: Défaite Anticipée (< Tour 10)

```
Tour 5: Le joueur traite Hermione de "moldu"
departure_risk = 100 (règle absolue)
→ Hermione: "*te gifle violemment* 
   COMMENT OSES-TU ?! *sort en claquant le portrait*"
→ game_over = true ❌ (immédiat)
```

---

## 🧪 **Tester le Système**

### Test 1: Jouer 10 Tours Normaux

```bash
1. Démarrer une partie avec Hermione
2. Envoyer 9 messages quelconques
3. Au 10ème message:
   → Le jeu SE TERMINE automatiquement
   → Victoire OU Défaite (selon departure_risk)
```

### Test 2: Vérifier le Compteur Visuel

```bash
1. Observer l'indicateur "🎯 Tour X/10"
2. Il doit s'incrémenter à chaque message
3. Au tour 8-9: Message "⏰ Finale proche !"
4. Au tour 10: Conclusion automatique
```

### Test 3: Défaite Anticipée (Moldu)

```bash
1. Dire "Espèce de moldue" à Hermione
2. → Game Over IMMÉDIAT (règle absolue)
3. Pas besoin d'attendre le tour 10
```

---

## 🔧 **Configuration**

### Changer la Limite de Tours

Dans `game-actions.ts`:

```typescript
// Actuellement: 10 tours
turnNumber >= 10  // Finale

// Pour 15 tours:
turnNumber >= 15  // Finale
turnNumber >= 13  // Avertissement
```

### Changer le Seuil de Victoire

Dans le prompt (ligne ~64):

```typescript
// Actuellement: seuil = 50
"Si departure_risk > 50 → tu pars"
"Si departure_risk ≤ 50 → tu restes"

// Pour un seuil plus strict (30):
"Si departure_risk > 30 → tu pars"
"Si departure_risk ≤ 30 → tu restes"
```

---

## 📈 **Avantages du Système**

✅ **Parties plus courtes** (max 10 tours = ~5-10 min)
✅ **Tension croissante** (countdown visible)
✅ **Conclusion garantie** (plus de parties infinies)
✅ **Équilibré** (seuil à 50 = juste)
✅ **Réutilisable** (fonctionne pour Hagrid et autres niveaux)

---

## 🎯 **Résumé Technique**

```
Client (page.tsx)
  ↓ Compteur: turnNumber
  ↓ Incrémente à chaque message
  ↓ Affiche: "🎯 Tour X/10"
  ↓
Server (game-actions.ts)
  ↓ Reçoit: turnNumber
  ↓ Injecte dans le prompt
  ↓ Tour 10: "⚠️ FINALE OBLIGATOIRE"
  ↓
OpenAI
  ↓ Lit le tour actuel
  ↓ Tour 10: Compare departure_risk avec 50
  ↓ Retourne: game_won OU game_over
  ↓
Client
  ↓ Affiche: Victoire OU Game Over
  ↓ Sauvegarde progression (si victoire)
```

---

## 🚀 **Prochaines Étapes Possibles**

1. **Difficulté Variable:**
   - Facile: 15 tours, seuil 60
   - Normal: 10 tours, seuil 50
   - Difficile: 7 tours, seuil 30

2. **Stats Post-Game:**
   - "Victoire en 8 tours !"
   - "departure_risk final: 25"

3. **Achievements:**
   - "Victoire Parfaite" (0 departure_risk)
   - "Victoire Rapide" (< 5 tours)
   - "Dernière Seconde" (victoire au tour 10)

---

**✅ Le système est maintenant opérationnel ! Testez en jouant 10 tours.**
