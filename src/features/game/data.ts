import { StoryLevel } from '@/shared/types/game';

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
  },
  {
    id: 'level-ron-1',
    title: "La Salle Commune - Ron Weasley",
    description: "Ron doute de ses capacités et se compare sans cesse à ses frères. Aidez-le à retrouver confiance.",
    status: 'locked',
    order: 3,
    content: {
      character: 'Ron Weasley',
      location: 'Salle Commune Gryffondor',
      initial_mood: 'sad',
      objective: 'Aider Ron à surmonter son complexe d\'infériorité',
      difficulty: 'medium'
    }
  },
  {
    id: 'level-luna-1',
    title: "Tour de Serdaigle - Luna et les Nargoles",
    description: "Luna Lovegood cherche des créatures invisibles. Aidez-la dans sa quête particulière.",
    status: 'locked',
    order: 4,
    content: {
      character: 'Luna Lovegood',
      location: 'Tour de Serdaigle',
      initial_mood: 'neutral',
      objective: 'Comprendre Luna et participer à sa quête sans la ridiculiser',
      difficulty: 'easy'
    }
  }
];
