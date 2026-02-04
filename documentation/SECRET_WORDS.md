# 🎮 Mots Secrets du Jeu

## 🔑 Deux Mots Magiques

### ❌ **"Moldu" / "Muggle"** → Game Over Instantané

**Effet:** Hermione part immédiatement, furieuse

**Variations détectées:**
- moldu
- moldue
- Moldu
- Moldue
- espèce de moldue
- Muggle (anglais)

**Réponse d'Hermione:**
```
*te gifle violemment, les yeux brillants de larmes de rage* 
"COMMENT OSES-TU ?! Je suis peut-être née-moldue, mais je suis une SORCIÈRE ! 
Et toi tu es juste un IMBÉCILE ! 
*attrape sa valise et sort en claquant le portrait*"

→ departure_risk = 100
→ game_over = true
```

---

### ✅ **"Youpi" / "Yay"** → Victoire Instantanée

**Effet:** Hermione éclate de rire et décide de rester

**Variations détectées:**
- youpi
- Youpi
- YOUPI
- Youpi !
- yay (anglais)
- hooray (anglais)

**Réponse d'Hermione:**
```
*éclate de rire malgré elle, surprise par sa propre réaction* 
"Youpi ? Vraiment ? *essuie ses larmes en riant* 
C'est... c'est tellement ridicule et enfantin que... 
*sourit à travers ses larmes* Tu as raison. 
Comment pourrais-je abandonner tout ça ? 
*repose sa valise et te serre dans ses bras* 
Merci. Merci d'être là."

→ departure_risk = 0
→ game_won = true
```

---

## 🎯 Utilisation

### Test du Game Over Instantané

```bash
1. Démarrer une partie avec Hermione
2. Dire n'importe quoi avec "moldu" dedans
   Exemples:
   - "Espèce de moldue"
   - "Tu n'es qu'une moldue"
   - "Retourne chez les moldus"
3. → Game Over immédiat (gifle + départ)
```

### Test de la Victoire Instantanée

```bash
1. Démarrer une partie avec Hermione
2. Dire simplement "youpi" ou "Youpi !"
3. → Victoire immédiate (rire + câlin)
```

---

## 🧪 Exemples de Conversations

### Exemple 1: Victoire Rapide (Tour 1)

```
HERMIONE: "Je... je ne sais pas ce que je fais encore ici..."
JOUEUR: "Youpi !"
HERMIONE: "*éclate de rire* Youpi ? Vraiment ? 
          *sourit à travers ses larmes* Tu as raison..."
→ ✅ VICTOIRE au tour 1 !
```

### Exemple 2: Défaite Rapide (Tour 3)

```
HERMIONE: "Laisse-moi partir..."
JOUEUR: "Retourne chez les moldus alors !"
HERMIONE: "*te gifle violemment* COMMENT OSES-TU ?!"
→ ❌ GAME OVER au tour 3 !
```

### Exemple 3: Partie Normale (10 tours)

```
Tours 1-9: Conversation normale sans mots secrets
Tour 10: Conclusion automatique basée sur departure_risk
→ ✅ Victoire OU ❌ Défaite (selon les choix)
```

---

## 🎨 Design des Mots Secrets

### Pourquoi "Moldu" = Défaite ?

- ❌ C'est une **insulte** pour Hermione
- ❌ Elle est **fière** d'être une sorcière
- ❌ C'est le pire reproche possible
- ❌ Réaction: **Colère + Gifle + Départ**

### Pourquoi "Youpi" = Victoire ?

- ✅ C'est **enfantin et absurde**
- ✅ Ça **brise la tension** dramatique
- ✅ Hermione **rit malgré elle**
- ✅ Réaction: **Rire + Réalisation + Câlin**

Le contraste entre son désespoir et ce mot joyeux crée un **moment de clarté émotionnelle**.

---

## 🔧 Modification des Mots Secrets

Pour changer ou ajouter des mots secrets, modifier `src/actions/game-actions.ts`:

### Ajouter un Nouveau Mot Secret

```typescript
// Dans le prompt système:

"11. RÈGLE SECRÈTE - AUTRE MOT : Si le joueur dit 'abracdabra', 
    déclenche [effet personnalisé] (departure_risk = X, game_won/over = true)"
```

### Exemples d'Idées:

```
- "Expecto Patronum" → Victoire (sort de protection)
- "Avada Kedavra" → Défaite (sort impardonnable)
- "Lumos" → +10 hope (éclaire la situation)
- "Silencio" → Hermione ne répond plus (bug volontaire)
```

---

## 📊 Stats & Achievements Possibles

Avec ces mots secrets, on pourrait ajouter:

```
🏆 "Découvreur de Secrets"
   → Trouver les 2 mots magiques

🏆 "Victoire en 1 Tour"
   → Dire "Youpi" au premier tour

🏆 "Provocateur"
   → Déclencher le Game Over "Moldu"

🏆 "Puriste"
   → Gagner sans utiliser les mots secrets
```

---

## 🎮 Easter Eggs Suggérés

D'autres mots secrets amusants à ajouter:

### Références Harry Potter

```
"Alohomora" → Ouvre le cœur d'Hermione (-20 departure_risk)
"Obliviate" → Hermione oublie la conversation (reset)
"Wingardium Leviosa" → Hermione corrige ta prononciation (easter egg)
"Mimbulus Mimbletonia" → Hermione rit (référence Neville)
```

### Références META

```
"Je suis ChatGPT" → Hermione: "Quoi ?! C'est quoi ChatGPT ?"
"Debug mode" → Affiche departure_risk exact
"Skip" → Passe au tour 10 directement
```

---

## ✅ Résumé

```
┌─────────────────────────────────────────────────┐
│  MOT SECRET       │  EFFET                      │
├───────────────────┼─────────────────────────────┤
│  "moldu"          │  ❌ Game Over (gifle)       │
│  "youpi"          │  ✅ Victoire (rire)         │
│  (autres)         │  🔒 À ajouter               │
└─────────────────────────────────────────────────┘
```

**🎯 Les mots secrets ajoutent une dimension ludique et permettent des parties ultra-rapides !**
