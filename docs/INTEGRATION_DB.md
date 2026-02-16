# 🎯 Guide d'Intégration Base de Données

## 🚀 Installation Rapide (3 étapes)

### 1. Créer les Tables dans Supabase

```bash
# Ouvrir Supabase Dashboard > SQL Editor
# Copier-coller le contenu de: database/schema_conversations.sql
# Exécuter ✓
```

### 2. Intégrer dans le Jeu RPG

Dans `src/app/immersive/immersive-rpg/page.tsx`, ajouter le hook:

```typescript
import { useGameSession } from '@/hooks/useGameSession';

function ImmersiveRPGContent() {
  // ... code existant ...
  
  // 🆕 Ajouter le hook de session
  const gameSession = useGameSession({
    levelId: currentLevel?.id || 'default',
    language,
    autoSave: true,
    checkAchievements: true
  });

  // 🆕 Sauvegarder les messages automatiquement
  const handleSendMessage = async (e?: FormEvent, forcedText?: string) => {
    // ... code existant ...
    
    // Sauvegarder le message utilisateur
    await gameSession.saveMessage(
      { role: 'user', content: userMessage }
    );
    
    // Enregistrer le choix
    await gameSession.recordChoice(
      userMessage,
      !!forcedText  // wasSuggested = true si c'est une suggestion
    );

    // ... appel à playTurn ...
    
    // Sauvegarder la réponse de l'IA
    await gameSession.saveMessage(
      { role: 'assistant', content: data.character_reply },
      data.mood,
      data.departure_risk
    );

    // Si game over ou victoire
    if (data.game_won) {
      await gameSession.endSession('won');
    } else if (data.game_over) {
      await gameSession.endSession('lost');
    }
  };
}
```

### 3. Vérifier dans Supabase

```sql
-- Voir les sessions
SELECT * FROM game_sessions ORDER BY started_at DESC LIMIT 10;

-- Voir les conversations
SELECT * FROM conversation_messages ORDER BY created_at DESC LIMIT 20;

-- Voir les stats
SELECT * FROM user_stats;
```

---

## 📊 Tables Créées

### ✅ Tables Principales

| Table | Description | Utilité |
|-------|-------------|---------|
| `conversation_messages` | Tous les messages | Historique, replay, analytics |
| `game_sessions` | Métadonnées des parties | Stats, durée, résultats |
| `user_stats` | Statistiques globales | Profil, progression |
| `user_achievements` | Succès débloqués | Gamification |
| `player_choices` | Choix des joueurs | Analytics, IA |
| `achievements_config` | Configuration succès | Définition des achievements |

### ✅ Vues SQL

- **`user_game_history`** - Historique complet d'un joueur
- **`leaderboard`** - Top joueurs

### ✅ Triggers Automatiques

- Met à jour `user_stats` automatiquement
- Calcule les streaks de victoires
- Incrémente les compteurs

---

## 🎮 Fonctions Disponibles

### Session de Jeu

```typescript
// Créer une session
const { sessionId } = await createGameSession(levelId, 'fr');

// Terminer une session
await updateGameSession(sessionId, 'won', finalRisk, msgCount, duration);
```

### Messages

```typescript
// Sauvegarder un message
await saveConversationMessage(
  sessionId, 
  levelId, 
  { role: 'user', content: 'Hello' },
  'happy',  // mood (optionnel)
  45        // departure_risk (optionnel)
);

// Batch de messages
await saveConversationMessages(sessionId, levelId, [
  { message: { role: 'user', content: 'Hi' } },
  { message: { role: 'assistant', content: 'Hey' }, mood: 'happy' }
]);

// Récupérer l'historique
const { sessions } = await getConversationHistory(levelId, 10);
```

### Choix des Joueurs

```typescript
// Enregistrer un choix
await savePlayerChoice(
  sessionId,
  levelId,
  "Je veux t'aider",
  true,  // wasSuggested
  'happy',  // responseMood
  -10   // riskChange
);
```

### Statistiques

```typescript
// Stats de l'utilisateur
const { stats } = await getUserStats();
console.log(stats.total_games_won);

// Leaderboard
const { leaderboard } = await getLeaderboard(10);
```

### Achievements

```typescript
// Débloquer un achievement
await unlockAchievement('first_win', {
  level: 'Hermione',
  timestamp: Date.now()
});

// Récupérer les achievements
const { achievements } = await getUserAchievements();

// Vérifier automatiquement
const { unlockedCount } = await checkAndUnlockAchievements();
```

---

## 🏆 Achievements Prédéfinis

| Key | Nom FR | Nom EN | Condition |
|-----|--------|--------|-----------|
| `first_win` | Première Victoire | First Victory | Gagner 1 partie |
| `perfect_hermione` | Diplomate Parfait | Perfect Diplomat | Gagner sans erreur |
| `speed_runner` | Éclair de Foudre | Lightning Fast | Gagner en < 5 min |
| `wordsmith` | Maître des Mots | Wordsmith | 100 messages |
| `comeback_kid` | Retour Héroïque | Comeback Kid | Gagner après 80% risque |
| `moldu_survivor` | Survivant Imprudent | Reckless Survivor | Survivre à "moldu" |

