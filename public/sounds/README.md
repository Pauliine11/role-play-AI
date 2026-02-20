# 🎵 Sons Magiques - Lumos / Nox

Ce dossier contient les fichiers audio pour les effets sonores magiques du mode Lumos/Nox.

## Fichiers nécessaires

Pour activer les sons (optionnel), ajoutez les fichiers suivants dans ce dossier :

### `lumos.mp3`
- **Usage** : Son joué lors de l'activation du mode Lumos (lumière)
- **Durée recommandée** : 1-2 secondes
- **Type** : Son de sort lumineux, crépitement magique, "whoosh" lumineux
- **Volume** : Le code applique un volume de 0.3 par défaut

### `nox.mp3`
- **Usage** : Son joué lors de l'activation du mode Nox (obscurité)
- **Durée recommandée** : 1-2 secondes
- **Type** : Son d'extinction, souffle étouffé, "whoosh" sombre
- **Volume** : Le code applique un volume de 0.3 par défaut

## Sources gratuites recommandées

1. **Freesound.org** (Creative Commons)
   - Recherche : "magic spell", "whoosh", "light spell"
   - Formats : MP3, WAV (convertir en MP3 si nécessaire)

2. **Zapsplat.com** (Licence gratuite pour usage web)
   - Section : Magic / Fantasy / UI Sounds
   - Recherche : "spell cast", "magic whoosh"

3. **Mixkit.co** (Licence gratuite)
   - Section : Sound Effects
   - Catégories : Fantasy, UI, Magic

4. **Pixabay** (Domaine public)
   - Section : Sound Effects
   - Recherche : "magic", "spell", "whoosh"

## Activation des sons

Par défaut, les sons sont **désactivés** dans le composant `LumosNoxToggle`.

Pour les activer :
```tsx
<LumosNoxToggle playSound={true} />
```

## Format technique

- **Format** : MP3 (meilleure compatibilité navigateur)
- **Bitrate** : 128 kbps recommandé (bon compromis qualité/taille)
- **Taille** : < 50 KB par fichier recommandé
- **Canaux** : Mono ou Stéréo

## Note

Si les fichiers audio ne sont pas présents, le composant fonctionne normalement sans erreur (silencieux).
