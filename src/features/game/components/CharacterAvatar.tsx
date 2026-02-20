'use client';

import Image from 'next/image';

interface CharacterAvatarProps {
  character: string;
  moodImage: string;
  mood: string;
  isHagrid: boolean;
  turnNumber: number;
  language: 'fr' | 'en';
  t: (key: string) => string;
  characterFolder?: string;
}

export function CharacterAvatar({
  character,
  moodImage,
  mood,
  isHagrid,
  turnNumber,
  language,
  t,
  characterFolder
}: CharacterAvatarProps) {
  // Déterminer le positionnement selon le personnage
  const isRon = characterFolder === 'ron' || character.toLowerCase().includes('ron');
  const isLuna = characterFolder === 'luna' || character.toLowerCase().includes('luna');
  
  let objectPosition = 'center center';
  if (isHagrid) {
    objectPosition = 'center 30%'; // Hagrid plus haut
  } else if (isRon) {
    objectPosition = 'center 20%'; // Ron légèrement plus haut
  } else if (isLuna) {
    objectPosition = 'center 15%'; // Luna légèrement plus haut
  }
  return (
    <div className="md:w-1/3 flex flex-col items-center justify-center p-6 bg-[#141B2D]/80 rounded-xl border-2 border-[#3A2F1E] backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
      <div data-testid="character-avatar" className="relative w-48 h-48 md:w-64 md:h-64 mb-6 rounded-full overflow-hidden border-4 border-[#C9A227]/50 shadow-[0_0_24px_rgba(201,162,39,0.2)]">
        <Image
          src={moodImage}
          alt={character}
          fill
          className="object-cover transition-all duration-700"
          style={{ objectPosition }}
        />
      </div>
      <div className="text-center space-y-3">
        <h2 data-testid="character-name" className="text-2xl font-bold text-[#C9A227] mb-2 drop-shadow-lg" style={{ fontFamily: 'var(--font-cinzel)' }}>
          {character}
        </h2>
        <p data-testid="character-mood" className="text-[#E6D5A7] italic font-medium text-lg" style={{ fontFamily: 'var(--font-merriweather)' }}>
          {isHagrid ? (
            mood === 'nervous' || mood === 'sad' ? t('rpg.mood.hagrid.nervous') :
            mood === 'angry' ? t('rpg.mood.hagrid.angry') :
            mood === 'happy' ? t('rpg.mood.hagrid.happy') :
            mood === 'desperate' ? t('rpg.mood.hagrid.desperate') :
            t('rpg.mood.hagrid.neutral')
          ) : (
            mood === 'sad' ? t('rpg.mood.sad') :
            mood === 'angry' ? t('rpg.mood.angry') :
            mood === 'happy' ? t('rpg.mood.happy') :
            mood === 'desperate' ? t('rpg.mood.desperate') :
            t('rpg.mood.neutral')
          )}
        </p>
        
        {/* Indicateur de tours */}
        <div className="mt-4 p-3 bg-[#141B2D]/60 rounded-lg border-2 border-[#3A2F1E] shadow-inner">
          <p data-testid="turn-counter" className={`text-sm font-semibold ${turnNumber >= 8 ? 'text-[#D4A259]' : 'text-[#B8A77E]'}`} style={{ fontFamily: 'var(--font-cinzel)' }}>
            {language === 'fr' ? '🎯 Tour' : '🎯 Turn'} {turnNumber}/10
          </p>
          {turnNumber >= 8 && (
            <p className="text-xs text-[#D4A259] mt-1 font-medium" style={{ fontFamily: 'var(--font-merriweather)' }}>
              {language === 'fr' ? '⏰ Finale proche !' : '⏰ Finale near!'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
