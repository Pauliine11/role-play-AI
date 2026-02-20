export interface GameState {
  character_reply: string;
  mood: 'sad' | 'angry' | 'neutral' | 'happy' | 'desperate' | 'nervous';
  departure_risk: number;
  game_over: boolean;
  game_won: boolean;
  suggested_actions?: string[];
  hasChallenge?: boolean;
  challengeType?: 'dementor' | 'spider' | 'fire' | 'devil-snare' | 'serpent' | 'ice-trap';
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Re-export types from submodules for convenience
export * from './game';
export * from './challenge';

