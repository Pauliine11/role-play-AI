'use client';

import { trackLanguageChange } from '@/features/analytics/events';
import { StoryLevel } from '@/features/game/types';
import { Button } from '@/shared/components/ui/button';

interface GameHeaderProps {
  currentLevel: StoryLevel | undefined;
  character: string;
  isHagrid: boolean;
  language: 'fr' | 'en';
  setLanguage: (lang: 'fr' | 'en') => void;
  setShowGrimoire: (show: boolean) => void;
  t: (key: string) => string;
}

export function GameHeader({
  currentLevel,
  character: _character,
  isHagrid,
  language,
  setLanguage,
  setShowGrimoire,
  t
}: GameHeaderProps) {
  return (
    <header className="relative z-10 p-6 flex justify-between items-center border-b-2 border-[#3A2F1E] backdrop-blur-md bg-[#0E1320]/80 shadow-lg">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#C9A227] tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]" style={{ fontFamily: 'var(--font-cinzel)' }}>
            {currentLevel?.content?.location || (isHagrid ? t('rpg.hagrid.location') : t('rpg.hermione.location'))}
          </h1>
          <p className="text-[#B8A77E] text-sm italic mt-1" style={{ fontFamily: 'var(--font-merriweather)' }}>
            {isHagrid ? t('rpg.hagrid.context') : t('rpg.hermione.context')}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Bouton changement de langue */}
        <Button
          variant="language"
          onClick={() => {
            const newLang = language === 'fr' ? 'en' : 'fr';
            trackLanguageChange(language, newLang);
            setLanguage(newLang);
            window.location.reload();
          }}
          className="flex items-center gap-2"
          title={language === 'fr' ? 'Switch to English' : 'Passer en Français'}
        >
          {language === 'fr' ? '🇬🇧 EN' : '🇫🇷 FR'}
        </Button>
        
        <Button
          variant="grimoire"
          onClick={() => setShowGrimoire(true)}
          className="flex items-center gap-2"
          style={{ letterSpacing: '0.05em' }}
        >
          📜 {t('rpg.grimoire')}
        </Button>
      </div>
    </header>
  );
}
