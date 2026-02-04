export type LevelStatus = 'locked' | 'unlocked' | 'completed';

export interface LevelContent {
  character?: string;
  location?: string;
  initial_mood?: string;
  objective?: string;
  difficulty?: string;
  initial_message?: string;
  time?: string;
  win_conditions?: string[];
  lose_conditions?: string[];
  suggested_actions?: string[];
  context?: string;
}

export interface StoryLevel {
  id: string;
  title: string;
  description: string;
  status: LevelStatus;
  order: number;
  content?: LevelContent;
}

