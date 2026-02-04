'use client';

import Link from 'next/link';
import { useStoryProgression } from '@/features/game/hooks/useStoryProgression';
import Image from 'next/image';
import { NavbarResponsive } from '@/shared/components/layout/NavbarResponsive';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import { Footer } from '@/shared/components/layout/Footer';
import { useSidebar } from '@/shared/hooks/useSidebar';
import { useLanguage } from '@/shared/providers/LanguageContext';

export default function HomePage() {
  const { levels, isLoading } = useStoryProgression();
  const { isOpen, isMobile } = useSidebar();
  const { t, language } = useLanguage();

  if (isLoading) {
    return (
      <>
        <NavbarResponsive variant="default" />
        <Sidebar variant="default" />
        <div className={`min-h-screen bg-gray-900 flex items-center justify-center transition-all duration-300 ${
          isMobile ? '' : (isOpen ? 'ml-64' : 'ml-16')
        } pt-16 pb-20`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Chargement des niveaux...</p>
          </div>
        </div>
        <Footer variant="default" />
      </>
    );
  }

  return (
    <>
      <NavbarResponsive variant="default" />
      <Sidebar variant="default" />
      
      <div className={`min-h-screen text-[#E6D5A7] transition-all duration-300 ${
        isMobile ? '' : (isOpen ? 'ml-64' : 'ml-16')
      } pt-16 pb-20 relative`}>
        {/* Background géré par body::before dans globals.css */}

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative w-64 h-64 md:w-80 md:h-40 flex items-center justify-center">
              <Image
                src="/logoGrimoire.png"
                alt="Logo"
                width={320}
                height={320}
                className="object-contain drop-shadow-[0_6px_24px_rgba(201,162,39,0.4)]"
                priority
              />
            </div>
          </div>
          <h1 style={{ fontFamily: 'var(--font-cinzel)' }} className="text-5xl md:text-6xl font-bold mb-4 text-[#C9A227] tracking-wide drop-shadow-[0_2px_8px_rgba(201,162,39,0.4)]">
            {t('nav.title')}
          </h1>
          <p style={{ fontFamily: 'var(--font-merriweather)' }} className="text-xl text-[#B8A77E] max-w-2xl mx-auto mb-6">
            {t('rpg.selectSubtitle')}
          </p>
        </div>

        {/* Levels Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {levels.map((level) => {
            const character = level.content?.character || 'Hermione Granger';
            const isHermione = character.toLowerCase().includes('hermione');
            const isHagrid = character.toLowerCase().includes('hagrid');
            const isRon = character.toLowerCase().includes('ron');
            const isLuna = character.toLowerCase().includes('luna');
            
            // Déterminer la clé de traduction du niveau
            const levelKey = isHagrid 
              ? 'hagrid' 
              : isRon 
              ? 'ron' 
              : isLuna 
              ? 'luna' 
              : 'hermione';
            
            // Obtenir le titre et la description traduits
            const levelTitle = t(`level.${levelKey}.title`) || level.title;
            const levelDescription = t(`level.${levelKey}.description`) || level.description;
            
            // Déterminer l'image de fond
            const imagePath = isHagrid 
              ? '/hagrid/neutral.jpg' 
              : isRon
              ? '/ron/neutral.png'
              : isLuna
              ? '/luna/neutral.png'
              : '/hermione/neutral.jpg';

            // Déterminer le statut
            const isLocked = level.status === 'locked';
            const isCompleted = level.status === 'completed';

            return (
              <Link
                key={level.id}
                href={isLocked ? '#' : `/game?levelId=${level.id}`}
                className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.6)] ${
                  isLocked
                    ? 'border-[#3A2F1E] opacity-60 cursor-not-allowed'
                    : isCompleted
                    ? 'border-[#C9A227] hover:border-[#E6C847] hover:shadow-[0_8px_32px_rgba(230,200,71,0.4)]'
                    : 'border-[#8C6A3F] hover:border-[#C9A227] hover:shadow-[0_8px_32px_rgba(201,162,39,0.25)]'
                } ${!isLocked && 'hover:scale-[1.02]'}`}
                onClick={(e) => {
                  if (isLocked) {
                    e.preventDefault();
                  }
                }}
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={imagePath}
                    alt={character}
                    fill
                    className={`${isRon || isLuna ? 'object-contain' : 'object-cover'} ${isLocked ? 'grayscale' : 'group-hover:scale-110 transition-transform duration-500'}`}
                    style={{ objectPosition: isHagrid ? 'center 30%' : 'center center' }}
                  />
                  <div className={`absolute inset-0 ${
                    isLocked 
                      ? 'bg-[#0E1320]/90' 
                      : 'bg-gradient-to-t from-[#0E1320] via-[#0E1320]/85 to-[#0E1320]/40'
                  }`}></div>
                </div>

                {/* Content */}
                <div className="relative z-10 p-8 min-h-[320px] flex flex-col justify-between">
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <div className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm transition-all ${
                      isCompleted
                        ? 'bg-[#C9A227]/60 text-[#0E1320] border-2 border-[#E6C847] shadow-[0_0_16px_rgba(230,200,71,0.5)] font-bold'
                        : isLocked
                        ? 'bg-[#1a1410]/60 text-[#8C7A5E] border border-[#3A2F1E]'
                        : 'bg-[#8C6A3F]/50 text-[#E6D5A7] border border-[#9A7920] shadow-[0_0_8px_rgba(140,106,63,0.3)]'
                    }`} style={{ fontFamily: 'var(--font-cinzel)' }}>
                      {isCompleted ? t('rpg.status.completed') : isLocked ? t('rpg.status.locked') : t('rpg.status.available')}
                    </div>
                  </div>

                  {/* Title & Character */}
                  <div>
                    <h2 className={`text-3xl font-bold mb-3 transition-colors drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] ${
                      isCompleted 
                        ? 'text-[#E6C847] group-hover:text-[#F5E68C]' 
                        : 'text-[#C9A227] group-hover:text-[#E6C847]'
                    }`} style={{ fontFamily: 'var(--font-cinzel)' }}>
                      {levelTitle}
                    </h2>
                    
                    {/* Character Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#6B4F2F]/30 backdrop-blur-sm rounded-full border border-[#3A2F1E] mb-4">
                      <span className="text-sm font-medium text-[#E6D5A7]" style={{ fontFamily: 'var(--font-merriweather)' }}>{character}</span>
                    </div>

                    <p className="text-[#B8A77E] text-base leading-relaxed" style={{ fontFamily: 'var(--font-merriweather)' }}>
                      {levelDescription}
                    </p>
                  </div>

                  {/* Play Button */}
                  {!isLocked && (
                    <div className="mt-6">
                      <div className={`w-full py-3 px-6 rounded-lg text-center font-semibold transition-all border-2 shadow-lg ${
                        isCompleted
                          ? 'bg-[#C9A227] group-hover:bg-[#E6C847] text-[#0E1320] border-[#E6C847] hover:border-[#F5E68C] hover:shadow-[0_4px_20px_rgba(230,200,71,0.6)] font-bold'
                          : 'bg-[#8C6A3F] group-hover:bg-[#C9A227] text-[#E6D5A7] border-[#9A7920] hover:border-[#C9A227] hover:shadow-[0_4px_16px_rgba(201,162,39,0.4)]'
                      }`} style={{ fontFamily: 'var(--font-cinzel)', letterSpacing: '0.05em' }}>
                        {isCompleted ? t('rpg.button.replay') : t('rpg.button.start')} →
                      </div>
                    </div>
                  )}

                  {isLocked && (
                    <div className="mt-6">
                      <div className="w-full py-3 px-6 rounded-lg text-center font-semibold bg-[#1a1410] text-[#5a4028] border border-[#3A2F1E] cursor-not-allowed opacity-60" style={{ fontFamily: 'var(--font-cinzel)', letterSpacing: '0.05em' }}>
                        {t('rpg.button.locked')}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {levels.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">📖</div>
            <h2 className="text-2xl font-serif text-gray-300 mb-4">{t('rpg.emptyTitle')}</h2>
            <p className="text-gray-500">
              {t('rpg.emptySubtitle')}
            </p>
          </div>
        )}

        {/* Admin Link */}
        <div className="mt-16 text-center">
          <Link
            href="/admin/levels/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <span>🛠️</span>
            <span>{t('rpg.admin.create')}</span>
          </Link>
        </div>
        </div>
      </div>
      
      <Footer variant="default" />
    </>
  );
}
