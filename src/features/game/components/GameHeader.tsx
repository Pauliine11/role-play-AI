'use client';

import { trackLanguageChange } from '@/features/analytics/events';
import { StoryLevel } from '@/shared/types/game';
import { Button } from '@/shared/components/ui/button';
import { LumosNoxToggle } from '@/shared/components/ui/LumosNoxToggle';

interface GameHeaderProps {
  currentLevel: StoryLevel | undefined;
  character: string;
  isHagrid: boolean;
  language: 'fr' | 'en';
  setLanguage: (lang: 'fr' | 'en') => void;
  setShowGrimoire: (show: boolean) => void;
  t: (key: string) => string;
  challengesCompleted?: number;
}

export function GameHeader({
  currentLevel,
  character,
  isHagrid,
  language,
  setLanguage,
  setShowGrimoire,
  t,
  challengesCompleted = 0
}: GameHeaderProps) {
  // Déterminer quel personnage pour les fallbacks
  const isRon = character.toLowerCase().includes('ron');
  const isLuna = character.toLowerCase().includes('luna');
  
  // Déterminer la clé de traduction
  const characterKey = isHagrid ? 'hagrid' : isRon ? 'ron' : isLuna ? 'luna' : 'hermione';
  
  return (
    <header className="relative z-10 p-6 flex justify-between items-center border-b-2 border-[#3A2F1E] backdrop-blur-md bg-[#0E1320]/80 shadow-lg">
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#C9A227] tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]" style={{ fontFamily: 'var(--font-cinzel)' }}>
            {currentLevel?.content?.location || t(`rpg.${characterKey}.location`)}
          </h1>
          <p className="text-[#B8A77E] text-sm italic mt-1" style={{ fontFamily: 'var(--font-merriweather)' }}>
            {t(`rpg.${characterKey}.context`)}
          </p>
        </div>
        
        {/* Compteur de challenges */}
        {challengesCompleted > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-[#6B4F2F]/50 border-2 border-[#C9A227] rounded-lg">
            <span className="text-2xl">⚡</span>
            <div className="text-sm">
              <p className="text-[#C9A227] font-bold" style={{ fontFamily: 'var(--font-cinzel)' }}>
                {challengesCompleted}
              </p>
              <p className="text-[#B8A77E] text-xs" style={{ fontFamily: 'var(--font-merriweather)' }}>
                {challengesCompleted === 1 ? 'Défi' : 'Défis'}
              </p>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        {/* Bouton Lumos/Nox */}
        <LumosNoxToggle playSound={true} />
        
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