---

## 📈 Exemples de Requêtes Analytics

### Top 5 des meilleurs choix
```sql
SELECT 
  choice_text,
  AVG(risk_change) as avg_risk_reduction,
  COUNT(*) as times_used
FROM player_choices
WHERE risk_change < 0
GROUP BY choice_text
ORDER BY avg_risk_reduction ASC
LIMIT 5;
```

### Taux de victoire par personnage
```sql
SELECT 
  l.title,
  COUNT(CASE WHEN gs.outcome = 'won' THEN 1 END)::FLOAT / COUNT(*) * 100 as win_rate
FROM game_sessions gs
JOIN levels l ON l.id = gs.level_id
WHERE gs.outcome IN ('won', 'lost')
GROUP BY l.title;
```

### Progression d'un joueur dans le temps
```sql
SELECT 
  DATE(started_at) as date,
  COUNT(*) as games,
  COUNT(CASE WHEN outcome = 'won' THEN 1 END) as wins
FROM game_sessions
WHERE user_id = 'USER_ID'
GROUP BY DATE(started_at)
ORDER BY date DESC;
```

---

## 🎯 Fonctionnalités Futures

### 1. Page Profil Utilisateur
```typescript
// /app/profile/page.tsx
export default async function ProfilePage() {
  const { stats } = await getUserStats();
  const { achievements } = await getUserAchievements();
  
  return (
    <div>
      <h1>Statistiques</h1>
      <p>Parties gagnées: {stats.total_games_won}</p>
      <p>Série actuelle: {stats.current_streak}</p>
      
      <h2>Achievements</h2>
      {achievements.map(a => (
        <div key={a.id}>{a.config.icon} {a.config.title_fr}</div>
      ))}
    </div>
  );
}
```

### 2. Leaderboard
```typescript
// /app/leaderboard/page.tsx
export default async function LeaderboardPage() {
  const { leaderboard } = await getLeaderboard(100);
  
  return (
    <table>
      {leaderboard.map((user, i) => (
        <tr key={user.user_id}>
          <td>#{i + 1}</td>
          <td>{user.total_games_won} victoires</td>
          <td>{user.win_rate}% win rate</td>
        </tr>
      ))}
    </table>
  );
}
```

### 3. Replay d'une Partie
```typescript
// /app/replay/[sessionId]/page.tsx
export default async function ReplayPage({ params }) {
  const { session } = await getSessionWithMessages(params.sessionId);
  
  // Afficher les messages un par un avec délai
  return <ConversationReplay messages={session.messages} />;
}
```

### 4. Dashboard Admin
```sql
-- Statistiques globales
SELECT 
  COUNT(DISTINCT user_id) as total_users,
  COUNT(*) as total_sessions,
  AVG(duration_seconds)/60 as avg_duration_min
FROM game_sessions;
```

---

## ⚠️ Points d'Attention

### Performance
- ✅ Index créés sur toutes les colonnes importantes
- ✅ Triggers optimisés
- ⚠️ Paginer les requêtes d'historique (limit/offset)
- ⚠️ Nettoyer les vieilles sessions périodiquement

### Vie Privée
- ✅ Pas de données personnelles
- ✅ IDs anonymes (Clerk)
- ✅ Conforme RGPD
- ⚠️ Ajouter une fonction de suppression de compte

### Coûts Supabase
| Plan | Prix | Stockage | Requêtes/mois |
|------|------|----------|---------------|
| Free | $0 | 500 MB | 50,000 |
| Pro | $25 | 8 GB | 5,000,000 |

**Estimation:** 1000 parties ≈ 50 MB

---

## ✅ Checklist Post-Installation

- [ ] Tables créées dans Supabase ✓
- [ ] Hook `useGameSession` intégré dans le jeu
- [ ] Messages sauvegardés automatiquement
- [ ] Sessions créées/terminées correctement
- [ ] Achievements configurés
- [ ] Stats mises à jour automatiquement
- [ ] Tester avec une vraie partie
- [ ] Vérifier les données dans Supabase
- [ ] Créer page de profil (optionnel)
- [ ] Créer leaderboard (optionnel)

---

## 🐛 Debug

### Vérifier qu'une session est créée
```typescript
console.log('Session ID:', gameSession.sessionId);
console.log('Initialized:', gameSession.isInitialized);
```

### Voir les erreurs SQL
```typescript
// Dans conversation-actions.ts, vérifier:
console.error('Error:', error);
```

### Tester manuellement dans Supabase
```sql
-- Insérer une session de test
INSERT INTO game_sessions (user_id, level_id, outcome)
VALUES ('test', (SELECT id FROM levels LIMIT 1), 'in_progress');

-- Vérifier les stats
SELECT * FROM user_stats WHERE user_id = 'test';
```

---

**🎉 Votre base de données est prête ! Le jeu sauvegarde maintenant toutes les parties, conversations et statistiques ! 🚀**
