'use client';

import { StoryLevel } from '@/features/game/types';
import { trackLevelNavigation } from '@/features/analytics/events';
import { Button } from '@/shared/components/ui/button';

interface GameOverOverlayProps {
  gameWon: boolean;
  gameOver: boolean;
  isHagrid: boolean;
  currentLevel: StoryLevel | undefined;
  levels: StoryLevel[];
  language: 'fr' | 'en';
  t: (key: string) => string;
}

export function GameOverOverlay({
  gameWon,
  gameOver,
  isHagrid,
  currentLevel,
  levels,
  language,
  t
}: GameOverOverlayProps) {
  if (!gameOver && !gameWon) return null;

  // Trouver le niveau suivant
  const currentIndex = levels.findIndex(l => l.id === currentLevel?.id);
  const nextLevel = currentIndex >= 0 && currentIndex < levels.length - 1 
    ? levels[currentIndex + 1] 
    : null;
  const isLastLevel = !nextLevel || nextLevel.status === 'locked';

  return (
    <div data-testid="game-over-overlay" className="absolute inset-0 bg-[#0E1320]/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 z-50 animate-fade-in border-4 border-[#C9A227] shadow-[inset_0_0_60px_rgba(201,162,39,0.1)]">
      <h2 
        data-testid={gameWon ? 'victory-title' : 'defeat-title'}
        className={`text-5xl font-bold mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] ${gameWon ? 'text-[#E6C847] animate-shimmer-gold' : 'text-[#8B2C2C]'}`} 
        style={{ fontFamily: 'var(--font-cinzel)', letterSpacing: '0.05em' }}
      >
        {gameWon ? t('rpg.victory') : t('rpg.gameOver')}
      </h2>
      <p className="text-xl text-[#E6D5A7] mb-8 max-w-lg" style={{ fontFamily: 'var(--font-merriweather)' }}>
        {gameWon 
          ? (isHagrid ? t('rpg.hagrid.victoryMessage') : t('rpg.hermione.victoryMessage'))
          : (isHagrid ? t('rpg.hagrid.gameOverMessage') : t('rpg.hermione.gameOverMessage'))}
      </p>
      
      {/* Boutons d'action */}
      <div className="flex gap-4">
        <Button 
          data-testid="restart-button"
          variant="ghost"
          size="lg"
          onClick={() => window.location.reload()}
          className="active:scale-95"
          style={{ letterSpacing: '0.05em' }}
        >
          {t('rpg.restart')}
        </Button>
        
        {gameWon && (
          <>
            {!isLastLevel && nextLevel ? (
              <Button 
                variant="secondary"
                size="lg"
                onClick={() => {
                  if (currentLevel) {
                    trackLevelNavigation(currentLevel.id, nextLevel.id);
                  }
                  window.location.href = `/game?levelId=${nextLevel.id}`;
                }}
                className="flex items-center gap-2 active:scale-95"
                style={{ letterSpacing: '0.05em' }}
              >
                {language === 'fr' ? 'Niveau Suivant' : 'Next Level'} →
              </Button>
            ) : (
              <Button 
                data-testid="home-button"
                variant="primary"
                size="lg"
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2 active:scale-95"
                style={{ letterSpacing: '0.05em' }}
              >
                {language === 'fr' ? 'Retour à l\'accueil' : 'Back to Home'}
              </Button>
            )}
          </>
        )}
        
        {gameOver && (
          <Button 
            data-testid="home-button"
            variant="primary"
            size="lg"
            onClick={() => window.location.href = '/'}
            className="active:scale-95"
            style={{ letterSpacing: '0.05em' }}
          >
            {language === 'fr' ? 'Retour à l\'accueil' : 'Back to Home'}
          </Button>
        )}
      </div>
    </div>
  );
}
