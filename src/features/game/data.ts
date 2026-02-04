import { StoryLevel } from './types';

export const INITIAL_STORY_LEVELS: StoryLevel[] = [
  {
    id: 'level-hermione-1',
    title: "Bibliothèque de Poudlard - Hermione",
    description: "Hermione révise seule à la bibliothèque. Elle semble préoccupée et songe à partir.",
    status: 'unlocked',
    order: 1,
    content: {
      character: 'Hermione Granger',
      location: 'Bibliothèque de Poudlard',
      initial_mood: 'sad',
      objective: 'Convaincre Hermione de rester à Poudlard',
      difficulty: 'medium'
    }
  },
  {
    id: 'level-hagrid-1',
    title: "La Cabane d'Hagrid - Secret Interdit",
    description: "Hagrid cache quelque chose dans sa cabane. Découvrez son secret sans le brusquer.",
    status: 'locked',
    order: 2,
    content: {
      character: 'Hagrid',
      location: "Cabane d'Hagrid",
      initial_mood: 'nervous',
      objective: "Découvrir le secret d'Hagrid tout en gardant sa confiance",
      difficulty: 'hard'
    }
  }
];
