# Images de Ron Weasley

Ce dossier contient les images faciales de Ron Weasley pour les différentes humeurs dans le jeu.

## Images Requises

Vous devez ajouter les images suivantes (format PNG) :

- **angry.png** - Ron en colère, les bras croisés, regard irrité
- **desperate.png** - Ron désespéré, abattu, tête baissée
- **happy.png** - Ron souriant, détendu, heureux
- **neutral.png** - Ron neutre, expression calme
- **sad.png** - Ron triste, mélancolique, regard ailleurs

## Spécifications Techniques

- **Format :** PNG
- **Dimensions recommandées :** 800x800px minimum
- **Ratio :** 1:1 (carré) de préférence
- **Poids :** < 500KB par image pour de meilleures performances

## Utilisation dans le Code

Ces images sont utilisées dans `/src/app/game/page.tsx` :

```typescript
const characterFolder = isHagrid ? 'hagrid' : isHermione ? 'hermione' : 'ron';
const imageExt = isRon ? 'png' : 'jpg'; // Ron utilise PNG, les autres JPG
let moodImage = `/${characterFolder}/neutral.${imageExt}`;

switch (gameState.mood) {
  case 'sad': moodImage = `/${characterFolder}/sad.${imageExt}`; break;
  case 'angry': moodImage = `/${characterFolder}/angry.${imageExt}`; break;
  case 'happy': moodImage = `/${characterFolder}/happy.${imageExt}`; break;
  case 'desperate': moodImage = `/${characterFolder}/desperate.${imageExt}`; break;
  default: moodImage = `/${characterFolder}/neutral.${imageExt}`;
}
```

## Sources d'Images Suggérées

1. **Génération IA** : Midjourney, DALL-E, Stable Diffusion
2. **Banques d'images** : Unsplash, Pexels (portraits d'acteurs roux)
3. **Fan Art** : DeviantArt (avec attribution si nécessaire)
4. **Screenshots** : Films Harry Potter (attention aux droits d'auteur)

## Checklist

- [ ] angry.png
- [ ] desperate.png
- [ ] happy.png
- [ ] neutral.png
- [ ] sad.png

Une fois toutes les images ajoutées, vous pouvez supprimer ce fichier README.md.
