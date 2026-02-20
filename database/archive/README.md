# Scripts SQL Archivés

Ce dossier contient les anciens scripts SQL qui ne sont plus utilisés dans le processus de migration actuel, mais conservés pour référence historique.

## Scripts Archivés

### Migrations Obsolètes
- **fix_id_column.sql** - Ancienne version de migration ID → TEXT (remplacé par `01_fix_id_to_text.sql`)
- **migration_fix.sql** - Ancienne migration générale (intégrée dans les nouveaux scripts)

### Scripts de Setup Obsolètes
- **setup_user_level_progress.sql** - Setup initial de la table (déjà effectué)
- **fix_user_level_progress.sql** - Fix spécifique de la table progression

### Scripts d'Insertion Partiels
- **insert_hermione_only.sql** - Insertion partielle d'un seul personnage (remplacé par `02_insert_all_levels.sql`)
- **insert_levels.sql** - Doublon de `02_insert_all_levels.sql`

### Scripts de Test
- **test_insert_progression.sql** - Script de test pour l'insertion de progression
- **test_progression.sql** - Script de test pour la vérification de progression

### Schémas Non Utilisés
- **schema_conversations.sql** - Schéma de conversations (non implémenté)

---

## Scripts Actifs à Utiliser

Utilisez les scripts dans le dossier parent `database/` :

1. **01_fix_id_to_text.sql** - Migration UUID → TEXT pour les IDs
2. **02_insert_all_levels.sql** - Insertion de tous les niveaux (Hermione, Hagrid)
3. **seed.sql** - Alternative complète pour seed initial

Consultez le README principal pour les instructions d'utilisation.

---

**Date d'archivage :** 20 février 2026
